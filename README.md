# Local Development Setup

## Prerequisites

* Docker
* pnpm
* ngrok (for Stripe webhooks)

---

## 1. Start PostgreSQL

**Start existing container:**

```bash
docker start postgres-product-db
```

**Or create a new container:**

```bash
docker run -d \
  --name postgres-product-db \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=123456 \
  -e POSTGRES_DB=products \
  -p 5432:5432 \
  -v postgres-data:/var/lib/postgresql/data \
  postgres
```

**Test connection:**

```bash
psql -h localhost -p 5432 -U admin -d products
```

---

## 2. Prisma Setup

Initialize Prisma (one-time setup):

```bash
pnpm prisma init --datasource-provider postgresql --output ../generated/prisma
pnpm prisma migrate dev --name init
```

**Common Prisma commands:**

* `prisma init` – creates Prisma configuration files
* `prisma migrate dev --name <name>` – applies schema changes
* `pnpm prisma studio` – opens Prisma Studio UI

---

## 3. Start Kafka

In the `kafka` directory:

```bash
docker compose up
# or
docker compose up -d
```

This starts the Kafka brokers and the Kafka UI.

---

## 4. Stripe Webhooks

Because this uses a free ngrok account, the webhook URL changes each time ngrok starts.

**Start ngrok tunnel:**

```bash
ngrok http 8002
```

Copy the generated ngrok URL and update it in the Stripe webhook configuration:
[Stripe Webhooks Dashboard](https://dashboard.stripe.com/acct_1SFpkEAcdNBVbpxW/test/workbench/webhooks/we_1SIZNHAcdNBVbpxWuJYd22Q5/events)

---

## 5. Nodemailer Configuration

You may need to refresh tokens for email sending:

* **Client ID / Secret:** from Google Cloud Console
* **Refresh Token:** from [OAuth Playground](https://developers.google.com/oauthplayground)

---

## 6. Run Applications

Once PostgreSQL and Kafka are running, start all services with TurboRepo:

```bash
turbo dev
```

---

## 7. Tech Stack

### Monorepo

* **TurboRepo** – manages all backend and frontend services in one workspace

### Backend

* **Frameworks:** Express, Hono, Fastify
* **Databases:** PostgreSQL, MongoDB
* **Storage:** Cloudinary (images)
* **Utilities:** Docker, Prisma
* **Messaging:** Kafka cluster

### Frontend

* **Framework:** Next.js (TypeScript)
* **UI Library:** Shadcn
* **Data Fetching:** React Query

### Authentication

* **Clerk** – user authentication and management

### Payments

* **Stripe** – payment processing and webhooks

### Email

* **Nodemailer** – integrated with **Google Cloud Console** for OAuth credentials

---

## 8. System Flow Overview

**Create Category**
→ Stored in PostgreSQL

**Create Product**
→ Stored in PostgreSQL
→ Kafka event → Stripe product creation

**Create User**
→ Managed by Clerk
→ Kafka event → send welcome email

**Stripe Webhook (on successful payment)**
→ Triggers Kafka event
→ Creates order in MongoDB
→ Sends confirmation email




Thank you Lama dev
https://youtu.be/O9YnPuKC4w4?si=AsMpaLyx3nQ_Iagw