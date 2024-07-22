import { bootstrap } from './bootstrap';

bootstrap().then((app) => {
  app.listen(3001);
  console.log('Server started');
});
