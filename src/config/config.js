import 'dotenv/config'


export default 
{
  "development": {
    
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE_NAME,
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT,
    "dialect": process.env.DB_DIALECT,
    "logging": false,
    "query":{
      "raw":true,
    },
    "timezone":process.env.DB_TIMEZONE,
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
