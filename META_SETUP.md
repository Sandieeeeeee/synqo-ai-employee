# Synqo Social Agent — Meta production setup

The app intentionally runs in approval-and-copy mode until Meta authorizes the production integration.

## 1. Create the Meta app

1. Create a Business-type app in Meta for Developers.
2. Add Facebook Login for Business, Webhooks and the Instagram API.
3. Add `https://www.synqoai.com/privacy` as the Privacy Policy URL.
4. Add `https://www.synqoai.com/data-deletion` as the User Data Deletion URL.
5. Add the final OAuth callback URL after the server connection routes are enabled.

## 2. Connect business assets

- The Instagram account must be a Professional account connected to a Facebook Page.
- The tester/admin must have permission to manage the Page and Instagram account.
- Development-mode access works only for app roles; public customers require Live mode and approved permissions.

## 3. Permissions to request

Request only the permissions used by the product:

- `pages_show_list`
- `pages_read_engagement`
- `pages_manage_engagement`
- `pages_messaging`
- `instagram_basic`
- `instagram_manage_comments`
- `instagram_manage_messages`

Record a clear App Review screencast showing account connection, incoming content, AI drafting, human approval, posting and disconnection/data deletion.

## 4. Webhook subscriptions

Use a server-side webhook with signature verification. Subscribe only to the Page and Instagram fields needed for comments and messages. Never expose access tokens in browser code, logs or GitHub.

## 5. Production secrets

Add Meta app credentials, webhook verification secret and encrypted token-storage configuration directly in Vercel Environment Variables. Do not place secret values in this repository.

## 6. Safety defaults

- Keep approval-first mode on by default.
- Route complaints, payments, legal issues, threats and sensitive personal matters to a human.
- Prevent reply loops, duplicate webhook processing and replies to the business's own messages.
- Keep an audit record of generated, edited, approved and posted replies.
