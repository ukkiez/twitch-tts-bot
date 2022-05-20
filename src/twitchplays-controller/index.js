const { GlobalKeyboardListener } = require( "node-global-key-listener" );

const globalKeyboardListener = new GlobalKeyboardListener();
const addKillSwitch = ( key ) => {
  globalKeyboardListener.addListener( function( e, down ) {
    if ( down[ key ] ) {
      // kill the process
      process.exit( 0 );
    }
  } );
};

const {
  parse,
} = require( "./control.js" );

module.exports = { parse, addKillSwitch };
