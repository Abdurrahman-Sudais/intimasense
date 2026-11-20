# Architecture

Status: **proposed**. The website and the prototype run entirely in the browser on fictional data. None of the AWS services below are deployed or connected.

## Today: browser-only prototype

- Vite + React, server-rendered to static HTML for every route (`scripts/prerender.mjs`).
- A fictional, non-explicit product catalogue, educational resources and aggregate session counts live in `src/data.js`; classification, recommendation, explanation and suppression rules are pure functions in `src/engine.js`, tested with `node --test`.
- Changes persist in `localStorage`; roles are switched in the UI, not authenticated.

## Why AWS

IntimaSense is a proposed personalisation platform for adult sexual wellness retailers, brands and marketplaces. It must classify product catalogues, serve recommendations through retailer integrations and protect sensitive preference data by design. Designing on AWS lets it train and host recommendation models, classify catalogues at scale and keep access tightly controlled.

## Proposed production service

| Stage | Services | What happens |
|---|---|---|
| 1. Catalogue in | Amazon S3, Amazon API Gateway | Retailers upload product datasets or sync them through the integration API. |
| 2. Classify | Amazon Bedrock | Product descriptions are classified into categories and attributes such as material, fragrance and experience level, with merchandiser review. |
| 3. Catalogue store | Amazon DynamoDB | Approved product attributes and educational resources are stored for fast lookup. |
| 4. Recommend | Amazon SageMaker AI | Recommendation models rank products from attributes and voluntarily provided, anonymous preferences. |
| 5. Serve & measure | Amazon API Gateway | Retailers request recommendations through the API; only aggregate, suppressed counts are reported back. |
| Across every stage | Amazon Cognito, AWS KMS, AWS Lambda, AWS CloudTrail | Amazon Cognito controls retailer account access; AWS KMS encrypts product and session data; AWS Lambda runs uploads, classification jobs and aggregation; AWS CloudTrail records administrative access |

### Services and their role

- **Amazon SageMaker AI** — Trains and hosts the recommendation models.
- **Amazon Bedrock** — Classifies product catalogue descriptions into categories and attributes.
- **Amazon S3** — Stores uploaded product datasets.
- **Amazon DynamoDB** — Stores structured catalogue information and educational resources.
- **Amazon API Gateway** — Provides the ecommerce integration and recommendation APIs.
- **Amazon Cognito** — Manages retailer account access and roles.
- **AWS KMS** — Encrypts product and session data.
- **AWS Lambda** — Runs catalogue processing and aggregation jobs.
- **AWS CloudTrail** — Keeps an audit trail of administrative access.

The same lists live in `src/aws.js` and are shown on the home page (`#technology`).

### Design rules

1. **Adults only.** Built for businesses serving consenting adults (18+); retailers keep their own age checks.
2. **Minimal data.** Preferences are voluntary, anonymous and session-scoped. No names, contact details or browsing histories are profiled.
3. **Explained recommendations.** Every recommendation states which product attributes and preferences it matched.
4. **Aggregate analytics only.** Reports never show counts below five, so small groups cannot be singled out.

## Website lead capture

The pilot and contact forms post to HubSpot (see `docs/crm-plan.md`). If a server-side intake is needed later, Amazon API Gateway + AWS Lambda can validate submissions and Amazon SES can notify the founder.
