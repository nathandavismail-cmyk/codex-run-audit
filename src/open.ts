import { execFile } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

const execute = promisify(execFile);
export function browserLaunch(platform: string, report: string) {
  const url = pathToFileURL(path.resolve(report)).href;
  if (platform === 'darwin')
    return { command: '/usr/bin/open', args: ['-a', 'Safari', url] };
  if (platform === 'linux') return { command: 'xdg-open', args: [url] };
  return null;
}

// Only the newly generated local report is opened. No shell, imported commands,
// custom executable, or remote URL can be supplied through report content.
export async function openReport(
  report: string,
  platform: string = process.platform,
  run: (command: string, args: string[]) => Promise<unknown> = (
    command,
    args,
  ) =>
    execute(command, args, {
      timeout: 5000,
      maxBuffer: 16 * 1024,
      shell: false,
    }),
): Promise<boolean> {
  const launch = browserLaunch(platform, report);
  if (!launch) return false;
  try {
    await run(launch.command, launch.args);
    return true;
  } catch {
    // Browser errors can contain private paths or environment details.
    return false;
  }
}
