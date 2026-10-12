# Security policy

## Scope

Codex Run Audit processes explicitly selected local files. It does not run agent tasks, shell commands from input, network requests, or automatic repairs. Raw transcript content is not included in generated reports. Reports contain metadata, counts and source hashes; these can still be sensitive.

Input and output are untrusted. The parser bounds file size, line size, event count and displayed timeline length. It rejects raw rollout formats, malformed counters and unsupported lifecycle ordering. HTML escapes dynamic text and uses a restrictive Content Security Policy, no scripts, no remote assets and no form submissions.

Inputs must be regular files; direct symlinks and FIFOs are rejected. Output is created in a new directory with exclusive file creation and POSIX permission restrictions. Parent-directory symlinks are resolved. The tool is not a security boundary against a hostile process simultaneously replacing directories owned by the same user. Only use output parents you control.

JSON reports are not signed. An attacker who can replace reports can replace their measurements and hashes. Comparison validates accounting fields but does not authenticate the originating run. A valid report never grants execution permission. Explicit `--open` launches a fixed OS opener with the newly generated local file URL as a separate argument, without a shell. It does not accept executable names or commands from input. Linux uses the user-controlled desktop HTML association.

## Supported versions

The latest 1.x release line is supported. Version 1.0.0 is prepared but not yet published. macOS and Ubuntu checks are recorded in [validation](docs/validation.md); Windows compatibility remains a separate gate. Do not assume cross-platform protection from POSIX-specific checks.

## Reporting

Do not put raw sessions, credentials or exploitable private details in public issues. The repository is currently private; no public-facing reporting endpoint is active.
GitHub private vulnerability reporting is the intended disclosure channel when
public distribution is authorized. It avoids requiring a separate public email
address. A custom report form is prepared in `.github/VULNERABILITY_REPORT.yml`.

At authorized public launch, enable the feature, verify the “Report a vulnerability”
button at the repository Security → Advisories page, and link that verified page
here before announcing availability. Do not submit a fake vulnerability just to
test notifications. A prepared form does not mean the feature is enabled.

GitHub documents this feature for public repositories:
[private vulnerability reporting](https://docs.github.com/en/code-security/how-tos/report-and-fix-vulnerabilities/configure-vulnerability-reporting/configure-for-a-repository)
(accessed 2026-10-11). We have not changed repository visibility to enable it.
