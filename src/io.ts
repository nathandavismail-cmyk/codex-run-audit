import { constants } from 'node:fs';
import { mkdir, open, realpath, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { MAX_BYTES } from './parser.js';

export async function readInput(file: string): Promise<string> {
  const handle = await open(
    file,
    constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK,
  );
  try {
    const stat = await handle.stat();
    if (!stat.isFile()) throw new Error('Input must be a regular file');
    if (stat.size > MAX_BYTES) throw new Error('Input exceeds 32 MiB limit');
    const chunks: Buffer[] = [];
    let size = 0;
    while (true) {
      const buffer = Buffer.alloc(64 * 1024);
      const { bytesRead } = await handle.read(buffer, 0, buffer.length, null);
      if (!bytesRead) break;
      size += bytesRead;
      if (size > MAX_BYTES) throw new Error('Input grew beyond 32 MiB limit');
      chunks.push(buffer.subarray(0, bytesRead));
    }
    return new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(
      Buffer.concat(chunks),
    );
  } finally {
    await handle.close();
  }
}
export async function writeBundle(
  out: string,
  value: unknown,
  html: string,
): Promise<string> {
  const absolute = path.resolve(out);
  await mkdir(path.dirname(absolute), { recursive: true });
  const parent = await realpath(path.dirname(absolute));
  const target = path.join(parent, path.basename(absolute));
  await mkdir(target, { mode: 0o700 }); // exclusive: refuses existing dirs and symlinks
  try {
    await writeFile(
      path.join(target, 'report.json'),
      `${JSON.stringify(value, null, 2)}\n`,
      { flag: 'wx', mode: 0o600 },
    );
    await writeFile(path.join(target, 'index.html'), html, {
      flag: 'wx',
      mode: 0o600,
    });
  } catch (error) {
    await rm(target, { recursive: true, force: true });
    throw error;
  }
  return target;
}
