const serve = require('koa-static');
const Koa = require('koa');
const app = new Koa();

const Model = require('./model');
const { port } = require('./config');

app.use(serve('.'));
app.listen(port);
console.log(`listening on port ${port}`);