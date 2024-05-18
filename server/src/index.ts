import express from 'express';

const app = express();
const PORT = 8000;

app.get('/', (_, res) => {
  res.send('Hello, world!');
});

app.listen(PORT, () => {
  console.log(`\nctrl + click http://localhost:${PORT}\nctrl + c to stop server`);
});
