import express from 'express'
import path from 'path'

import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import morgan from 'morgan'; // HTTP REQUEST LOGGER
import bodyParser from 'body-parser'; // PARSE HTML BODY
import mongoose from 'mongoose'
import session from 'express-session'

/* mongodb connection */
const db = mongoose.connection
db.on('error', console.error)
db.once('open', () => {
        console.log('Connected to mongodb server!')
    }
)
mongoose.connect('mongodb://localhost/codelab')

const app = express()
const port = 3000
const devPort = 4000

app.use(morgan('dev'));
app.use(bodyParser.json());
/* use session */
app.use(session({
    secret: 'JackChoi$!$!',
    resave: false,
    saveUninitialized: true
}))


app.use('/', express.static(path.join(__dirname, process.env.NODE_ENV == 'development' ? './../../public' : './../public')));

/* routes */
import api from './routes'
app.use('/api', api)


/* support client-side routing */
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, process.env.NODE_ENV == 'development' ? './../../public/index.html' : './../public/index.html'))
})


/* handle error */
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


app.listen(port, () => {
    console.log('Express is listening on port', port);
});


if (process.env.NODE_ENV == 'development') {
    console.log('DEVELOPEMENT MODE!!!')
    const config = require('../../webpack.dev.config');
    const compiler = webpack(config);
    const devServer = new WebpackDevServer(compiler, config.devServer);
    
    devServer.listen(
        devPort, () => {
            console.log('webpack-dev-server is listening on port', devPort);
        }
    );
}