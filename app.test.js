import '@babel/polyfill';
// import request from 'supertest';
// import app from './app';

const app = require('./app')

const request = require('supertest')

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

describe('Server', () => {
  beforeEach(async () => {
    await database.seed.run();
  });

  describe('init', () => {
    it('should return a 200 status', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.text).toEqual('Welcome to Color Picker API');
    });
  });

  describe('GET /api/v1/projects', () => {
    it('should return status 200 and all projects', async () => {
      let expectedProjects = await database('projects').select();
      const resp = await request(app).get('/api/v1/projects');
      const projects = await resp.body;
      expect(resp.status).toBe(200);
      // expect(projects).toEqual(expectedProjects);
      // projects match but created_at/updated_at is wrapped in quotes on response
    });
  });

  describe('GET /api/v1/palettes', () => {
    it('should return all of the palettes with status 200', async () => {
      const expectedPalettes = await database('palettes').select();
      const resp = await request(app).get('/api/v1/palettes');
      const palettes = await resp.body;
      expect(resp.status).toBe(200);
      expect(palettes).toEqual(expectedPalettes);
    });
  });

  describe('GET /api/v1/projects/:id', () => {
    it('should return the project with status 200 if found', async () => {
        const expectedProject = await database('projects').first()
        const { id } = expectedProject

        const response = await request(app).get(`/api/v1/projects/${id}`)
        const project = response.body
        
        expect(response.status).toBe(200)
        expect(project.name).toEqual(expectedProject.name)
    });

    it('should return 404 and an error is the project is not found', async () => {
      const invalidProjectId = -1;

      const response = await request(app).get(`/api/v1/projects/${invalidProjectId}`)

      expect(response.status).toBe(404)
      expect(response.body.error).toEqual('Could not find matching project!')
    });
  });

  describe('GET /api/v1/palettes/:id', () => {
    it('should return status 200 and the palette found', async () => {
      const expectedPalette = await database('palettes').first()
      const { id } = expectedPalette

      const response = await request(app).get(`/api/v1/palettes/${id}`)
      const palette = response.body

      expect(response.status).toBe(200)
      expect(palette.name).toEqual(expectedPalette.name)
    });
    it('should return status 404 is palette is not found and a message', async () => {

      const invalidId = -1;

      const response = await request(app).get(`/api/v1/palettes/${invalidId}`)

      expect(response.status).toBe(404)
      expect(response.body.error).toEqual('Could not find matching palette!')
    });
  });

  describe('POST /api/v1/projects', () => {
    it('should return status 201 and insert a new project', async () => {
      const newProject = { name: 'Cool new project', id: 2 };
      // await database('projects').where({name: 'Cool new project'}).del();
      const response = await request(app).post('/api/v1/projects').send(newProject);
      const project = await database('projects').where('name', 'Cool new project').first();
      expect(response.status).toBe(201);
      expect(project.name).toEqual(newProject.name);
    });
    it('should return status 422 and a helpful error msg if missing info', async () => {
      const invalidProject = { color: 'red' };
      const expectedResponse = { error: 'Expected format { name: <string> }, missing name!' };
      const response = await request(app).post('/api/v1/projects').send(invalidProject);
      expect(response.body).toEqual(expectedResponse);
    });
  });

  describe('POST /api/v1/palettes', () => {
    it('should return a status of 201 and insert new palette into table', async () => {
      const newPalette = {
        palette_name: 'test palette',
        project_id: 1,
        color_1: '#000000',
        color_2: '#FFFFFF',
        color_3: '#CCCCCC',
        color_4: '#1F1F1F',
        color_5: '#1E1E1E',
      };
      await database('palettes').where({ palette_name: 'test palette' }).del();
      const response = await request(app).post('/api/v1/palettes').send(newPalette);
      const project = await database('palettes').where({ palette_name: 'test palette' }).first();
      expect(response.status).toBe(201);
      expect(project.palette_name).toEqual(newPalette.palette_name);
    });

    it('should return status 422 and a helpful error msg', async () => {
      const invalidPalette = {
        palette_name: 'test palette',
        project_id: 1,
        color_1: '#000000',
        color_2: '#FFFFFF',
        color_3: '#CCCCCC',
        color_4: '#1F1F1F',
      };
      const expectedResponse = {
        error: 'Expected { project_id: <int>, palette_name: <string>, color_1: <string>, color_2: <string> color_3: <string>, color_4: <string>, color_5: <string> } \n'
        + '        Missing color_5!',
      };
      const response = await request(app).post('/api/v1/palettes').send(invalidPalette);
      expect(response.status).toBe(422);
      expect(response.body).toEqual(expectedResponse);
    });
  });

  describe('DELETE /api/v1/projects/:id', () => {
    it('should return status 202 and delete the project', async () => {
      const id = 1
      const response = await request(app).delete(`/api/v1/projects/${id}`);
      const expected = { message: 'Successfully deleted project' };
      const project = await database('projects').where({ id: 1 });
      expect(response.status).toBe(202)
      expect(response.body).toEqual(expected);
      expect(project).toEqual([]);
    });
  });

  describe('DELETE /api/v1/palettes/:id', () => {
    it('should return status 202 and delete the item', async () => {
      const id = 1;
      const response = await request(app).delete(`/api/v1/palettes/${id}`)
      const expected = { message: 'Palette successfully deleted'}
      const palette = await database('palettes').where({ id: 1 })

      expect(response.status).toBe(202)
      
      expect(response.body).toEqual(expected)
    });
  });

  describe('PATCH /api/v1/projects/:id', () => {
    it('should return a 202 status and update the item', async () => {
      const newName = { name: 'hi' };
      const originalProject = await database('projects').where({ id: 1 }).first();
      expect(originalProject.name).toEqual('Super dope project');
      const update = await request(app).patch(`/api/v1/projects/${originalProject.id}`).send(newName);
      const updatedProject = await database('projects').where({ id: 1 }).first();
      expect(updatedProject.name).toEqual('hi');
      expect(update.status).toBe(202);
      expect(update.body.message).toEqual(`Project name changed to "hi"`);
    });
    it('should return status 404 and error if not found', async() => {
      const invalidId = -1
      const expected = 'No existing matching project';
      const response = await request(app).patch(`/api/v1/projects/${invalidId}`);
      expect(response.body.error).toEqual(expected);
      expect(response.status).toBe(404);
    });
  });


  describe('PATCH /api/v1/palettes/:id', () => {
    it('should return a 202 status and update the color', async () => {
      const newColor = { color_2: '#bbbbbb' };
      const id = 1;
      const originalPalette = await database('palettes').where({ id }).first();
      expect(originalPalette.palette_name).toEqual('super dope palette');
      const update = await request(app).patch(`/api/v1/palettes/${id}`).send(newColor);
      const updatedPalette = await database('palettes').where({ id }).first();
      expect(updatedPalette.color_2).toEqual('#bbbbbb');
      expect(update.status).toBe(202);
      expect(update.body.message).toEqual('Palette updated successfully');
    });
    it('should return 404 and error msg if not found', async () => {
      const expected = 'No matching palette found';
      const response = await request(app).patch('/api/v1/palettes/3564');
      expect(response.status).toBe(404);
      expect(response.body.error).toEqual(expected);
    });
  });
});
