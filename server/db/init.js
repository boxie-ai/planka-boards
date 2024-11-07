// eslint-ignore no-console
const initKnex = require('knex');

const knexfile = require('./knexfile');

const knex = initKnex(knexfile);

(async () => {
  try {
    console.log('environment variables:');
    console.log(JSON.stringify(process.env, null, 2));
    console.log('initializing db...');
    await knex.migrate.latest();
    await knex.seed.run();
    console.log('db successfully initialized!');
  } catch (error) {
    process.exitCode = 1;

    throw error;
  } finally {
    knex.destroy();
  }
})();
