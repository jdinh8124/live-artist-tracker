require('dotenv/config');
const express = require('express');
const db = require('./database');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const sessionMiddleware = require('./session-middleware');
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: 'fcecfc72172e4cd267473117a17cbd4d',
  clientSecret: 'a6338157c9bb5ac9c71924cb2940e1a7',
  redirectUri: 'http://www.example.com/callback'
});

spotifyApi.setAccessToken(`BQDZ1PLW6Dh4kq5BefpsZEbeyfYSEoigmWnkZDEAl6fB5e3MgE47pC2NSkVy_btJsLMBKXIupF0kFAjoCEbYIVgwAFhi_G2fZroNLotLxUi-pVXi9mUTBNPFXdmhiAGEC3PrnsDjKo3BMY2_sUMWSyqm
`);

const app = express();

app.use(staticMiddleware);
app.use(sessionMiddleware);

app.use(express.json());

app.get('/api/health-check', (req, res, next) => {
  db.query('select \'successfully connected\' as "message"')
    .then(result => res.json(result.rows[0]))
    .catch(err => next(err));
});

// app.get('/api/all'(req, res, next) => {

// })

//  GET https://api.spotify.com/v1/me/top/{type}

// app.get('/api/artists', (req, res, next) => {

//   spotifyApi.getArtist('45eNHdiiabvmbp4erw26rg')
//     .then(function (data) {
//       // console.log('Artist information', data.body);
//     }, function (err) {
//       console.error(err);
//     });

// });

app.use('/api', (req, res, next) => {
  next(new ClientError(`cannot ${req.method} ${req.originalUrl}`, 404));
});

app.use((err, req, res, next) => {
  if (err instanceof ClientError) {
    res.status(err.status).json({ error: err.message });
  } else {
    console.error(err);
    res.status(500).json({
      error: 'an unexpected error occurred'
    });
  }
});

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Listening on port', process.env.PORT);
});
