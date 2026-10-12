import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium, webkit } from 'playwright';

const output = path.resolve(process.argv[2] ?? 'artifacts/browser');
await mkdir(path.dirname(output), { recursive: true });
await mkdir(output);
const root = await mkdtemp(path.join(tmpdir(), 'codex-audit-browser-'));
const cli = path.resolve('dist/src/cli.js');
const run = (args) =>
  execFileSync(process.execPath, [cli, ...args], { timeout: 10_000 });
let browser;
try {
  run(['demo', '--out', path.join(root, 'demo')]);
  run([
    'analyze',
    'tests/fixtures/native-provider-failure.jsonl',
    '--synthetic',
    '--out',
    path.join(root, 'failure'),
  ]);
  run([
    'compare',
    path.join(root, 'demo', 'report.json'),
    path.join(root, 'failure', 'report.json'),
    '--out',
    path.join(root, 'comparison'),
  ]);
  const engines = process.argv.includes('--webkit')
    ? [chromium, webkit]
    : [chromium];
  for (const engine of engines) {
    browser = await engine.launch({ headless: true });
    const errors = [];
    const externalRequests = [];
    const checked = [];
    for (const width of [1280, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      page.on('pageerror', (error) => errors.push(error.message));
      await page.route(/^https?:/, (route) => {
        externalRequests.push(route.request().url());
        return route.abort();
      });
      for (const name of ['demo', 'failure', 'comparison']) {
        await page.goto(
          pathToFileURL(path.join(root, name, 'index.html')).href,
        );
        assert.equal(await page.locator('h1').count(), 1);
        assert.ok(
          (await page.locator('body').innerText()).includes(
            'Synthetic demonstration',
          ),
        );
        assert.equal(await page.locator('script').count(), 0);
        for (const anchor of await page.locator('nav a').all()) {
          const href = await anchor.getAttribute('href');
          assert.equal(await page.locator(href).count(), 1);
        }
        assert.equal(await page.locator('a[href="report.json"]').count(), 1);
        const exported = JSON.parse(
          await readFile(path.join(root, name, 'report.json'), 'utf8'),
        );
        assert.ok(exported.schema.startsWith('runlens.'));

        assert.ok(
          await page
            .locator('.metric')
            .evaluateAll((elements) =>
              elements.every(
                (element) =>
                  element.clientHeight <=
                  Number.parseFloat(getComputedStyle(element).lineHeight) + 1,
              ),
            ),
          `${name} wraps a metric at ${width}px`,
        );
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
          `${name} overflows at ${width}px`,
        );
        if (name !== 'comparison') {
          assert.ok(
            (await page.locator('body').innerText()).includes('Next step:'),
          );
          await page.locator('summary').click();
          assert.equal(await page.locator('details').getAttribute('open'), '');
          await page.locator('summary').click();
          assert.equal(await page.locator('a[href="report.json"]').count(), 1);
        }
        await page.evaluate(() =>
          window.scrollTo({ top: 0, behavior: 'instant' }),
        );
        await page.screenshot({
          path: path.join(output, `${engine.name()}-${name}-${width}.png`),
          fullPage: true,
        });
        if (process.argv.includes('--emit-screenshots')) {
          const file = `${engine.name()}-${name}-${width}.png`;
          const base64 = (await readFile(path.join(output, file))).toString(
            'base64',
          );
          for (let offset = 0; offset < base64.length; offset += 1000)
            console.log(
              `CRA_IMAGE ${file} ${offset / 1000} ${base64.slice(offset, offset + 1000)}`,
            );
        }
        checked.push({ name, width });
      }
      await page.close();
    }
    assert.deepEqual(errors, []);
    assert.deepEqual(externalRequests, []);
    const result = {
      passed: true,
      engine: engine.name(),
      browser: browser.version(),
      platform: process.platform,
      checked,
      pageErrors: errors.length,
      externalRequests: externalRequests.length,
    };
    await writeFile(
      path.join(output, `${engine.name()}-results.json`),
      `${JSON.stringify(result, null, 2)}\n`,
    );
    console.log(JSON.stringify(result));
    await browser.close();
  }
} finally {
  await browser?.close();
  await rm(root, { recursive: true, force: true });
}
