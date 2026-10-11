# Accounting and interpretation contract

`runlens.report/v1` records one execution export. `usage.input` includes `cachedInput`; `uncachedInput` is their difference only when both are known. `usage.output` includes the reported reasoning subset. Neither subset is added again. Every non-null counter is a nonnegative safe integer; contradictory subsets and overflow are errors.

The adapter treats `turn.completed.usage` as per-turn usage. It sums a category only if that category is known for every started turn. Partial per-turn observations remain in `turns`; whole-run categories become null rather than silently undercounting. Null means unavailable; zero means observed zero.

Exact repeated terminal turn events without a new turn are ignored. A new `turn.started` always denotes new work even when its usage equals the previous turn. Completed items are deduplicated by ID and payload within a turn; conflicting duplicate completions fail. Multiple thread starts are rejected. This is not a general deduplicator for replayed parent histories.

Activity counts terminal item events. Command failures follow a failed status or nonzero numeric exit code. Repetition means identical command text encountered again, not necessarily wasted effort. Commands are hashed in memory and omitted from outputs. File-change counts are event counts, not files changed. Tool-token attribution is unavailable.

Execution completed means the supported stream ended with terminal turns and no error event. It does not establish correctness, test passage, requirement satisfaction or deployment. Unknown event types reduce coverage and are never copied through verbatim.

Elapsed time is the last minus first timestamp only when every nonblank event has a valid, ordered timestamp. It includes gaps between recorded events and is not CPU time or summed agent time. Standard exports can omit timestamps entirely.

Comparisons display differences only when both categories are known. Input reports are validated for expected schema, fingerprints, execution status and essential counter consistency; they are not reverified against raw sources. Task/model equivalence, causation and outcome improvement remain unknown. Imported aggregates may be forged; never treat them as billing records.
