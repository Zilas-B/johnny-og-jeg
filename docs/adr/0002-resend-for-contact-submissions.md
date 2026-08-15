---
status: accepted
---

# Contact Submissions are delivered by email through Resend

The contact form was a dummy: it had no recipient, hit no server, and silently lost every message anyone ever sent — including speaking enquiries, the most valuable thing the site collects. Fixing it required choosing where a Contact Submission actually goes, and the site had no backend for receiving anything. We decided to **send Contact Submissions as email via Resend, from a route handler in the app**, with an on-screen confirmation to the sender and a subject prefix distinguishing speaking enquiries.

## Considered Options

- **A form service (Formspree, Netlify Forms).** Least setup, no DNS. Rejected because submissions then live in a third party's dashboard and the routing and formatting we want sit behind someone else's product.
- **Store submissions as documents in Sanity.** Tempting — Sanity is already here and it needs no mail infrastructure. Rejected because a message store nobody polls fails the same way the dummy form did: the message arrives and no one reads it. Email lands in an inbox that is already checked daily.
- **No backend at all — publish an email address on the page.** Honest and free, but it loses the structured subject field and asks the visitor to do the work.
- **Resend + route handler.** Chosen. Delivery to an inbox someone reads, submissions under our own control, and room to route or reformat categories later without changing vendor.

## Consequences

- **A verified sending domain is required, and this is a hard blocker, not a nicety.** Resend's shared `onboarding@resend.dev` sender returns a 403 when sending to any address other than the account owner's own. Until a domain is verified in DNS and a sending address exists, the form cannot be built. The issue is blocked on exactly this.
- The dummy form stays live in the meantime, so messages continue to be lost until the blocker clears. This was a deliberate choice over replacing it with a plain email address as a stopgap.
- A subject prefix — not a second recipient address — marks speaking enquiries. They are not a separate kind of thing; the subject is a field on a Contact Submission, and a mail filter handles the rest.
- The sender gets an on-screen confirmation only. No automatic receipt email, which would double the sending surface for a low-volume site. Revisit if enquirers report uncertainty that their message arrived.
- The form collects personal data, so a one-line processing note sits under it. A full privacy policy page would imply data handling that does not exist here.
- This introduces the repo's first real branching logic, and with it its first tests — Vitest against the route handler, with the mail provider stubbed.
