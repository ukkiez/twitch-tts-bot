const { client } = require( "../client.js" );

const { GlobalKeyboardListener } = require( "node-global-key-listener" );

const v = new GlobalKeyboardListener();
v.addListener( function( e, down ) {
  if ( down[ "0" ] ) {
    // kill the process
    process.exit( 0 );
  }
} );

const { delay } = require( "./util/index.js" );

const sleep = ms => new Promise( resolve => setTimeout( () => resolve(), ms ) );

const {
  parse,
} = require( "./control.js" );

// called every time a message is sent in the chat
client.on( "message", ( target, context, message, self ) => {
  // ignore messages from the bot itself
  if ( self ) {
    return;
  }

  const userName = context[ "display-name" ];
  if ( userName.toLowerCase() === "nightbot" ) {
    return;
  }

  const { "user-id": userId } = context;
  if ( !userId ) {
    return;
  }

  // const isBroadcaster = context.badges?.broadcaster;

  // if ( isBroadcaster ) {
    parse( message );
  // }
} );
