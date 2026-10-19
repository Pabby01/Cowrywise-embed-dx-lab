# Cowrywise Embed: Initial Developer Experience Audit

**Prepared by Adeola Lasisi | October 2026**

## Executive summary

Cowrywise already has visible developer-facing assets: an Embed developer portal, API reference material, implementation guides, public Node.js and Python libraries, an investments flowchart, webhook guidance, and a developer community channel. The opportunity is to connect these resources into a more explicit path from discovery to a first successful integration.

This is an independent desk review of publicly available materials. It is not an internal audit. No authenticated API request, sandbox credential flow, production integration, or internal developer analytics were tested for this artifact.

## 1. What is already present

The public portal reviewed for this case study exposes:
- API reference, documentation, and libraries.
- Guides for account creation, identity verification, portfolios, investment creation, funding, liquidation, investment products, withdrawals, transactions, prices, and webhooks.
- An investments flowchart.
- Node and Python client libraries.
- A developer community channel.

**Implication:** recommendations should build on existing resources rather than assume Cowrywise is starting from zero.

## 2. Findings, hypotheses, and recommendations

### A. The resources are distributed across several surfaces
**Evidence status: Publicly documented.** The portal links to reference docs, separate guides, libraries, a flowchart, and community.

**Opportunity:** create one task-oriented “Start here” path through prerequisites, access, authentication, a first request, a realistic use case, and troubleshooting.

**Suggested validation:** ask 3–5 developers unfamiliar with Embed to complete a defined onboarding task. Observe navigation, misunderstandings, and whether they can identify the next step without assistance.

### B. Sandbox access and credential expectations may be unclear
**Evidence status: Hypothesis to validate.** Public materials reviewed appear to describe credential access in different ways, while an API Early Access form says applicants may be contacted within 3–5 business days if Cowrywise is interested. This does not establish that every developer must wait or that the form is the only access path.

**Opportunity:** state clearly whether sandbox access is self-service, application-based, or dependent on approval; list required details, expected response times where known, and what developers can do while waiting.

**Suggested validation:** follow the documented path as a new developer and ask Cowrywise to confirm the intended current process. Record exact steps and unanswered questions before publishing a finding.

### C. A focused TypeScript journey could reduce translation work
**Evidence status: Publicly documented:** a public Node library exists. The starter in this repository is TypeScript-oriented but does not claim to use or validate official SDK methods.

**Opportunity:** publish a maintained TypeScript quickstart using the supported official library, with a complete verified happy path, typed request/response handling, and error states.

**Suggested validation:** after authorized sandbox access, implement one officially supported flow and validate it against the current API contract.

### D. Multi-step flows deserve task-oriented examples
**Evidence status: Publicly documented.** Public guides describe identity verification, investments, withdrawals, liquidations, and webhooks. The withdrawal guide describes an intent and a 24-hour waiting period.

**Opportunity:** provide sequence diagrams and verified examples for asynchronous states, webhook handling, cancellation/retry behavior where supported, and safe handling of incomplete or failed workflows.

**Suggested validation:** select one workflow with engineering, verify the current contract, and ensure the example covers success and a realistic failure state.

### E. Troubleshooting improvements should be evidence-led
**Evidence status: Hypothesis.** This review did not reproduce an API defect or inspect internal support tickets.

**Opportunity:** create an error-oriented troubleshooting page mapped to official error codes, remediation, retryability where documented, and a support escalation path.

**Suggested validation:** review anonymized recurring support questions with the team and prioritize repeated, evidenced friction.

## 3. Prioritized 90-day plan

### Days 1–30 — Understand and baseline
1. Confirm sandbox access and the current authentication contract.
2. Map the first-time developer journey.
3. Run 3–5 developer usability sessions if feasible.
4. Establish available baselines: onboarding completion, time to first successful request, support themes, and documentation feedback.
5. Agree on one pilot workflow with engineering.

### Days 31–60 — Ship focused improvements
1. Publish or improve a task-oriented quickstart.
2. Build one verified TypeScript example on the official SDK.
3. Add troubleshooting for the most common evidenced integration blockers.
4. Add a sequence diagram for one multi-step or webhook-based workflow.
5. Review all examples with engineering before publication.

### Days 61–90 — Validate and iterate
1. Run a small developer workshop or feedback session.
2. Observe developers attempting the quickstart.
3. Compare results with baseline.
4. Publish a short “what changed and what we learned” report.
5. Prioritize further improvements using measured friction, not assumptions.

## 4. Proposed success metrics

- **Time to first successful authenticated request:** elapsed time from beginning documented setup to a successful request, with the measurement method defined.
- **Quickstart completion rate:** proportion of participants completing a defined integration task.
- **Blocker frequency:** recurring points where participants fail, pause, or request help.
- **Documentation usefulness:** participant rating and qualitative feedback.
- **Support deflection:** whether revised guides resolve recurring questions without direct intervention.
- **Example reuse:** visits, repository clones/forks, or workshop use, interpreted alongside completion data.

No targets are proposed before a baseline exists. Public stars or views alone are insufficient evidence of developer success.

## 5. Guardrails

- Do not claim a live integration works until tested with authorized sandbox credentials.
- Do not publish secrets, real customer data, or unapproved API payloads.
- Keep client secrets server-side.
- Distinguish official SDK/API behavior from local mock behavior.
- Confirm API contracts and licensing with Cowrywise before shipping production-facing examples.
- Treat proposed findings as subject to engineering review.

## Closing

The strongest near-term opportunity is to make existing developer resources feel like one coherent journey: discover, get access, authenticate, complete a verified integration, troubleshoot, and grow. A small, measured pilot can show whether improvements help developers succeed and where further investment in DevRel would create value.
