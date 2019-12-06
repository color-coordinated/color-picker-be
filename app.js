import express from 'express';
import cors from 'cors';

const app = express();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

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

app.get('/api/v1/projects/:id', (req, resp) => {
  const { id } = req.params;
  database('projects')
    .where({ id })
    .then((project) => {
      if (project.length) {
        resp.status(200).json(project[0]);
      } else {
        resp.status(404).json({ error: `Could not find matching project!` });
      }
    })
    .catch((err) => resp.status(500).json({ err }));
});

app.get('/api/v1/palettes/:id', (req, resp) => {
  const { id } = req.params;
  database('palettes')
    .where({ id })
    .then((palette) => {
      if (palette.length) {
        resp.status(200).json(palette[0]);
      } else {
        resp.status(404).json({ error: `Could not find matching palette!` });
      }
    })
    .catch((err) => resp.status(500).json({ err }));
});

app.post('/api/v1/projects', (req, resp) => {
  const receivedData = req.body;
  if (!receivedData.name) {
    return resp.status(422).json({ error: `Expected format { name: <string> }, missing name!` });
  }
  database('projects')
    .where({ name: receivedData.name })
    .then((projects) => {
      if (projects.length) {
        return resp.status(422).json({ error: 'Project with that name alrady exists!' });
      }
      database('projects').insert(receivedData, 'id')
        .then((data) => {
          resp.status(201).json({ id: data[0] });
        });
    })
    .catch((err) => resp.status(500).json({ err }));
});

app.post('/api/v1/palettes', (req, resp) => {
  const receivedData = req.body;
  for (const requiredParam of ['project_id', 'palette_name', 'color_1', 'color_2', 'color_3', 'color_4', 'color_5']) {
    if (!receivedData[requiredParam]) {
      return resp.status(422).json({
        error: `Expected { project_id: <int>, palette_name: <string>, color_1: <string>, color_2: <string> color_3: <string>, color_4: <string>, color_5: <string> } 
        Missing ${requiredParam}!`,
      });
    }
  }
  database('palettes')
    .insert(receivedData, 'id')
    .then((newPalette) => resp.status(201).json({ id: newPalette[0] }))
    .catch((err) => resp.status(500).json({ err }));
});

app.delete('/api/v1/projects/:id', (req, resp) => {
  const { id } = req.params;
  database('projects')
    .where({ id })
    .del()
    .then(() => resp.status(202).json({ message: `Successfully deleted project` }))
    .catch((err) => resp.status(500).json({ err }));
});

app.delete('/api/v1/palettes/:id', (req, resp) => {
  const { id } = req.params;
  database('palettes')
    .where({ id })
    .del()
    .then(() => resp.status(202).json({ message: `Palette successfully deleted` }))
    .catch((err) => resp.status(500).json({ err }));
});

app.patch('/api/v1/projects/:id', (request, response) => {
  const { id } = request.params;
  database('projects').where({ id })
    .then((project) => {
      if (!project.length) {
        return response.status(404).json({ error: `No existing matching project` });
      }
      database('projects').where({ id }).update({
        name: request.body.name,
      })
        .then(() => response.status(202).json({ message: `Project name changed to "${request.body.name}"` }));
    })
    .catch((error) => response.status(500).json({ error }));
});

app.patch('/api/v1/palettes/:palette_name', async (request, response) => {
  const { palette_name } = request.params;
  const selectedPalette = await database('palettes').where('palette_name', palette_name).select();
  const doesExist = selectedPalette.length ? true : false;
  if (!doesExist) {
    return response.status(404).json({ error: `No existing palette with name of ${palette_name}` });
  }
  for (const possibleParameter of ['color_1', 'color_2', 'color_3', 'color_4', 'color_5']) {
    if (request.body[possibleParameter] && doesExist) {
      database('palettes').where({ palette_name }).update({
        [possibleParameter]: request.body[possibleParameter],
      })
        .then(() => response.status(202).json({ message: 'Color updated' }))
        .catch((error) => response.status(500).json({ error }));
    }
  }
});

export default app;
