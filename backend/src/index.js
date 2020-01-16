const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const config = require('./config');
const routes = require('./routes')

const app = express();

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(cors({ origin: ['http://localhost:3000', /\.example2\.com$/] }))
// origin aceita um array com as origens permitidas, podendo ser utilizada
// RegExp também. No exemplo, é permitido o localhost:3000 e qualquer subdomínio
// de example2.com
app.use(express.json());
app.use(routes);

app.listen(3333);