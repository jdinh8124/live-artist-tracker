require('dotenv/config');
const express = require('express');
const db = require('./database');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const sessionMiddleware = require('./session-middleware');
const SpotifyWebApi = require('spotify-web-api-node');
const axios = require('axios');

const spotifyApi = new SpotifyWebApi();

spotifyApi.setAccessToken('BQCwJuTwYkEi4se_9kjGjVbriGTB4pbMK2BW5Pgy6GRoptZ7NjJO6ysZrYVm0Eew4M7H5ahD9Ok7xC6fuIrtys00hbo20WTLUY-Qfu9JrrRh_kMFzuNzXNj6WL8qVpEnYTkaG7cT4UqQSNcOJpV5RD6YWW9XmiLsen5v_its3NmC0POqd1J54IacC9c2KDPvMfHhiUiwKCZSxCAnPX6mJs5mp_Tk6IyDx-BjLtKbOlyeNZPxq3Sz0pM1N1iJH8hUjlolmHBoFn0SV9o');

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
      Authorization: 'Bearer BQCwJuTwYkEi4se_9kjGjVbriGTB4pbMK2BW5Pgy6GRoptZ7NjJO6ysZrYVm0Eew4M7H5ahD9Ok7xC6fuIrtys00hbo20WTLUY-Qfu9JrrRh_kMFzuNzXNj6WL8qVpEnYTkaG7cT4UqQSNcOJpV5RD6YWW9XmiLsen5v_its3NmC0POqd1J54IacC9c2KDPvMfHhiUiwKCZSxCAnPX6mJs5mp_Tk6IyDx-BjLtKbOlyeNZPxq3Sz0pM1N1iJH8hUjlolmHBoFn0SV9o'
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
