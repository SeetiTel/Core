// SET UP LOGGING
// =============================================================================
var logRequest = function(req, res, next) {
  console.log(chalk.blue(upTime + "; " + req.headers['user-agent']) + " " + chalk.green(req.method + " " + req.originalUrl));
  next(); // Passing the request to the next handler in the stack.
};

function logResponse(req, res, next) {
  var oldWrite = res.write,
    oldEnd = res.end;

  var chunks = [];

  res.write = function(chunk) {
    chunks.push(chunk);
    oldWrite.apply(res, arguments);
  };

  res.end = function(chunk) {
    if (chunk) {
      chunks.push(chunk);
    }

    var body = Buffer.concat(chunks).toString('utf8');
    console.log(req.path, body.substring(0, 100));

    oldEnd.apply(res, arguments);
  };

  next();
}



app.use(cors()); //handle CORS requests
app.use(multer({
  dest: './data/'
})); //let us process POST data
app.use(logRequest); //log all requests to console
app.use(logResponse); //log all responses to console
app.use('/api/v1/', router); //route our API endpoints
app.use('/data', express.static('data')); //route our static resource directory

// TIMING
// =============================================================================
var upTime = 0; // uptime in secondsa
var upTimeCounter = setInterval(
  function() {
    upTime++;
  }, 1000
);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('SeetiTel API server listening on port ' + port); //Bring it.
