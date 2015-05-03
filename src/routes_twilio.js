// `GET /twilio/sms/`  | Twilio sms endpoint (undocumented; just point the Twilio client here)

router.get('/twilio/sms/', function(req, res) {
  var message,
  query = "INSERT INTO whistles VALUES(?, ?, ?)",
  param;
  
  if(req.query.NumMedia > 0){
    //this message has media; disregard the text
  }
  else{
    //this query is just a text
  var param = [Date.now(), 0, req.query.Body];
    
  //run the query
  db.run(query, param, function(err) {
    if (err) {
      res.status(500).json({
        error: err
      });
    } else {
      //send back TWIML response
      res.type('text/html'); // set content-type
      res.send('<?xml version="1.0" encoding="UTF-8"?><Response><Sms>Thank you; your whistle has been recieved.</Sms></Response>');
    }
  });
    
    
    
    
    
    
    
    
    
    
    
  }
});
