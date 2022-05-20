const { GlobalKeyboardListener } = require( "node-global-key-listener" );

const globalKeyboardListener = new GlobalKeyboardListener();
let listener;
const killSwitch = ( key, removeListener ) => {
  if ( removeListener ) {
    globalKeyboardListener.removeListener( listener );
    return;
  }

  listener = function( e, down ) {
    if ( down[ key ] ) {
      // kill the process
      process.exit( 0 );
    }
  };

  globalKeyboardListener.addListener( listener );
};

const {
  parse,
  restart,
} = require( "./control.js" );

module.exports = { parse, restart, killSwitch };
