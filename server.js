var path = require('path')
var Twit = require('twit')
var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io')(server)
var config = require('./config')

var T = new Twit({
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_secret,
  access_token: config.access_token,
  access_token_secret: config.access_token_secret,
  timeout_ms: 60 * 1000  // optional HTTP request timeout to apply to all requests.
})

app.use(express.static('public'))
app.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, 'index.html'))
})

io.on('connection', function (client) {
  console.log('Client connected...')

  client.on('join', function (data) {
    // console.log(data)
    client.emit('messages', 'Hello from server')
  })

  client.on('bounds', function (b) {
    console.log(b)
    //
    // filter the public stream by the latitude/longitude bounded box of San Francisco
    //
    var stream = T.stream('statuses/filter', { locations: b })
    stream.on('tweet', function (tweet) {
      var obj = {
        'screen_name': tweet.user.screen_name,
        'message': tweet.text}
      io.emit('data', JSON.stringify(obj))
    })
  })
})

server.listen(4200, function () {
  console.log('Server listening on *:4200')
})
