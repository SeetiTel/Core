// MAINTENANCE ROUTES
// =============================================================================

// Set up our security
//  HTTP BASIC AUTH
//  User: seeti
//  Pass: tel
var auth = function(req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.sendStatus(401);
  }

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  }

  if (user.name === 'seeti' && user.pass === 'tel') {
    return next();
  } else {
    return unauthorized(res);
  }
};

//GET /status	Returns a DB and API status report
router.get('/status', function(req, res) {
  db.each("SELECT count(*) as count FROM whistles", function(err, row) {
    res.json({
      infrastructure: 'API has been up for ' + upTime + ' seconds',
      db: 'DB is up with ' + row.count + ' rows.'
    });
  });
});

//DELETE /whistles	Flushes all whistles.
router.delete('/whistles', auth, function(req, res) {
  db.serialize(function() {
    //drop the table, then readd it.
    db.run("DROP TABLE IF EXISTS whistles");
    db.run("CREATE TABLE IF NOT EXISTS whistles(created INTEGER, type INTEGER, value TEXT)", function(err) {
      if (err) {
        res.status(500).json({
          error: err
        });
        console.log(chalk.red("Error! " + err));
      } else {
        res.json({
          message: 'DB table truncated'
        });
      }
    });
  });
});

//DELETE /whistle/{id}	Flushes whistle with given ID
router.delete('/whistle/:id?', auth, function(req, res) {
  var id = req.params.id ? [parseInt(req.params.id)] : [0],
  query = "DELETE from whistles WHERE rowid = ?";
  
  db.run(query, id, function(err) {
    if (err) {
      res.status(500).json({
        error: err
      });
      console.log(chalk.red("Error! " + err));
    } else {
      res.json({
        message: 'Whistle deleted.'
      });
    }
  });
});

//POST /whistle/demo/{type}	Creates a single test whistle with the given type
router.post('/whistle/demo/:type?', function(req, res) {
  //set up a demo query with dummy values
  var type = req.params.type ? parseInt(req.params.type) : 1, //type is either what they gave us, or one
    query = "INSERT INTO whistles VALUES(?, ?, ?)",
    param;

  switch (type) {
    case 1:
      //text
      param = [Date.now(), 0, 'Random Demo ' + Math.random().toString(36).substring(7)];
      break;
    case 2:
      //audio
      param = [Date.now(), 1, '/data/61ababf6-ebc9-49fa-b75d-2c226ef8d56e.mp3'];
      break;
    case 3:
      //image
      param = [Date.now(), 2, '/data/91eada55-fdd1-455c-a927-3cc7ab918b17.jpg'];
      break;
    default:
      //usually happens when a requested type is an int, but out of range
      res.status(500).json({
        error: 'No valid type found.'
      });

      console.log(chalk.red("Error! No valid type found."));
      return;
  }

  //run the query
  db.run(query, param, function(err) {
    if (err) {
      res.status(500).json({
        error: err
      });
      console.log(chalk.red("Error! " + err));
    } else {
      res.json({
        message: 'Demo entry added.'
      });
    }
  });
});

//GET /status	Returns a DB and API status report
router.get('/status', function(req, res) {
  db.each("SELECT count(*) as count FROM whistles", function(err, row) {
    res.json({
      infrastructure: 'API has been up for ' + upTime + ' seconds',
      db: 'DB is up with ' + row.count + ' rows.'
    });
  });
});
