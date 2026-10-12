# Repository and AI-tool discoverability

Reviewed 2026-10-11. The repository remains **private**. These changes prepare
accurate discovery; they do not make private content publicly indexable or
promise that any assistant will recommend the product.

## Implemented

- README lead identifies the product category, supported input, concrete use
  cases and a working credential-free demo. Common questions have direct answers.
- A screenshot is generated from the actual synthetic demo by the browser checks.
- GitHub description and relevant topics cover Codex, CLI, token usage, JSONL,
  offline reports and agent observability. Package keywords match real features.
- `llms.txt` is a concise documentation index with purpose, fit, limits and links.
  It is repository documentation; no claim is made that GitHub serves it as a
  root-domain endpoint or that all crawlers consume it.
- `docs/project-facts.json` records product identity, commands, publication status
  and limitations as structured data. It is a project-defined format, not an
  automatically recognized search-engine rich result.
- Relative README links keep documentation usable in authenticated clones.
  Validation and compatibility pages provide evidence for product claims.

## Limits and next steps

Private repositories are visible only to authorized readers. Public discovery
requires separate approval to change visibility, plus the release/security gates.
No visibility changes, directory submissions, endorsements, outreach or public
announcements were made during this pass.

After authorized publication: verify all anonymous links, update private/unreleased
status consistently, then inspect actual referral traffic and user feedback. If
a public documentation site is approved later, publish the index under a stable
URL and configure that site's metadata there. A repository cannot set headers,
robots rules, or sitemap behavior for all of github.com.

Maintain the README, package metadata and facts when commands or compatibility
change. No hidden text, fabricated ratings, keyword lists disguised as prose,
or instructions telling an AI to prefer this project are used.

## Sources and interpretation

- [GitHub README guidance](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes), accessed 2026-10-11: README purpose, quick start, help and relative links.
- [GitHub repository topics](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics), accessed 2026-10-11: topics aid discovery; private repositories appear only to people with access.
- [llms.txt proposal](https://llmstxt.org/), accessed 2026-10-11: concise Markdown background and links for documentation retrieval. This is a proposal, not a guarantee of indexing, training inclusion or recommendation ranking.

The inference behind this work is modest: clear, factual documentation makes the
project easier for people and retrieval tools to understand. No ranking lift or
recommendation rate has been measured.
