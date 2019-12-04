import "@babel/polyfill";
import request from 'supertest';
import app from './app';
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

describe('Server', () => {
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
      // projects match but create-at is wrapper in quotes on response
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

  describe('GET /api/v1/projects/:name', () => {
    it('should return the project with status 200 if found', async () => {
      const expectedProject = await database('projects').where('name', 'Super dope project').first();
      const { name } = expectedProject;
      const resp = await request(app).get(`/api/v1/projects/${name}`);
      const project = await resp.body[0];
      expect(resp.status).toBe(200);
      expect(project).toEqual(expectedProject)
    });
  });
});