const { keyboard, Key } = require( "@nut-tree/nut-js" );

keyboard.config.autoDelayMs = 33;

const { tap, hold, press } = require( "./key-control.js" );

const { Up, Down, Left, Right, Z: _jump, X: _light, C: _heavy, B: _dash } = Key;

const framesToMs = ( frames ) => {
  if ( !frames && isNaN( frames ) ) {
    return;
  }

  return Math.ceil( ( ( 1 / 60 ) * frames ) * 1000 );
};

const inputs = {
  sleep: async ( delay ) => {
    await new Promise( r => setTimeout(() => r(), delay ) );
  },

  // directionals
  left: ( hold ) => {
    press( hold, Left );
  },
  right: ( hold ) => {
    press( hold, Right );
  },
  up: ( hold ) => {
    press( hold, Up );
  },
  down: ( hold ) => {
    press( hold, Down );
  },

  // jumping
  sh: () => {
    tap( _jump );
  },
  fh: ( hold, delay ) => {
    // hold for 7 frames to make sure we hold throughout the jumpsquat animation
    // for a full hop
    press( true, _jump, framesToMs( 7 ), framesToMs( delay ) );
  },

  dash: ( hold, delay ) => {
    tap( _dash, framesToMs( delay ) );
  },

  downDash: () => {
    tap( [ _dash, Down ] );
  },

  // uplight
  ul: () => {
    tap( [ Up, _light ] );
  },
  // light attack
  l: () => {
    tap( _light );
  },
  // downlight
  dl: () => {
    tap( [ Down, _light ] );
  },

  // upheavy
  uh: () => {
    tap( [ Up, _heavy ] );
  },
  // heavy attack
  h: () => {
    tap( _heavy );
  },
  // downheavy
  dh: () => {
    tap( [ Down, _heavy ] );
  },

  // special
  dashJump: () => {
    tap( [ _dash, _jump ] );
  },
};

module.exports = { inputs };
