// routes.js
// This is a big clunky file; you're advised to read side by side with the API doc (https://github.com/SeetiTel/Documentation/blob/master/API.md)

// POST /whistle/new/image	Creates a single whistle with the provided text data
// POST /whistle/new/text	Creates a single whistle with the provided text data
router.post('/whistle/new/', function(req, res) {
  var type = parseInt(req.body.type),
    data = req.body.data,
    query = "INSERT INTO whistles VALUES(?, ?, ?)",
    param,
    uploadFilename,
    newFilename;

  switch (type) {
    case 0:
      // text
      param = [Date.now(), 0, data];
      break;
    case 1:
      //voice; not supported
      res.status(404).json({
        error: 'Voice whistles not supported with this method'
      });
      return;
    case 2:
      //image

      //the upload logic is all handled directly by multer; all we do is get the filename. Horrid security, I know.
      //here, we'll get the filenames, both uploaded and future
      uploadFilename = "data\\" + req.files.data.name;
      newFilename = "data\\" + uuid.v4() + ".jpg";

      //renameSync doesn't have a callback; https://nodejs.org/api/fs.html
      fs.renameSync(uploadFilename, newFilename);

      param = [Date.now(), 2, newFilename];
      break;
    default:
      //invalid type
      res.status(404).json({
        error: 'Type ' + type + ' not found'
      });
      return;
  }

  //run the query
  db.run(query, param, function(err) {
    if (err) {
      res.status(500).json({
        error: err
      });
    } else {
      res.json({
        message: 'New whistle added.'
      });
    }
  });
});

// GET /whistles/{offset}	Returns an array of teasers starting after the given id (offset)
router.get('/whistles/:offset?', function(req, res) {
  var offset = req.params.offset ? parseInt(req.params.offset) : 0, //offset is either what they gave us, or zero
    query = 'SELECT ROWID as id, * FROM whistles ORDER BY created DESC LIMIT ' + offset + ', 25',
    results = [],
    teaser;

  //push each result into the array
  db.each(query, function(err, row) {
      //deal with differing row types, and make sure our teaser is appropriate for each
      switch (row.type) {
        case 0:
          // text
          teaser = row.value.slice(0, 40);
          break;
        case 1:
          //audio
          teaser = "(audio content)";
          break;
        case 2:
          //image
          teaser = "(image content)";
          break;
      }

      //push the results we got into the array
      results.push({
        "id": row.id,
        "created": row.created,
        "type": row.type,
        "teaser": teaser
      });
    },

    function(err, count) {
      if (!err) {
        //no error, SHIP IT!
        if (results.length > 0) {
          //we have good results; pass it to the user
          res.json(results);
        } else {
          //no results, let em know
          res.status(410).json({
            error: 'No more records.'
          });
        }
      } else {
        res.status(500).json({
          error: err
        });
      }
    });
});

//GET /whistles/search/{phrase}	Returns an array of teasers that contain the given string (phrase)
router.get('/whistles/search/:phrase', function(req, res) {
  //sqlite is being weird about preparing a wildcard LIKE param, so we'll just manually stick the %'s in ourselves
  var phrase = '%' + (req.params.phrase ? req.params.phrase : "searchfornothingbecauseyousuck") + '%',
    query = 'SELECT ROWID as id, * FROM whistles WHERE value LIKE ?',
    results = [];

  db.each(query, [phrase], function(err, row) {
      //deal with differing row types, and make sure our teaser is appropriate for each
      switch (row.type) {
        case 0:
          // text
          teaser = row.value.slice(0, 40);
          break;
        case 1:
          //audio text
          teaser = "(audio content)";
          break;
        case 2:
          //image
          teaser = "(image content)";
          break;
      }

      //push the results into the array
      results.push({
        "id": row.id,
        "created": row.created,
        "type": row.type,
        "teaser": teaser
      });
    },

    function(err, count) {
      if (!err) {
        //no error, SHIP IT!
        if (results.length > 0) {
          //we have good results; pass it to the user
          res.json(results);
        } else {
          //no results, let em know
          res.status(410).json({
            error: 'No records matching.'
          });
        }
      } else {
        res.status(500).json({
          error: err
        });
      }
    });
});

//GET /whistle/{id}	Returns a full whistle with the given id (id)
router.get('/whistle/:id', function(req, res) {
  //sqlite is being weird about preparing a wildcard LIKE paran, so we'll just manually stick them in
  var id = req.params.id ? parseInt(req.params.id) : 0,
    query = 'SELECT ROWID as id, * FROM whistles WHERE id=?',
    result = false;

  //run the query
  db.each(query, [id], function(err, row) {
      result = {
        "id": row.id,
        "created": row.created,
        "type": row.type,
        "content": row.value
      };
    },

    function(err, count) {
      if (!err) {
        //no error, SHIP IT!
        if (result !== false) {
          res.json(result);
        } else {
          //no results, let em know
          res.status(404).json({
            error: 'No such ID.'
          });
        }
      } else {
        res.status(500).json({
          error: err
        });
      }
    });
});
