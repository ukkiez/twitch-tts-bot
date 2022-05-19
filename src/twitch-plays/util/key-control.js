const { keyboard } = require( "@nut-tree/nut-js" );

keyboard.config.autoDelayMs = 33;

// keep track of which keys are currently held, so that if for example Left is
// being held, if someone wants to go Right we need to first release Left
const heldKeys = [];

const tap = async ( keys, delay ) => {
  if ( !Array.isArray( keys ) ) {
    keys = [ keys ];
  }

  if ( delay ) {
    setTimeout( async () => {
      await Promise.all( keys.map( key => keyboard.pressKey( key ) ) );
      await Promise.all( keys.map( key => keyboard.releaseKey( key ) ) );
    }, delay );
  }
  else {
    await Promise.all( keys.map( key => keyboard.pressKey( key ) ) );
    await Promise.all( keys.map( key => keyboard.releaseKey( key ) ) );
  }

}

const hold = async ( keys, duration, delay ) => {
  if ( delay ) {
    setTimeout( async () => {
      await Promise.all( keys.map( key => keyboard.pressKey( key ) ) );

      if ( duration ) {
        setTimeout( async () => {
          await Promise.all( keys.map( key => keyboard.releaseKey( key ) ) );
        }, duration );
      }
    }, delay );
  }
  else {
    await Promise.all( keys.map( key => keyboard.pressKey( key ) ) );

    if ( duration ) {
      setTimeout( async () => {
        await Promise.all( keys.map( key => keyboard.releaseKey( key ) ) );
      }, duration );
    }
  }
};

const press = ( _hold, keys, duration, delay ) => {
  if ( !Array.isArray( keys ) ) {
    keys = [ keys ];
  }

  if ( _hold ) {
    hold( keys, duration, delay );
  }
  else {
    tap( keys, delay );
  }
}

module.exports = { tap, hold, press };
