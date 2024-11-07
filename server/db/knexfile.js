const path = require('path');
const dotenv = require('dotenv');
const _ = require('lodash');

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

// function buildSSLConfig() {
//   if (process.env.KNEX_REJECT_UNAUTHORIZED_SSL_CERTIFICATE === 'false') {
//     return {
//       sslmode: 'require',
//       rejectUnauthorized: false,
//     };
//   }

//   return false;
// }

module.exports = {
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      sslmode: 'require',
      rejectUnauthorized: false,
    },
  },
  migrations: {
    tableName: 'migration',
    directory: path.join(__dirname, 'migrations'),
  },
  seeds: {
    directory: path.join(__dirname, 'seeds'),
  },
  wrapIdentifier: (value, origImpl) => origImpl(_.snakeCase(value)),
};
