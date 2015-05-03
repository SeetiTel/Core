// SET UP LOGGING
// =============================================================================
var logger = function(req, res, next) {
  console.log(chalk.blue(upTime + "; " + req.headers['user-agent']) + " " + chalk.green(req.method + " " + req.originalUrl));
  next(); // Passing the request to the next handler in the stack.
};

app.use(cors()); //handle CORS requests
app.use(multer({
  dest: './data/'
})); //let us process POST data
app.use(logger); //log all requests to console
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
