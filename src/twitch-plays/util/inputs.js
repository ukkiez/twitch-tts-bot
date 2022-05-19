const { keyboard, Key } = require( "@nut-tree/nut-js" );

keyboard.config.autoDelayMs = 33;

const { tap, hold, press } = require( "./key-control.js" );

const { Up, Down, Left, Right, Z: _jump, X: _light, C: _heavy, B: _dash } = Key;

const framesToMs = ( frames ) => {
  return Math.ceil( ( ( 1 / 60 ) * frames ) * 1000 );
};

const inputs = {
  // directionals
  left: ( hold ) => {
    console.log( "left()", { hold } );
    // press( hold, Left );
  },
  right: ( hold ) => {
    console.log( "right()", { hold } );
    // press( hold, Right );
  },
  up: ( hold ) => {
    console.log( "up()", { hold } );
    // press( hold, Up );
  },
  down: ( hold ) => {
    console.log( "down()", { hold } );
    // press( hold, Down );
  },

  // jumping
  sh: () => {
    tap( _jump );
  },
  fh: () => {
    press( true, _jump, framesToMs( 7 ) );
  },

  dash: () => {
    tap( _dash );
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
