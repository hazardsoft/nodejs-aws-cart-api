import { bootstrap } from './bootstrap';

const port = process.env.PORT || 4000;

bootstrap().then((app) => {
  app.listen(port);
  console.log(`Server started at port ${port}`);
});
