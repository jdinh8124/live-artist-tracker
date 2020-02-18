require('dotenv/config');
const express = require('express');
const db = require('./database');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const sessionMiddleware = require('./session-middleware');
const SpotifyWebApi = require('spotify-web-api-node');
const axios = require('axios');
const request = require('request'); // "Request" library
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const app = express();

const client_id = '730e84b51dc84b85a589f682a1ef6e7e'; // Your client id
const client_secret = '51359e0c9ecd486c830f9865bbd62d0d'; // Your secret
const redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */

var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';
// app.use(express.static(__dirname + '/public'))
app.use(cors())
  .use(cookieParser());

var spotifyApi = new SpotifyWebApi({
  clientId: 'fcecfc72172e4cd267473117a17cbd4d',
  clientSecret: 'a6338157c9bb5ac9c71924cb2940e1a7'
});
// spotifyApi.setAccessToken('BQANOhASlKgkj_5Ot7SQp73x3uxQh-vxnOy9M4RX0toTAy1Za2-ui35Mw_YUFPMK-eejxVp3gHk0bIzel6uG9r9yTs0A07fgVwIFzDMfZzauc9hbWLsiKjgQWTP5sJOmx4Ij576oOri3ZCcsc_eG0yenRQEKps-fBRw7NuFuGzMoNmz1DlD7AC40BHlcTBBAqspRm-PFtjYK5BTsv72dMwF1AL02-1j2yBwmQvRVSG4ei1YErpcvciAe3uT2zBNkhvwxOrz-nZ9aVic');

// 730e84b51dc84b85a589f682a1ef6e7e
// 51359e0c9ecd486c830f9865bbd62d0d
// http://localhost:8888/callback

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
      Authorization: 'Bearer BQANOhASlKgkj_5Ot7SQp73x3uxQh-vxnOy9M4RX0toTAy1Za2-ui35Mw_YUFPMK-eejxVp3gHk0bIzel6uG9r9yTs0A07fgVwIFzDMfZzauc9hbWLsiKjgQWTP5sJOmx4Ij576oOri3ZCcsc_eG0yenRQEKps-fBRw7NuFuGzMoNmz1DlD7AC40BHlcTBBAqspRm-PFtjYK5BTsv72dMwF1AL02-1j2yBwmQvRVSG4ei1YErpcvciAe3uT2zBNkhvwxOrz-nZ9aVic'
    }
  })
    .then(result => res.json(result.data.items))
    .catch(err => next(err));
});

app.get('/api/artists', (req, res, next) => {
// 45eNHdiiabvmbp4erw26rg
  console.log('hello');
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
