# Identity and billing service

Experimental service that handles billing and authentication for SaaS projects.

It's a mix of an IDP (identity provider), OAuth integration and Stripe integration.

Read more about the experiment here:
https://1000experiments.dev/tag/idp

## Features

- Supports multiple OAuth providers
- Integrated billing with Stripe Checkout
- Changing and canceling subscriptions via Stripe Billing Portal
- JWT tokens containing billing info (plan, stripe ids, subscription status)
- Open source.
- Deployable as cloud functions or self-hosted.
- Can run in a Docker container within same data-center/VPC as app.
- Multiple users per account
- Multiple accounts per user

### In the future

Assuming the first part works out well...

- SSO (Single sign on)
- Sign in with magic links
- Sign in with username/password
- MFA (multi-factor authentication)
- Reporting on low-usage accounts that are in danger of churning.

## License

BSL
