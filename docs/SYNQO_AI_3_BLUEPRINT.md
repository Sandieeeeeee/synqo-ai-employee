# Synqo AI 3.0 — Business and Product Blueprint

## Positioning
**One Platform. Multiple AI Minds. Real Work Done.**
Synqo is a business-first AI workspace, not a claim to reproduce every competing AI product.

## Target customers
1. Canadian small businesses that need lead capture, email and appointment workflows.
2. Freelancers and creators who need writing, research and content assistance.
3. Small teams looking for controlled, repeatable AI workflows.

## Product pillars
- **Synqo Brain:** conversational workspace; supported model selection, comparisons, transparent provider labels.
- **Synqo Employee:** knowledge-base-backed customer replies, lead intake, appointment suggestions, human review.
- **Synqo Studio:** writing and content workflows, then image/video/voice integrations subject to provider APIs.
- **Synqo Developer:** coding assistance and approved GitHub workflows.
- **Synqo Automate:** connectors, scheduled workflows, audit logs and approvals.
- **Synqo Academy:** beginner-friendly multilingual lessons and exercises.

## What exists now
Next.js 16 / React 19 website, Firebase integration, existing authenticated AI Gateway endpoint at /api/ai, Social Agent and Life Assistant MVPs, and Stripe-related code. Verify deployment configuration and feature status before any launch claims.

## Release plan
### Phase 0 — Public positioning (now)
- Launch /ai-hub roadmap landing page and navigation.
- Mark unbuilt features as planned, not live.
- Keep existing AI Employee and product pages available.

### Phase 1 — Working Synqo Brain MVP
- Firebase authenticated chat workspace.
- Server-only gateway model allowlist and model selection; never accept arbitrary provider IDs.
- Start with one tested model, add a second only after validating billing and quality.
- Persistent chat history with user ownership checks and deletion.
- Token/cost metering and quotas in durable storage, not an in-memory map.
- Abuse prevention, prompt-size limits, timeouts, error reporting, and privacy disclosures.
- Provider comparisons labeled separately; no fabricated consensus.
- Add privacy policy, terms and retention controls before processing customer documents.

### Phase 2 — AI Employee
- Organization/team tenancy and permissions.
- Knowledge-base ingestion with citations and document deletion.
- Lead inbox, customer conversation drafts and human approval.
- Calendar/email OAuth scopes minimized; send/book only after user confirmation.
- Audit trail, monitoring, and per-tenant budgets.

### Phase 3 — Monetization
- Free usage cap; metered Pro; business subscription.
- Stripe checkout, billing portal, webhook validation, entitlement enforcement.
- Validate unit economics: gross margin = revenue - model tokens - storage - infra - payment fees - support.
- Do not publish unlimited model usage without strict fair-use and cost controls.

### Phase 4 — Ecosystem
- Studio and Developer integrations, workflows, multilingual Academy.
- Enterprise SSO and governance only after demand is proven.

## Suggested architecture
Next.js App Router frontend -> Firebase Authentication -> server routes -> model router -> approved Vercel AI Gateway provider/model IDs.
Firestore stores user chats, quotas, organizations and audit logs. Stripe handles subscription status. Secrets remain only in server environment variables. OAuth connectors use least-privilege scopes and encrypted tokens.

## Immediate technical tasks
1. Inspect Firebase sign-in and /api/ai implementation; reuse authentication patterns.
2. Add /ai-hub marketing page (completed).
3. Implement a durable usage ledger and user-owned chat storage.
4. Add a model allowlist and test each provider through the existing gateway.
5. Build authenticated /ai-hub/chat; validate privacy and rate limiting.
6. Set up Stripe products only after model costs and plan limits are measured.
7. Run lint/build, staging smoke tests, accessibility and mobile QA before public release.

## Key launch risks
API cost spikes, unreliable provider availability, privacy/data retention, hallucinated claims, unauthorized outbound actions, abuse, and pricing that does not cover inference costs.

## Success metrics
Visitor-to-signup conversion, weekly active users, successful task completion, cost per completed task, paying conversion, retention, and support burden.

## Product principles
No fake AI answers, no misleading availability badges, no hidden provider substitutions, no autonomous sensitive actions without approval, and no exposure of API secrets in browser code.
