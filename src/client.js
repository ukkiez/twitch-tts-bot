const tmi = require( "tmi.js" );

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

// do some general checks, which should be used for every instance of client.on(
// "message" )
const checkMessage = ( target, context, message, self ) => {
  // ignore messages from the bot itself
  if ( self ) {
    return false;
  }

  const userName = context[ "display-name" ];
  if ( userName.toLowerCase() === "nightbot" ) {
    return false;
  }

  const { "user-id": userId } = context;
  if ( !userId ) {
    return false;
  }

  if ( /^\!sr/i.test( message ) || /^\!songrequest/i.test( message ) ) {
    return false;
  }

  // indicate checks were passed
  return true;
};

module.exports = { client, checkMessage };
