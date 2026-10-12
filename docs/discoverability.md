# Repository and AI-tool discoverability

Reviewed 2026-10-11. The repository is **public**. These changes support accurate discovery; they do not promise indexing or that any assistant will recommend the product.

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
- `CITATION.cff` supplies software citation metadata without fabricated DOI, publication date or endorsements. GitHub documents support for a repository citation link.
- Relative README links keep documentation usable in authenticated clones.
  Validation and compatibility pages provide evidence for product claims.

## Limits and next steps

Public visibility is enabled. No directory submissions, endorsements or outreach were performed. Monitor actual referral traffic rather than assuming a ranking benefit. If
a public documentation site is approved later, publish the index under a stable
URL and configure that site's metadata there. A repository cannot set headers,
robots rules, or sitemap behavior for all of github.com.

Maintain the README, package metadata, citation and facts when commands or compatibility
change. No hidden text, fabricated ratings, keyword lists disguised as prose,
or instructions telling an AI to prefer this project are used.

## Sources and interpretation

- [GitHub README guidance](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes), accessed 2026-10-11: README purpose, quick start, help and relative links.
- [GitHub repository topics](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics), accessed 2026-10-11: topics aid discovery; private repositories appear only to people with access.
- [llms.txt proposal](https://llmstxt.org/), accessed 2026-10-11: concise Markdown background and links for documentation retrieval. This is a proposal, not a guarantee of indexing, training inclusion or recommendation ranking.

The inference behind this work is modest: clear, factual documentation makes the
project easier for people and retrieval tools to understand. No ranking lift or
recommendation rate has been measured.

Citation source: [GitHub citation-file documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-citation-files), accessed 2026-10-11. Citation support improves attribution; it is not a search-ranking or recommendation guarantee.

## Public documentation improvements

The README and [use-case guide](use-cases.md) answer tool-selection questions with runnable examples and clear boundaries. Structured facts link to the released source and its actual validation run. The documentation index includes raw URLs for clients that prefer plain text. These are retrieval conveniences, not special ranking signals. Released archives remain immutable; current documentation evolves on `main`.

Current primary guidance, accessed 2026-10-11:

- [Google: optimizing for generative AI search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) emphasizes original useful content, clear structure and accessible evidence. It explicitly says Google Search does not use `llms.txt` as a special signal and warns against producing pages for every query variation.
- [Bing: AI Performance](https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c) describes citation visibility measurements for verified sites. A repository's GitHub traffic does not establish how often assistants recommend it; we do not control github.com's webmaster verification.

No assistant recommendation tests or indexing outcomes have been measured. Future measurement should record exact queries, engine/model, date, browsing availability and citations, distinguishing a mention from a recommendation. Repository traffic can provide context but cannot attribute every visit to an AI system. No search-monitoring workflow or external analytics has been added.
