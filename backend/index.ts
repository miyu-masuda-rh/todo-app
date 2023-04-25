import express from "express";
import mysql  from "mysql2/promise"

const PORT: number = 8080;
const app = express();
// データベースにコネクティングしたままにする
const pool = mysql.createPool({
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'practice',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

app.listen(PORT, ():void => {
    console.log(`Start on port ${PORT}.`);
});

app.get("/", async (req: express.Request, res: express.Response) => {
    try {
        console.log('before');
        await pool.execute('DO SLEEP(8)');
        console.log('after');
        res.send('Hello world');
    } catch(err:any) {
        res.send(err.message);
    }
});


// close database connection correctly
process.on('SIGINT', () => {
    pool.end();
    console.log('Connection pool closed');
    process.exit(0);
});

// app.get("/insert", async (req: express.Request, res: express.Response) => {
//     try {
//         let rows: any = await pool.execute(
//           `INSERT INTO tests (id,name) VALUES ('1', \"masuda\")`
//         );       
//         res.send(rows)
//     } catch(err:any) {
//         res.send(err.message);
//     }
// });

app.get("/insert", async (req: express.Request, res: express.Response) => {
    try {
        const name = req.query.name;
        // execute関数→DBに命令する
        const rows: any =await pool.execute(
          `INSERT INTO tests (name) VALUES ('${name}')`
        );       
        //  直近のクエリの AUTO_INCREMENT カラムで生成した値を返す オートインクリメント
        res.json({"status":200, "id":rows[0]["insertId"], "name":name})
    } catch(err:any) {
        res.send(err.message);
    }
});

// app.get("/select", async (req: express.Request, res: express.Response) => {
//     try {
//         // const [rows].....
//         const [name]: any =await pool.execute(
//           `SELECT * from tests`
//         );
//         //  res.json({"status":200, rows:name})
//         res.json({"status":200, name})
//     } catch(err:any) {
//         res.send(err.message);
//     }
// });

app.get("/select", async (req: express.Request, res: express.Response) => {
    try {
        const id = req.query.id;
        const rows: any =await pool.execute(
          `SELECT name from tests where id=${id}`
        );
        //  res.json(rows)
        //  names:rows[0][0]["name"]
        // res.statusCode=200
        // name:is 何
        res.json({"status":res.statusCode, name:rows[0][0].name})
    } catch(err:any) {
        res.send(err.message);
    }
});

