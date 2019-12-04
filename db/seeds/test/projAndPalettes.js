const mockPalettes = require('../../../mockPalettes')
const mockProject = require('../../../mockProj')


exports.seed = async knex => {
  await knex('projects').del()
  await knex('projects').insert(mockProject);
  await knex('palettes').del();
  await knex('palettes').insert(mockPalettes)
}