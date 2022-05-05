const tmi = require("tmi.js");

const { username, password, channels } = require( "../config.json" );

// define configuration options
const opts = {
  identity: {
    username,
    password,
  },
  channels,
};

// create a client with our options
const client = new tmi.client( opts );

client.connect();
client.on( "connected", ( addr, port ) => {
  console.log( `* Connected to ${addr}:${port}` );
} );

module.exports = { client };
