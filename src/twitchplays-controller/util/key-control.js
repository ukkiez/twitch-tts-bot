const { keyboard, Key } = require( "@nut-tree/nut-js" );
const { Up, Down, Left, Right, Z: _jump, X: _light, C: _heavy, B: _dash } = Key;

keyboard.config.autoDelayMs = 33;

// keep track of which keys are currently held, so that if for example Left is
// being held, if someone wants to go Right we need to first release Left
const heldKeys = {};

const allKeys = [ Up, Down, Left, Right, _jump, _light, _heavy, _dash ];

const directions = [ Up, Down, Left, Right ];

const blockingKeys = {
  [ Left ]: Right,
  [ Right ]: Left,
  [ Up ]: Down,
  [ Down ]: Up,
};

const release = async ( key ) => {
  await keyboard.releaseKey( key );

  heldKeys[ key ] = false;
}

const releaseAll = async ( _directionsOnly ) => {
  let keys;
  if ( _directionsOnly ) {
    keys = [ ...directions ];
  }
  else {
    keys = Object.keys( heldKeys ).map( key => parseInt( key, 10 ) );
  }

  // only try to release already held keys
  keys = keys.filter( key => heldKeys[ key ] );

  await Promise.all( keys.map( key => release( key ) ) );

  for ( const key of keys ) {
    heldKeys[ key ] = false;
  }
}

const tap = async ( keys, delay ) => {
  if ( !Array.isArray( keys ) ) {
    keys = [ keys ];
  }

  if ( delay ) {
    setTimeout( async () => {
      await Promise.all( keys.map( key => keyboard.pressKey( key ) ) );
      await Promise.all( keys.map( key => release( key ) ) );
    }, delay );
  }
  else {
    await Promise.all( keys.map( key => keyboard.pressKey( key ) ) );
    await Promise.all( keys.map( key => release( key ) ) );
  }
}

const hold = async ( keys, duration, delay ) => {
  if ( delay ) {
    setTimeout( async () => {
      await Promise.all( keys.map( key => keyboard.pressKey( key ) ) );

      if ( duration ) {
        setTimeout( async () => {
          await Promise.all( keys.map( key => release( key ) ) );
        }, duration );
      }
    }, delay );
  }
  else {
    await Promise.all( keys.map( key => keyboard.pressKey( key ) ) );

    if ( duration ) {
      setTimeout( async () => {
        await Promise.all( keys.map( key => release( key ) ) );
      }, duration );
    }
  }
};

const press = async ( _hold, keys, duration, delay ) => {
  if ( !Array.isArray( keys ) ) {
    keys = [ keys ];
  }

  const remainingKeys = [ ...keys ];
  for ( const key of keys ) {
    const blocker = blockingKeys[ key ];

    if ( heldKeys[ key ] ) {
      // this key is already being held
      if ( _hold ) {
        // continue holding the key, and just remove it from the array of keys
        // that will be to be pressed
        remainingKeys.splice( remainingKeys.indexOf( key ), 1 );
      }
      else {
        // release the key to allow it to be tapped again afterwards
        await release( key );
      }
    }

    if ( heldKeys[ blocker ] ) {
      // some keys block other keys from their function (for example, a left
      // cursor key being held blocks the right cursor key from having any
      // effect), so if we want to tap/hold one of these keys we'll need to
      // release the other
      await release( blocker );
    }
  }

  if ( _hold ) {
    hold( remainingKeys, duration, delay );

    remainingKeys.forEach( key => {
      heldKeys[ key ] = true;
    } );
  }
  else {
    tap( remainingKeys, delay );
  }
}

module.exports = { tap, hold, press, release, releaseAll };
