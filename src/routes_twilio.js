// `GET /twilio/sms/`  | Twilio sms endpoint (undocumented; just point the Twilio client here)

router.get('/twilio/sms/', function(req, res) {
  var message,
    query = "INSERT INTO whistles VALUES(?, ?, ?)",
    param,
    filename = uuid.v4() + ".jpg";

  if (req.query.NumMedia > 0) {
    //this message has media; disregard the text
    
    //create a stream to put the file in, request it, and store it.
    //the URL where it's kept is in req.query.MediaUrl0
    var file = fs.createWriteStream("data/" + filename);
var request = https.get(req.query.MediaUrl0, function(response) {
  response.pipe(file);
  
  param = [Date.now(), 2, "data\\" + filename];

    //run the query
    db.run(query, param, function(err) {
      if (err) {
        //send back TWIML response
        res.type('text/html'); // set content-type
        res.send('<?xml version="1.0" encoding="UTF-8"?><Response><Sms>Sorry, something went wrong. Please try again.</Sms></Response>');
        console.log(chalk.red("Error! " + err));
      } else {
        //send back TWIML response
        res.type('text/html'); // set content-type
        res.send('<?xml version="1.0" encoding="UTF-8"?><Response><Sms>Thank you; your whistle has been recieved.</Sms></Response>');
      }
    });
});
  } else {
    //this query is just a text
    param = [Date.now(), 0, req.query.Body];

    //run the query
    db.run(query, param, function(err) {
      if (err) {
        //send back TWIML response
        res.type('text/html'); // set content-type
        res.send('<?xml version="1.0" encoding="UTF-8"?><Response><Sms>Sorry, something went wrong. Please try again.</Sms></Response>');
        console.log(chalk.red("Error! " + err));
      } else {
        //send back TWIML response
        res.type('text/html'); // set content-type
        res.send('<?xml version="1.0" encoding="UTF-8"?><Response><Sms>Thank you; your whistle has been recieved.</Sms></Response>');
      }
    });
  }
});
