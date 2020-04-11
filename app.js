import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import xml2js from 'xml2js';
import fs from 'fs';
import path from 'path';
import estimator from '../src/estimator';

const app = express();
const port = process.env.PORT || 3000;


app.use(helmet());
app.use(cors());
app.use(morgan(':method :url :status :response-time ms'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// setup the logger
app.use(morgan(':method :url :status :response-time ms', { stream: accessLogStream }));

app.get('/api/v1/on-covid-19/logs', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'access.log'));
});

app.post('/api/v1/on-covid-19/xml', (req, res) => {
  const builder = new xml2js.Builder();
  const xml = builder.buildObject(estimator(req.body));
  res.set('Content-Type', 'application/xml');
  res.status(200).send(xml);
});

app.post('/api/v1/on-covid-19/json', (req, res) => {
  res.set('Content-Type', 'application/json');
  res.status(200).json(estimator(req.body));
});

app.post('/api/v1/on-covid-19/', (req, res) => {
  res.set('Content-Type', 'application/json');
  res.status(200).json(estimator(req.body));
});


app.listen(port, (err) => {
  /* eslint no-console: off */
  if (err) {
    console.log('error is', err);
  }

  console.log(`server running on port ${port}`);
});
