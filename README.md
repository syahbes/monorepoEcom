# Local Development Setup

## Prerequisites
- Docker
- pnpm
- ngrok (for Stripe webhooks)

## Setup Steps

### 1. Start PostgreSQL

Start existing container:
```bash
docker start postgres-product-db
```

Or create new container:
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

Test connection:
```bash
psql -h localhost -p 5432 -U admin -d products
```

### 2. Prisma Setup
Initialize Prisma:

Those Prisma commands are one-time setup:
- `prisma init` - Creates the initial Prisma configuration files
- `prisma migrate dev --name init` - Creates your database schema for the first time

You'd only run Prisma commands again if you're:
- Making changes to your schema → `pnpm prisma migrate dev --name your_change_name`

```bash
pnpm prisma init --datasource-provider postgresql --output ../generated/prisma
pnpm prisma migrate dev --name init
```

Open Prisma Studio (in product-db directory):
```bash
pnpm prisma studio
```

### 3. Start Kafka

In the `kafka` directory:
```bash
docker compose up
or
docker compose up -d
```

This starts Kafka brokers and Kafka UI.

### 4. Stripe Webhooks

Start ngrok tunnel:
```bash
ngrok http 8002
```
and check the url in the ngrok output
https://dashboard.stripe.com/acct_1SFpkEAcdNBVbpxW/test/workbench/webhooks/we_1SIZNHAcdNBVbpxWuJYd22Q5/events

### 5. Run Applications

Once Postgres and Kafka are running:
```bash
turbo dev
```