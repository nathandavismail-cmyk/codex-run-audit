# Architecture decision 001: a bounded offline analyzer

Status: accepted for 0.1.0 preview, 2026-10-11.

The product first needs trustworthy measurements. Use TypeScript on Node 24 with no runtime dependencies. An explicit file import avoids private-history discovery and daemon lifecycle management.

Pipeline: `readInput` validates file access/UTF-8/size; `parseExport` enforces event ordering and normalizes observations; `compareReports` accepts a limited report contract; renderers turn the normalized models into static HTML; `writeBundle` creates a new output directory. No source content is executed.

The report JSON is the primary artifact. HTML is a presentation of the same model. No generated time is injected, so identical inputs and generator versions produce identical outputs. The raw input hash identifies the supplied bytes; it is not an attestation.

The initial adapter supports execution events, not internal rollout snapshots. A future adapter must define counter ownership, reset/replay behavior, linkage and completeness separately. Do not silently recognize a new format by overlapping field names.

We avoid automatic skill installation, new orchestration, live billing integration and model-generated advice. A separate original incident corpus should eventually support controlled compatibility diagnosis. Existing tools may be integrated rather than duplicated.
