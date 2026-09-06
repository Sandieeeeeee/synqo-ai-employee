# Synqo AI

Synqo AI is a connected AI product suite for practical business and personal workflows.

## Products

- **Synqo AI Employee** — customer enquiries, leads, appointments, follow-ups and business AI tools.
- **Synqo Social Agent** — an approval-first workspace for Instagram/Facebook comments and DMs, with five AI replies included in the free beta.
- **Synqo Life Assistant** — tasks, daily planning, study support and organized notes.

## Local development

```bash
npm install
npm run dev
```

Create `.env.local` using the Firebase and AI Gateway variables documented in `SETUP.md`. Never commit environment files, service-account JSON, API keys or social access tokens.

## Social Agent status

The signed-in Social Agent MVP supports manual comment/DM capture, brand-tone controls, AI reply generation, editing, approval, copying and cloud/device persistence. Direct Meta syncing and auto-posting remain disabled until the Meta app completes Business Verification and App Review.

See `META_SETUP.md` for the production connection checklist.
