# Facilitator packet — keep separate from participants

Status: prepared, no human trials conducted. All five fixtures are synthetic.
Run `npm run eval:fixtures -- /absolute/path/to/new-results` from a source checkout.
Each fixture is SHA-256 pinned. The runner verifies accounting and produces HTML,
JSON, and a summary; it does not measure human performance or call a model.

| Case | Expected interpretation |
| --- | --- |
| missing-usage | Turn completed; usage is unknown, not zero. Task success unverified. |
| failed-command | One command failed although the turn completed. Its intent and task correctness are unknown. Inspect the original test result before classifying it as a regression. |
| repeated-command | Two identical command executions are recorded. Repetition alone does not establish waste or an intentional retry. |
| interrupted | Capture ends during command activity. No terminal command item is counted; execution is incomplete and usage unknown. Recover the full capture. |
| completion-only | Completion and reported usage are known. No independent acceptance tests establish task success. |

Score each participant answer against observable facts, separating correct
observations, unsupported conclusions, and useful next actions. Record exact
counts and time ranges. Do not average repeated cases as independent people.
The same five cases are not a controlled causal study: use counterbalanced,
matched unseen cases before comparing diagnosis speed across conditions.

Recruit 3–5 consenting developers only after the maintainer authorizes contact.
Provide the participant packet, installation guide, and assigned cases. Preserve
both negative and positive feedback. Do not distribute this answer sheet first.
Use an anonymized identifier in the response ledger; retain only consented data.
