const express = require('express')
const bodyParser = require('body-parser')
const task = require('./task')
const app = express()

app.use(bodyParser.urlencoded({ extended: false }) )
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('i am bot');
})

app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === 'YOUR-VERIFICATION-TOKEN') {
    console.log('validating webhook');
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error('Failed validation. Make sure the validation tokens match.');
    res.sendStatus(403);
  }
});

app.post('/webhook', (req, res) => {
  var data = req.body;
  console.log(data.object);
  if (data.object === 'page') {
    data.entry.forEach( (entry) => {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      entry.messaging.forEach((event) => {
        if (event.message) {
          task.receivedMessage(event);
        }
          else if (event.postback) {
            task.receivedPostback(event);
          }
        else {
          console.log('Webhook receivedd unknown event: ', event);
        }
      });
    });
    res.sendStatus(200);
  }
});

app.listen(3000, () => {
  console.log('app run on port 3000');
})
