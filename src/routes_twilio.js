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
    request(req.query.MediaUrl0).pipe(fs.createWriteStream('data/' + filename));

    //set up our query
    param = [Date.now(), 2, "/data/" + filename];

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

router.get('/twilio/voice/', function(req, res) {
  res.type('text/html'); // set content-type
  res.send('<?xml version="1.0" encoding="UTF-8"?><Response>' +
          '<Say>Welcome to SeeteeTel, a secure system for whistleblowers and leakers. At the tone, you will have 60 seconds to record. When you\'re finished, press star to complete the recording.</Say>' +
          '<Record action="http://168.235.152.38:8080/api/v1/twilio/recording" method="GET" maxLength="60" finishOnKey="*"/>' + 
          '<Say>I did not receive a recording.</Say>' +
          '</Response>');
});

router.get('/twilio/recording/', function(req, res) {
  var filename = uuid.v4() + ".mp3",
  query = "INSERT INTO whistles VALUES(?, ?, ?)",
  param = [Date.now(), 1, "/data/" + filename];

  //download the recording
  request(req.query.RecordingUrl + ".mp3").pipe(fs.createWriteStream('data/' + filename));

    //run the query
    db.run(query, param, function(err) {
      if (err) {
        console.log(chalk.red("Error! " + err));
      }
    });

    res.type('text/html'); // set content-type
  res.send('<?xml version="1.0" encoding="UTF-8"?><Response>' +
          '<Say>Thank you for your recording. You may now hang up.</Say>' +
          '</Response>');
});
