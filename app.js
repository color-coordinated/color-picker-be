import express from 'express';
import cors from 'cors';
const app = express();
const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)

app.locals.title = 'Color Picker Backend';
app.use(cors());
app.use(express.json());

app.get('/', (request, response) => {
  response.send('Welcome to Color Picker API');
});

app.get('/api/v1/projects', (req, resp) => {
  database('projects')
    .select()
    .then((projects) => resp.status(200).json(projects))
    .catch((err) => resp.status(500).json({ err }));
});

app.get('/api/v1/palettes', (req, resp) => {
  database('palettes')
    .select()
    .then((palettes) => resp.status(200).json(palettes))
    .catch((err) => resp.status(500).json({ err }));
});

export default app;