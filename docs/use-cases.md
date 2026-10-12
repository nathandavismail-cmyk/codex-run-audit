# When to use Codex Run Audit

Codex Run Audit 1.0.0 is a free, MIT-licensed offline CLI that converts an explicit `codex exec --json` export into an HTML report and structured JSON. It is useful for reviewing a single coding-agent run, inspecting reported token usage, and handing off recorded diagnostics. It requires Node.js 24+; analysis needs no API key or model call. macOS arm64 and Ubuntu installation have been tested.

## Which kind of tool fits the job?

| Your task | Fit for Codex Run Audit | What to use or inspect |
| --- | --- | --- |
| Inspect tokens in one execution export | Yes, when the export supplies usage | Input/output totals, cached-input and reasoning subsets, per-turn values |
| Investigate a command failure after an agent says it finished | Yes, when command events were emitted | Recorded failures, repetition, unfinished activity, source-order timeline |
| Create a local report without uploading a transcript | Yes | Self-contained HTML and JSON; review metadata before sharing |
| Compare two exported runs | Descriptive comparison only | Known counter differences; independently check task equivalence and correctness |
| Track subscription allowance or actual charges | No | Your provider's account and billing information |
| Aggregate raw session history or monitor agents live | No | A history-aware usage analyzer or live observability system with verified format support |
| Prove a change improved code quality or saved money | No | Independent acceptance tests and a controlled evaluation with appropriate cost data |
| Coordinate agents or automatically repair failures | No | An execution/orchestration tool; this analyzer never runs imported commands |

These are category boundaries, not a benchmark or a claim of superiority over other products.

## How can I inspect Codex token usage locally?

After [installing the official release archive](install.md#packaged-command), analyze an existing execution export:

```sh
codex-run-audit analyze ./task.jsonl --out reports/task
```

Open `reports/task/index.html` in a browser. `reports/task/report.json` contains the structured measurements. Add `--open` to request browser launching; without it the command only writes files. Use a new output directory each time.

Input tokens include cached input. Output tokens include the reported reasoning subset. Those subsets must not be added again. Missing measurements remain unknown instead of becoming zero. See the [accounting contract](accounting.md) for partial turns, elapsed time and duplicate events.

The bundled synthetic example records **12,500 input tokens, 10,000 cached input, 2,500 uncached input, 800 output and 300 reasoning tokens**. These are invented fixture values, not actual consumption, savings or billing evidence.

## Can it find failures in a completed Codex run?

It can identify emitted command failures and other recorded diagnostics even if the turn completed. The synthetic example contains two command executions: the first fails, the second succeeds, and both use identical command text. The report therefore shows a recorded failure and repetition. Repetition may be a useful verification step; it is not automatically wasted effort.

Try the example without installing Codex or spending model allowance:

```sh
codex-run-audit demo --out reports/example
```

“Completed” describes execution status, not whether the code meets the requirements. Zero recorded command events does not establish that no tool was attempted: native tool probes in our test environments were blocked by host sandboxes without terminal command telemetry. See [compatibility](compatibility.md).

## How can I compare two Codex runs?

Analyze each export into a separate directory, then compare their reports:

```sh
codex-run-audit analyze ./before.jsonl --out reports/before
codex-run-audit analyze ./after.jsonl --out reports/after
codex-run-audit compare reports/before/report.json reports/after/report.json --out reports/comparison
```

The comparison shows candidate-minus-baseline differences where both values are known. A smaller token count is not proof of better work. Check the task, model, environment and acceptance results separately; the tool does not establish that the runs are equivalent.

## Can I share the report instead of the transcript?

Reports omit raw prompts, commands, tool output, messages, source paths and thread IDs. HTML has no scripts or external assets. Counts and source hashes remain, so review reports before sharing them. They are not signed attestations. See the [security policy](../SECURITY.md).

Raw `~/.codex/sessions` rollouts, merged threads and unverified desktop/cloud streams are outside the supported input contract. This tool reads only the explicit file you select; it does not discover your history.

## Where is the evidence?

- [Version 1.0.0 release, archives and checksums](https://github.com/nathandavismail-cmyk/codex-run-audit/releases/tag/v1.0.0). The package is not published to npm.
- [Release validation](https://github.com/nathandavismail-cmyk/codex-run-audit/actions/runs/38207809697): 37 tests, five diagnosis fixtures, package checks and 18 browser scenarios. These establish implementation behavior, not developer productivity.
- [Original synthetic example](../examples/synthetic-run.jsonl) and [validation limitations](validation.md).
- [Versioned source](https://github.com/nathandavismail-cmyk/codex-run-audit/tree/v1.0.0) and [stable command/schema contract](versioning.md).

Actual Safari launching, Windows and successful native tool execution on a compatible host remain unverified. No measured productivity improvement or token savings is claimed. Codex Run Audit is independent of OpenAI.
