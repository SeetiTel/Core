// `POST /twilio/sms/`  | Twilio sms endpoint (undocumented; just point the Twilio client here)

router.post('/twilio/sms/', function(req, res) {
  console.log(req.body);
});
