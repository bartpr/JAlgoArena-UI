var config = require('./server/config/config.js');

var env = config.env;
var port = config.port;
var logger = require('./server/config/logger.js');

logger.debug('Env: ' + env);

var path = require('path');
var bodyParser = require('body-parser');
var passport = require('passport');
var express = require('express');

var morgan = require('morgan');
var helmet = require('helmet');
var serveStatic = require('serve-static');

var app = express();
app.config = config;
var compression = require('compression');
app.use(compression());

app.use(morgan('tiny', {'stream': logger.stream}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
helmet(app);

var userDb = require('./server/newLocalDb.js')('users.db', logger);
require('./server/config/passport.js')(app, passport, userDb);

var ranking = require('./server/core/ranking.js').ranking;
var problemRanking = require('./server/core/ranking').problemRanking;
var submissionDb = require('./server/newLocalDb.js')('submissions.db', logger);
require('./server/routes/index')(app, passport, submissionDb, userDb, ranking, problemRanking, logger);

logger.debug('Configuring: ' + env);

var assetsDir;

if (env == 'production') {
    require('./server/build/copyFiles')(logger);
    assetsDir = path.join(__dirname, 'public', 'assets');
} else {
    require('./server/config/devWebpack')(app, logger);
    assetsDir = path.join(__dirname, 'assets');
}

app.use(serveStatic(assetsDir));

app.get('*', function (req, res) {
    res.sendFile(path.join(assetsDir, 'index.html'));
});

function logErrors(err, req, res, next) {
    logger.error(err);
    next(err);
}

function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        res.status(500).send({error: err});
    } else {
        next(err);
    }
}

function errorHandler(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
}

app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

app.listen(port, function () {
    logger.info('Server started at http://localhost:' + port);
});

