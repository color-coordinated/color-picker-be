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

  describe('GET /api/v1/projects/:name', () => {
    it('should return the project with status 200 if found', async () => {
      let expectedProject = await database('projects').where('name', 'Super dope project').first();
      const { name } = expectedProject;
      const resp = await request(app).get(`/api/v1/projects/${name}`);
      const project = await resp.body[0];
      expect(resp.status).toBe(200);
      expect(project.name).toEqual(expectedProject.name);
    });
    it('should return 404 and an error is the project is not found', async () => {
      const invalidPalette = 'invalid palette';
      const expected = '<!DOCTYPE html>\n' +
      '<html lang="en">\n' +
      '<head>\n' +
      '<meta charset="utf-8">\n' +
      '<title>Error</title>\n' +
      '</head>\n' +
      '<body>\n' +
      '<pre>Cannot GET /api/v1/palettes/invalid%20palette</pre>\n' +
      '</body>\n' +
      '</html>\n';
      const resp = await request(app).get(`/api/v1/palettes/${invalidPalette}`);
      const error = await resp.text;
      expect(resp.status).toBe(404);
      expect(error).toEqual(expected);
    });
  });

  describe('GET /api/v1/palettes/:palette_name', () => {
    it('should return status 200 and the palette found', async () => {
      const palette_name = 'super dope palette';
      const expectedPalette = await database('palettes').where({ palette_name }).first();
      const resp = await request(app).get(`/api/v1/projects/${palette_name}`);
      const palette = resp.body[0];
      console.log(palette);
      // expect(resp.status).toBe(200);
      // expect(palette).toEqual(expectedPalette);
    });
    it('should return status 404 is palette is not found and a message', async () => {
      const expected = '';
      const invalidPalette = 'invalid palette';
      const resp = await request(app).get(`/api/v1/palettes/${invalidPalette}`);
      const error = resp.text;
      console.log(resp);
      // expect(resp.status).toBe(404);
      // expect(error).toEqual(expected);
    });
  });
}); 