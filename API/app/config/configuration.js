module.exports = {

  /**
  * This is the configuration of your API
  * All these settings are required
  * You can easly add some configuration

  * To get your configuration just require the file

  * Example:
  * config = require('/path/to/configuration');
  * config.my_settings
  */

  /**
  * This is where you specify your database parameter
  * Only using mongoDB
  * You need a host, a database name, a user and a password
  */
  dbType: 'mongodb',
  dbHost: 'mongodb://127.0.0.1/',
  dbName: 'todo',
  dbUser: '',
  dbPassword: '',

  /**
  * Upload directory
  * Where files will be upload
  */
  uploadDir: 'uploads',

  /**
  * This is really important
  * This key will be use to crypt tokens
  * All requests could need to be authenticate with token
  */
  secretKey: 'mysupersecretkey',

  /**
  * A little message show when you start your server
  */
  messageOnConsole: 'Magic happen on port:',

  /**
  * If true, Morgan module will log every request to the console
  */
  dev: true,

  /**
  * This is the prefix use to call the api
  * Example:
  * if apiPrefix => /api
  * calling api will be domain.com/api/user/XX
  * Coming soon !
  * if you are using a subdomain like api.mydomain.com
  * You can just pass it to false
  */
  apiPrefix: '/api',
};