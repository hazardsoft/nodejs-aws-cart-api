import serverlessExpress from '@codegenie/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { bootstrap } from '../bootstrap.js';

let server: Handler;

async function bootstrapServer() {
  const app = await bootstrap();
  return serverlessExpress({ app: app.getHttpAdapter().getInstance() });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  console.log('received event:', event)
  console.log('reeived context:', context)
  server = server ?? (await bootstrapServer());
  return server(event, context, callback);
};
