# geofence-live-streaming-twitter
Live streaming Twitter tweets inside a user defined geofence area with the help of Google Maps API 'drawing tools'.

## Table of Contents
 - [Installation](#installation)
 - [Configuration](#configuration)
 - [Usage](#usage)
 - [Contributing](#contributing)
 - [References](#references)

## Installation
Just install the Nodejs packages of the "packages.json" file:

     $ npm install

## Configuration
Just copy "config.js.example" to "config.js" and edit with your Google API credentials.

## Usage
Run the server as follows:

     $ npm start

It will be listening on port 4200.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## References

The following is a list of useful references used for the development of the application:
* [Node.js 'Twit' package](https://www.npmjs.com/package/twit)
* [Twitter Streaming API](https://dev.twitter.com/streaming/overview/request-parameters)
