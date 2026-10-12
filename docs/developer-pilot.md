# Developer pilot and controlled comparisons

Status: prepared, not conducted. No participants were contacted and no outcome
improvement is claimed. Start with 3–5 consenting developers using local exports.

## Reader exercise

Use a fresh checkout or release archive and the installation guide. Ask the
participant to install, generate the synthetic demo, identify the failed and
repeated activity, distinguish cached from total input, and explain what the
report cannot establish. Then ask them to uninstall without losing the report.
Record completion, assistance, errors, time and confusing wording. Do not
silently help while measuring unaided installation success.

For an optional private case, the participant selects their own export. They
keep raw content locally and share only an explicitly reviewed summary. Never
request credentials or a history-directory upload. Record whether the tool
identified a useful next action that the participant could verify. Include
negative feedback and cases where ordinary logs were enough.

## Paired diagnosis experiment

Freeze a set of original cases and expected answers before testing: missing
usage, a failed command, intentional retry, incomplete capture, and a completed
turn without independent acceptance. Keep grading answers separate from the
participant packet. Each answer must reference observable evidence; a plausible
guess is not a correct diagnosis. Alternate participant order between raw-export
inspection and report inspection to limit learning effects. Use different but
matched cases in the two conditions; report that matching is a design judgment.

Record case hash, tool version, OS/Node version, condition/order, time limit,
assistance, correct findings, unsupported claims, and resolved next action.
Publish per-case anonymized aggregates only with consent. With a small pilot,
report exact counts and ranges rather than declaring a statistically proven
productivity improvement. Repeated observations from one developer are not
independent participants.

## Comparing agent workflows

The current `compare` command is descriptive. Before comparing workflow A and B,
record a task fixture hash, initial checkout, hidden acceptance-test hash,
requested model, reported model when available, Codex version, instruction/skill
hashes, sandbox, tool availability, environment, budget and stopping rule. Use
isolated starting states, randomize A/B order, and predefine multiple trials and
an analysis plan before spending allowance. Never expose hidden tests to the
agent or select only the successful trials.

Grade task success separately with the same acceptance checks. Keep failures,
timeouts, missing metrics and interventions in the trial ledger. Compare success
and regressions before usage; smaller token counts from a failed task are not
an efficiency gain. Report paired differences and uncertainty appropriate to
the sample size; distinguish provider-reported usage from independently measured
wall time. Unknown model identity or incomparable budgets prevent a controlled
model-efficiency conclusion. This protocol does not turn imported reports into
signed evidence and does not run model tasks automatically.

## Go/no-go criteria

Proceed to a wider beta only after clean installation and removal are repeatable,
at least one original incident yields a verified useful next action, and privacy
review finds no raw-content exposure. Reconsider the product if testers prefer
existing tools or cannot find a recurring use. Do not treat passing parser tests
or a polished report as evidence of demand.
