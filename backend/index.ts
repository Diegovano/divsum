import express from 'express';
import path from 'path';
import sql from 'better-sqlite3';

const __dirname = import.meta.dirname;

const app = express();
const port = process.env.PORT || 3000;

const db = sql('foobar.db', { verbose: console.log });

app.listen(port, () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS people (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);
  // db.exec("INSERT INTO people (name) VALUES ('Alice')");
  console.log(`The app server is running on port: ${port}`);
});

const DIST_DIR = path.join(__dirname, '..', 'dist', 'frontend');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(DIST_DIR));

app.get('/db', (req, res) => {
  console.log(`req: ${req.url}`);
  // res.send(db.serialize().toLocaleString());
  try {
    // Get all user tables (excluding SQLite internal tables)
    const tables = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%';
    `).all() as { name: string}[];

    const dbJson: Record<string, unknown[]> = {};

    for (const { name } of tables) {
      const rows = db.prepare(`SELECT * FROM ${name};`).all();
      dbJson[name] = rows;
    }

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(dbJson, null, 2));
  } catch (err) {
    console.error('Error serializing DB to JSON:', err);
    res.status(500).json({ error: 'Failed to serialize database' });
  }
});

app.get('/people', (req, res) => {
  const peopleNameRecords = db.prepare("SELECT name from 'people'").all() as { name: string }[];
  const peopleNames = peopleNameRecords.map(record => record.name);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(peopleNames, null, 2));
});

app.get('/groups', (_req, res) => {
  const groupNameRecords = db.prepare("SELECT name from 'groups'").all() as { name: string }[];
  const groupNames = groupNameRecords.map(record => record.name);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(groupNames, null, 2));
});

app.post('/newGroup', (req, res) => {
  if (req.body?.name) {
    db.exec(`INSERT INTO 'groups' (name) VALUES ('${req.body.name}')`);
  }
  res.send('POST received at server!');
});
