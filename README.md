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
- `docker:down` - Stops DynamoDB local service;
- `docker:build` - Builds `hazardsoft/cart-service` Docker image;
- `docker:push` - Pushes `hazardsoft/cart-service` Docker image to Docker Hub;
- `eb:init` - Initializes `hazardsoft-cart-api` Elastic Beanstalk application;
- `eb:create` - Creates `prod` environment with `hazardsoft-cart-api-prod` subdomain for Elastic Beanstalk applciation;
- `eb:deploy` - Deploys changes to `prod` environment of Elastic Beanstalk application;
- `eb:destroy` - Destroys all environments of Elastic Beanstalk application.

## Environment

Copy/paste [.env.example](./.env.example) file and rename it to the following:

1. `.env.local`/`.env` - contains credentials for local instance of Postgres database;
2. `.env.remote` - contains credentials for AWS RDS DB instance of Postgres database.

### Populate Postgres database

NPM script `prisma:seed:{destination}` (where destination is local/remote) uses `.env.local` or `.env.remote` file in order to fill Postges with initial data.
Prisma consumes `DATABASE_URL` env var in order to connect to the database.

## Testing

### Integration/E2E Tests

#### Prerequisites

Docker compose is used to spin up docker container with Postgres in order to run integration/e2e tests.
To prepare database in docker container perform the next steps:

1. run `npm run docker:up` command to spin up docker container with Postges database;
2. run `npm run prisma:deploy:local` command to create tables in docker container;
3. run `npm run prisma:seed:local` command to fill Postgres database with initial data.

#### Run Tests

1. [db.integration-spec.ts](./test/db.integration-spec.ts) contains integration tests for [Prisma service](./src/db/prisma.service.ts).

- `npm run test:integration` command to run integration tests;

2. [test/cart.e2e-spec.ts](./test/cart.e2e-spec.ts) contains e2e tests for [Cart controller](./src/cart/cart.controller.ts).

- `npm run test:e2e` command to run e2e tests.

### Postman

Use [postman_collection.json](./postman/Cart%20Service.postman_collection.json) collection to test REST API endpoints with [Postman](https://www.postman.com)
