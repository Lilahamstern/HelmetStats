import * as mysql from 'mysql'
require('dotenv').config()

export class Database {

  private database: mysql.Connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  protected get currentDB() {
    return this.database;
  }

  protected openConnection() {
    this.database = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    this.database.connect((err: any) => {
      if (err) {
        return console.error('error: ' + err.message);
      }
    })
  }

  protected closeConnection() {
    this.database.end((err: any) => {
      if (err) {
        return console.log('Error: ' + err.message);
      }
    })
  }

  protected destoryConnection() {
    this.database.destroy()
  }
}
