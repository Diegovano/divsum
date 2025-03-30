// // import * as sql from 'better-sqlite3';
// import * as express from 'express';
// import path from 'path';

// const app = express();
// const port = 3000;

// // const db = sql('foobar.db', { verbose: console.log });

// app.use(express.json());
// app.use(express.static('public'));
// app.use(express.static('build'));

// app.get('/', (_req, res) => {
//   // res.send('Hello World!');
//   // res.send(db.serialize().toLocaleString())
//   res.sendFile(path.join(__dirname, '/../frontend/dist/index.html'), err => {
//     if (err) {
//       res.status(500).send(err);
//     }
//   });
// });

// // app.get('/append', (req, res) => {
// //   if (req.query.id) db.prepare('INSERT INTO transaction (value) VALUES (?)').run(req.query.id);
// // });

// // interface userProfile {
// //   userId: number,
// //   firstName: string,
// //   lastName: string,
// //   email: string
// // }

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);

//   // const userId = 5;

//   // const row = db.prepare<userProfile['userId'], userProfile>('SELECT * FROM users WHERE id = ?').get(userId);
//   // console.log(row.firstName, row.lastName, row.email);
// });

import * as express from 'express';
import * as path from 'path';

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`The app server is running on port: ${port}`);
});

const DIST_DIR = path.join(__dirname, '..', 'frontend');
const HTML_FILE = path.join(DIST_DIR, 'index.html');

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/public')));
app.use(express.static(DIST_DIR));

app.get('/', (req, res) => {
  console.log(`req: ${req.url}`);
  res.sendFile(HTML_FILE, err => {
    if (err) {
      res.status(500).send(err);
    }
  });
});
