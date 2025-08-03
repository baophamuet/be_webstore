import 'dotenv/config'


export default 
{
  "development": {
    
    "username": process.env.DB_USERNAME|| 'root',
    "password": process.env.DB_PASSWORD|| '',
    "database": process.env.DB_DATABASE_NAME|| 'webstore',
    "host": process.env.DB_HOST|| '127.0.0.1',
    "port": process.env.DB_PORT|| 3306,
    "dialect": process.env.DB_DIALECT || 'mysql',
    "logging": false,
    "query":{
      "raw":true,
    },
    "timezone":process.env.DB_TIMEZONE|| '+07:00',
  }
//   DB_PASSWORD= null
// DB_DATABASE_NAME ="webstore"
// DB_HOST="127.0.0.1"
// DB_PORT= "3362"
// DB_DIALECT="mysql"
// DB_LOGGING=false
// DB_TIMEZONE="+07:00"
  // "development": {
  //   "username": "root",
  //   "password": null,
  //   "database": "webstore",
  //   "host": "127.0.0.1",
  //   "dialect": "mysql",
  //   "logging": false
  // },
  // "test": {
  //   "username": "root",
  //   "password": null,
  //   "database": "database_test",
  //   "host": "127.0.0.1",
  //   "dialect": "mysql"
  // },
  // "production": {
  //   "username": "root",
  //   "password": null,
  //   "database": "database_production",
  //   "host": "127.0.0.1",
  //   "dialect": "mysql"
  // }
}
