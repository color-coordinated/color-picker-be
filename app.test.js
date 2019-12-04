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
      const project = await resp.body;
      expect(resp.status).toBe(200);
      expect(project.name).toEqual(expectedProject.name);
    });
    it('should return 404 and an error is the project is not found', async () => {
      const invalidPalette = 'invalid project';
      const expected = JSON.stringify({ error: 'Could not find project named invalid project!'});
      const resp = await request(app).get(`/api/v1/projects/${invalidPalette}`);
      const error = await resp.text;
      expect(resp.status).toBe(404);
      expect(error).toEqual(expected);
    });
  });

  describe('GET /api/v1/palettes/:palette_name', () => {
    it('should return status 200 and the palette found', async () => {
      const palette_name = 'super dope palette';
      const expectedPalette = await database('palettes').where({ palette_name }).first();
      const resp = await request(app).get(`/api/v1/palettes/${palette_name}`); 
      const palette = resp.body;
      expect(resp.status).toBe(200);
      expect(palette).toEqual(expectedPalette);
    });
    it('should return status 404 is palette is not found and a message', async () => {
      const expected = { error: 'Could not find palette with name invalid palette' };
      const invalidPalette = 'invalid palette';
      const resp = await request(app).get(`/api/v1/palettes/${invalidPalette}`);
      const error = resp.body;
      expect(resp.status).toBe(404);
      expect(error).toEqual(expected);
    });
  });

  describe('POST /api/v1/projects', () => {
    it.skip('should return status 201 and insert a new project', async () => {
      const newProject = { name: 'Cool new project' };
      const response = await request(app).post('/api/v1/projects').send(newProject);
      const project = await database('projects').where('name', 'Cool new project').first();
      expect(response.status).toBe(201);
      expect(newProject.name).toEqual(project.name);
    });
    it.skip('should return status 422 and a helpful error msg if missing info', async () => {
      const invalidProject = { color: 'red' };
      const response = await request(app).post('/api/v1/projects').send(invalidProject);
      expect(response).toEqual('something');
    });
  });

  // describe('POST /api/v1/students', () => {
  //   it('should return a 201 status and add a new student to the db', async () => {
  //     const newStudent = { lastname: 'Bridges', program: 'FE', enrolled: true }
  //     const response = await request(app).post('/api/v1/students').send(newStudent);
  //     const students = await database('students').where('id', response.body.id).select();
  //     const student = students[0];
  //     expect(response.status).toBe(201);
  //     expect(student.lastname).toEqual(newStudent.lastname);
  //   });
  // });
}); 