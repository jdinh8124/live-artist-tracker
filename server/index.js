require('dotenv/config');
const express = require('express');
const db = require('./database');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const sessionMiddleware = require('./session-middleware');
const SpotifyWebApi = require('spotify-web-api-node');
const axios = require('axios');

const spotifyApi = new SpotifyWebApi();

spotifyApi.setAccessToken('BQCrhVDhuJ1wp8N9P7JKJzVnyllA3_7KfF2qIQaWONFz9cf_0bGITWDwxAQlUwX8No7d2yy5ayCBgddw85XVHTDY3GixdZWztP1fCFW9t4N15TJ8NqeJs-l3_tguMw4K19LW0xrKKlFFUL84XPG1YVXKJKjU727WznDiH5Tf7dY-5JMh-uWccvNoQWGY9yIPfbUVL9Ofhc7X9pkglNOYF0o0piNY5xmny_z38pwJHHevjLY5u8MqUKblIzdpFOGehyf0CD0vOzeRVfc');

const app = express();

app.use(staticMiddleware);
app.use(sessionMiddleware);

app.use(express.json());

app.get('/api/health-check', (req, res, next) => {
  db.query('select \'successfully connected\' as "message"')
    .then(result => res.json(result.rows[0]))
    .catch(err => next(err));
});

app.get('/api/getTop', (req, res, next) => {

  axios({
    method: 'get',
    url: 'https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=10&offset=5',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer BQCrhVDhuJ1wp8N9P7JKJzVnyllA3_7KfF2qIQaWONFz9cf_0bGITWDwxAQlUwX8No7d2yy5ayCBgddw85XVHTDY3GixdZWztP1fCFW9t4N15TJ8NqeJs-l3_tguMw4K19LW0xrKKlFFUL84XPG1YVXKJKjU727WznDiH5Tf7dY-5JMh-uWccvNoQWGY9yIPfbUVL9Ofhc7X9pkglNOYF0o0piNY5xmny_z38pwJHHevjLY5u8MqUKblIzdpFOGehyf0CD0vOzeRVfc'
    }
  })
    .then(result => res.json(result.data.items))
    .catch(err => next(err));
});

app.get('/api/artists', (req, res, next) => {

  spotifyApi.getArtist('45eNHdiiabvmbp4erw26rg')
    .then(result => res.json(result.body))
    .catch(err => next(err));

});

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
