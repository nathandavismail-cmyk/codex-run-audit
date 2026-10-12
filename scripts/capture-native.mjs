// Opt-in integration probe. All model responses and usage are synthetic.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { parseExport } from '../dist/src/parser.js';

const output = process.argv[2];
const failProvider = process.argv[3] === '--fail-provider';
const toolMode = ['--tool-success', '--tool-failure'].includes(process.argv[3]);
const failCommand = process.argv[3] === '--tool-failure';
if (
  !output ||
  (process.argv[3] && !failProvider && !toolMode) ||
  process.argv.length > 4
)
  throw new Error(
    'Usage: node scripts/capture-native.mjs <new-output-dir> [--fail-provider|--tool-success|--tool-failure]',
  );
await mkdir(resolve(output), { recursive: false, mode: 0o700 });
const root = await mkdtemp(join(tmpdir(), 'codex-run-audit-native-'));
const home = join(root, 'home');
await mkdir(home);
const requests = [];
const item = {
  id: 'mock_message',
  type: 'message',
  role: 'assistant',
  status: 'completed',
  content: [
    { type: 'output_text', text: 'RUNLENS_SYNTHETIC_OK', annotations: [] },
  ],
};
const server = createServer(async (req, res) => {
  requests.push({ method: req.method, path: req.url });
  let body = '';
  for await (const chunk of req) body += chunk;
  let responseItem = item;
  if (toolMode && requests.filter((r) => r.method === 'POST').length === 1) {
    const tools = JSON.parse(body).tools ?? [];
    const tool = tools.find((t) =>
      ['shell_command', 'exec_command'].includes(t.name),
    );
    if (!tool) {
      res.writeHead(400).end('Expected shell tool unavailable');
      return;
    }
    const command = failCommand
      ? "/bin/sh -c 'exit 7'"
      : '/usr/bin/printf CODEX_AUDIT_TOOL_OK';
    responseItem = {
      type: 'function_call',
      id: 'mock_call',
      call_id: 'probe_call',
      name: tool.name,
      arguments: JSON.stringify(
        tool.name === 'exec_command' ? { cmd: command } : { command },
      ),
    };
  }
  if (req.method !== 'POST' || req.url !== '/v1/responses') {
    res.writeHead(404).end();
    return;
  }
  if (failProvider) {
    res.writeHead(400, {
      'content-type': 'application/json',
      connection: 'close',
    });
    res.end(
      JSON.stringify({
        error: {
          message: 'RUNLENS_SYNTHETIC_PROVIDER_FAILURE',
          type: 'invalid_request_error',
          code: 'codex-run-audit_test',
        },
      }),
    );
    return;
  }
  const events = [
    {
      type: 'response.created',
      response: { id: 'mock_response', status: 'in_progress', output: [] },
    },
    {
      type: 'response.output_item.added',
      output_index: 0,
      item: { ...responseItem, status: 'in_progress', content: [] },
    },
    { type: 'response.output_item.done', output_index: 0, item: responseItem },
    {
      type: 'response.completed',
      response: {
        id: 'mock_response',
        status: 'completed',
        output: [responseItem],
        usage: {
          input_tokens: 100,
          input_tokens_details: { cached_tokens: 60 },
          output_tokens: 20,
          output_tokens_details: { reasoning_tokens: 5 },
          total_tokens: 120,
        },
      },
    },
  ];
  res.writeHead(200, {
    'content-type': 'text/event-stream',
    connection: 'close',
  });
  res.end(
    events
      .map(
        (event) => `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`,
      )
      .join(''),
  );
});
try {
  await new Promise((accept, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', accept);
  });
  const port = server.address().port;
  await writeFile(
    join(home, 'config.toml'),
    `
model = "codex-run-audit-synthetic"
model_provider = "codex-run-audit_mock"
web_search = "disabled"
[model_providers.codex-run-audit_mock]
name = "Codex Run Audit loopback mock"
base_url = "http://127.0.0.1:${port}/v1"
wire_api = "responses"
requires_openai_auth = false
request_max_retries = 0
stream_max_retries = 0
`,
  );
  const execute = (args) =>
    new Promise((accept, reject) => {
      const child = spawn('codex', args, {
        cwd: root,
        env: {
          PATH: process.env.PATH,
          HOME: home,
          CODEX_HOME: home,
          TMPDIR: tmpdir(),
          RUST_LOG: 'off',
        },
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      let stdout = '';
      let stderr = '';
      const timer = setTimeout(() => child.kill('SIGKILL'), 30_000);
      child.stdout.on('data', (chunk) => {
        stdout += chunk;
      });
      child.stderr.on('data', (chunk) => {
        stderr += chunk;
      });
      child.on('error', (error) => {
        clearTimeout(timer);
        reject(error);
      });
      child.on('close', (code) => {
        clearTimeout(timer);
        accept({ code, stdout, stderr });
      });
    });
  const version = await execute(['--version']);
  const result = await execute([
    'exec',
    '--json',
    '--ephemeral',
    '--ignore-rules',
    '--skip-git-repo-check',
    '--sandbox',
    'read-only',
    'Reply RUNLENS_SYNTHETIC_OK. Do not use tools.',
  ]);
  // Only generated thread IDs are scrubbed; no input/private history is read.
  const scrubbed = result.stdout.replace(
    /"thread_id":"[^"]+"/g,
    '"thread_id":"synthetic-thread"',
  );
  await writeFile(join(output, 'export.jsonl'), scrubbed, { mode: 0o600 });
  await writeFile(
    join(output, 'diagnostics.txt'),
    result.stderr.replaceAll(root, '<temporary-root>'),
    { mode: 0o600 },
  );
  assert.equal(
    result.code,
    failProvider ? 1 : 0,
    'Unexpected Codex exit code; inspect local diagnostics',
  );
  assert.equal(
    requests.filter((r) => r.method === 'POST').length,
    toolMode ? 2 : 1,
  );
  const report = parseExport(
    await readFile(join(output, 'export.jsonl'), 'utf8'),
    true,
  );
  assert.equal(report.execution, failProvider ? 'failed' : 'completed');
  if (failProvider) {
    assert.ok(Object.values(report.usage).every((value) => value === null));
    assert.equal(report.turns.length, 1);
    assert.equal(report.turns[0].status, 'failed');
  } else {
    assert.deepEqual(report.usage, {
      input: toolMode ? 200 : 100,
      cachedInput: toolMode ? 120 : 60,
      uncachedInput: toolMode ? 80 : 40,
      output: toolMode ? 40 : 20,
      reasoningOutput: toolMode ? 10 : 5,
    });
  }
  if (toolMode) {
    assert.equal(
      report.activity.commands,
      1,
      'Expected exactly one completed command event',
    );
    assert.equal(report.activity.failedCommands, failCommand ? 1 : 0);
    const events = scrubbed
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line));
    const command = events.find(
      (e) =>
        e.type === 'item.completed' && e.item?.type === 'command_execution',
    );
    assert.equal(command.item.exit_code, failCommand ? 7 : 0);
    if (!failCommand)
      assert.ok(command.item.aggregated_output.includes('CODEX_AUDIT_TOOL_OK'));
  }
  await writeFile(
    join(output, 'metadata.json'),
    `${JSON.stringify(
      {
        capturedAt: new Date().toISOString(),
        codexVersion: version.stdout.trim(),
        platform: process.platform,
        arch: process.arch,
        node: process.version,
        synthetic: true,
        provider: 'loopback mock; no model inference',
        scenario: process.argv[3] ?? 'success',
        requests,
        reportUsage: report.usage,
      },
      null,
      2,
    )}\n`,
    { mode: 0o600 },
  );
  console.log(
    `Native export validated: ${version.stdout.trim()}; synthetic counters only.`,
  );
} finally {
  server.closeAllConnections();
  await new Promise((accept) => server.close(accept));
  await rm(root, { recursive: true, force: true });
}
