const { keyboard, Key } = require( "@nut-tree/nut-js" );
const { Up, Down, Left, Right, Z: _jump, X: _light, C: _heavy, B: _dash } = Key;

keyboard.config.autoDelayMs = 33;

// keep track of which keys are currently held, so that if for example Left is
// being held, if someone wants to go Right we need to first release Left
const heldKeys = {};

const oppositeDirection = {
  [ Left ]: Right,
  [ Right ]: Left,
  [ Up ]: Down,
  [ Down ]: Up,
};

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

  for ( const key of [ Up, Down, Left, Right ] ) {
    const opposite = oppositeDirection[ key ];
    if ( !heldKeys[ opposite ] ) {
      continue;
    }

    if ( keys.includes( key ) ) {
      tap( opposite );
      heldKeys[ opposite ] = false;
    }
  }

  if ( _hold ) {
    hold( keys, duration, delay );

    keys.forEach( key => {
      heldKeys[ key ] = true;
    } );
  }
  else {
    tap( keys, delay );
  }
}

module.exports = { tap, hold, press };
