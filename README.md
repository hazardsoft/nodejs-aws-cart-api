# Overview

Cart Service is responsible for creation carts/orders.

## NPM scripts

- `build` - builds cart handler;

- `test:integration` - runs integration tests for Prisma service;

- `test:e2e` - runs e2e tests;

- `prisma:generate` - generates Prisma client based on schema files stored in [prisma/schema](./prisma/schema/);

- `prisma:deploy:local` - creates databases based on migration files stored in [migrations](./migrations/);

- `prisma:deploy:remote` - same but uses `.env.remote` to connect to remote Postgres database;

- `prisma:seed:local` - populates Postgres database with initial data (see [seed.ts](./prisma/seed.ts));
  
- `prisma:seed:remote` - same but uses `.env.remote` to connect to remote Postgres database;
  
- `docker:up` - Starts DynamoDB local service (see [docker-compose.yml](./docker-compose.yml) for implementation details);

- `docker:down` - Stops DynamoDB local service.

## Environment

Copy/paste [.env.example](./.env.example) file and rename it to the following:

1. `.env.local`/`.env` - used to work with local instance of Postgres database;
2. `.env.remote` - used to work with AWS RDS DB instance of Postgres database;

### Populate Postgres database

NPM script `prisma:seed:{destination}` (where destination is local/remote) uses `.env.local` or `.env.remote` file in order to fill Postges with initial data.
Prisma consumes `DATABASE_URL` env var in order to connect to the database.

## Testing

### Prerequisites

Docker compose is used to spin up docker container with Postgres in order to run integration/e2e tests.
To prepare database in docker container perform the next steps:
1. run `npm run docker:up` command to spin up docker container with Postges database;
2. run `npm run prisma:deploy:local` command to create tables in docker container;
3. run `npm run prisma:seed:local` command to fill Postgres database with initial data.

### Integration Tests

[db.integration-spec.ts](./test/db.integration-spec.ts) contains integration tests for [Prisma service](./src/db/prisma.service.ts).
Run `npm run test:integration` command to run integration tests.

### E2E Tests

[test/cart.e2e-spec.ts](./test/cart.e2e-spec.ts) contains e2e tests for [Cart controller](./src/cart/cart.controller.ts).
Run `npm run test:e2e` command to run e2e tests.