import { Database } from './Database'

class Account extends Database {

  private db = this.currentDB;

  public checkSetup(id: string, cb: (response: any) => any) {
    let sql = "SELECT setup FROM account WHERE id = ? LIMIT 1;"
    this.openConnection();
    let data: any;
    this.db.query(sql, id, (error: any, res: any, _fields: any) => {
      if (error) {
        data = "Error: " + error.message;
      } else {
        data = res;
      }
      this.closeConnection();
      this.destoryConnection();
      cb(data)
    })
  }

  public changeSetup(id: string, cb: (response: any) => any) {
    let sql = "UPDATE account SET setup = 1 WHERE id = ?;"
    this.openConnection()
    let data: any;
    this.db.query(sql, id, (error: any, res: any, _fields: any) => {
      if (error) {
        data = "Error: " + error.message;
      } else {
        data = res;
      }
      this.closeConnection();
      this.destoryConnection();
      cb(data)
    })
  }

  // Get user account data
  public get(name: string, cb: (resposne: any) => any) {
    let sql = "SELECT * FROM account WHERE OWName = ? LIMIT 1"
    this.openConnection()
    let data: any;
    this.db.query(sql, [name], (error: any, res: any, _fields: any) => {
      if (error) {
        data = "Error: " + error.message;
      } else {
        data = res[0]
      }
      this.closeConnection()
      this.destoryConnection()
      cb(data)
    })
  }

  // Data for user login
  public login(name: string, cb: (resposne: any) => any) {
    let sql = "SELECT * FROM account WHERE OWName = ? LIMIT 1"
    this.openConnection()
    let data: any;
    this.db.query(sql, [name], (error: any, res: any, _fields: any) => {
      if (error) {
        data = "Error: " + error.message;
      } else {
        data = res[0]
      }
      this.closeConnection()
      this.destoryConnection()
      cb(data)
    })
  }

  // Inser and create user to database
  public create(name: string, accountID: string, OWName: string, cb: (data: any) => any) {
    let sql = "SELECT * FROM account WHERE OWName = ?"
    this.openConnection()
    let data: any
    this.db.query(sql, OWName, (error: any, res: any, _fields) => {
      if (error) {
        data = "Error: " + error.message
      } else {
        data = res;
      }
      this.closeConnection()
      if (data.length === 0) {
        sql = `INSERT INTO account(name, accountID, OWName) SELECT name, accountID, OWName FROM (SELECT '${name}' as name, '${accountID}' as accountID, '${OWName}' as OWName) t WHERE t.name NOT IN (SELECT a.name FROM account a);`
        this.openConnection()
        this.db.query(sql, [name, accountID, OWName], (error: any, res: any, _fields: any) => {
          if (error) {
            data = "Error: " + error.message;
          } else {
            data = res
          }
          this.closeConnection()
          this.destoryConnection()
          cb(data)
        })
      } else {
        cb("Overwolf")
      }
    })
  }

  // Update user information
  public update(id: string, accountID: string, name: string, cb: (response: any) => any) {
    let sql = "SELECT * FROM account WHERE id = ?"
    this.openConnection()
    let data: any
    this.db.query(sql, id, (error: any, res: any, _fields: any) => {
      if (error) {
        data = "Error: " + error.message
      } else {
        data = res
      }
      this.closeConnection()
      if (data.length === 0) {
        return cb(data)
      }
      sql = "SELECT DATEDIFF(?, ?) as date_difference"
      this.openConnection()
      let d = Date.now();
      let date = new Date(d)
      this.db.query(sql, [date, data[0]["updated_at"]], (error: any, res: any, _fields: any) => {
        if (error) {
          data = "Error: " + error.message
        } else {
          data = res
        }
        this.closeConnection()
        if (data[0]["date_difference"] < 20) {
          cb(`Error: Days ${data[0]["date_difference"]}`)
        } else {
          let sql = `SELECT * FROM account WHERE accountID = ? OR name = ?`
          this.openConnection()
          let data: any
          this.db.query(sql, [accountID, name], (error: any, res: any, _fields: any) => {
            if (error) {
              data = "Error: " + error.message
            } else {
              data = res;
            }
            this.closeConnection()
            if (data.length != 0) {
              cb("Error: Account is taken!")
            } else {
              let sql = `UPDATE account SET name = ?, accountID = ? WHERE id = ?`
              this.openConnection()
              let data: any
              this.db.query(sql, [name, accountID, id], (error: any, res: any, _fields: any) => {
                if (error) {
                  data = "Error: " + error.message;
                } else {
                  data = res;
                }
                this.closeConnection()
                cb(data)
              })
            }
          })
        }
      })
    })
  }

  // Remove user from database
  public remove(id: string, cb: (data: any) => any) {
    let sql = `DELETE FROM account WHERE id = ?`
    this.openConnection()
    let data: any
    this.db.query(sql, id, (error: any, res: any, _fields: any) => {
      if (error) {
        data = "Error: " + error.message
      } else {
        data = res
      }
      this.closeConnection()
      this.destoryConnection()
      cb(data)
    })
  }

  // Log user everyday
  public log(id: string, cb: (data: any) => any) {
    let d = Date.now();
    let date = new Date(d)
    let todayDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    let sql = `INSERT INTO account_logs(accountId, date) SELECT accountId, date FROM (SELECT '${todayDate}' as date, '${id}' as accountId) t WHERE t.date NOT IN (SELECT al.date FROM account_logs al)`

    this.openConnection()
    let data: any
    this.db.query(sql, [id, todayDate], (error: any, res: any, _fields: any) => {
      if (error) {
        data = "Error: " + error.message;
      } else {
        data = res
      }
      this.closeConnection()
      this.destoryConnection()
      cb(data)
    })
  }
}

let account = new Account

export default account;