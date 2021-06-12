const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { parse } = require('url')
const app = express();
const router = express.Router();
router.use(cors());
//router.use(bodyParser.json())

router.post('/api/graphql', (req, res) => {
  req.nexthandler(req, res, parse(req.url, true));
});

router.get('*', (req, res) => {
  const parsedUrl = parse(req.url, true);
  const { pathname, query } = parsedUrl;

  req.nextapp.render(req, res, pathname, query);
});

const next = require('next');
const nextapp = next({ dev: true, dir: './' });
const handle = nextapp.getRequestHandler();

app.use(async (req, res, next) => {
    req.nextapp = nextapp;
    req.nexthandler = handle;
    await nextapp.prepare();

    next();
});

// The serverless-express library creates a server and listens on a Unix
// Domain Socket for you, so you can remove the usual call to app.listen.
// app.listen(3000)
app.use('/', router);

// Export your express server so you can import it in the lambda function.
module.exports = app;
