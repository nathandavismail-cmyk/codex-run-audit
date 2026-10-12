# Security policy

## Scope

Codex Run Audit processes explicitly selected local files. It does not run agent tasks, shell commands from input, network requests, or automatic repairs. Raw transcript content is not included in generated reports. Reports contain metadata, counts and source hashes; these can still be sensitive.

Input and output are untrusted. The parser bounds file size, line size, event count and displayed timeline length. It rejects raw rollout formats, malformed counters and unsupported lifecycle ordering. HTML escapes dynamic text and uses a restrictive Content Security Policy, no scripts, no remote assets and no form submissions.

Inputs must be regular files; direct symlinks and FIFOs are rejected. Output is created in a new directory with exclusive file creation and POSIX permission restrictions. Parent-directory symlinks are resolved. The tool is not a security boundary against a hostile process simultaneously replacing directories owned by the same user. Only use output parents you control.

JSON reports are not signed. An attacker who can replace reports can replace their measurements and hashes. Comparison validates accounting fields but does not authenticate the originating run. A valid report never grants execution permission. Explicit `--open` launches a fixed OS opener with the newly generated local file URL as a separate argument, without a shell. It does not accept executable names or commands from input. Linux uses the user-controlled desktop HTML association.

## Supported versions

The latest 1.x release line is supported. Version 1.0.0 is the first public release. macOS and Ubuntu checks are recorded in [validation](docs/validation.md); Windows compatibility remains a separate gate. Do not assume cross-platform protection from POSIX-specific checks.

## Reporting

Use [GitHub private vulnerability reporting](https://github.com/nathandavismail-cmyk/codex-run-audit/security/advisories/new). The feature is enabled; the public Security → Advisories page exposes “Report a vulnerability”. Reporting requires a GitHub login. No test vulnerability was submitted.

Do not put raw sessions, credentials or exploitable private details in public issues. Include a minimal synthetic reproduction, affected version and expected impact. See the custom report form for suggested details. Responses are best-effort; there is no guaranteed response time.
