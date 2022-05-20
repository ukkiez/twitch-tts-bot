const { keyboard, Key } = require( "@nut-tree/nut-js" );

keyboard.config.autoDelayMs = 33;

const { tap, hold, press, releaseAll } = require( "./key-control.js" );

const { Up, Down, Left, Right, Z: _jump, X: _light, C: _heavy, B: _dash, R } = Key;

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

  neutral: () => {
    releaseAll( true );
  },

  releaseAll: () => {
    releaseAll();
  },

  restart: () => {
    // restart the map
    tap( [ R, R ], framesToMs( 10 ) );
    releaseAll();
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
  fh: ( hold ) => {
    // hold for 7 frames to make sure we hold throughout the jumpsquat animation
    // for a full hop
    press( true, _jump, framesToMs( 7 ) );
  },
  jump: ( hold ) => {
    if ( !hold ) {
      // hold for at least 7 frames to hold throughout jumpsquat animation for a
      // full hop
      press( true, _jump, framesToMs( 7 ) );
    }
    else {
      press( true, _jump );
    }
  },

  dash: () => {
    tap( _dash );
  },

  downDash: () => {
    tap( [ _dash, Down ] );
  },

  // uplight
  ul: ( hold ) => {
    press( hold, [ Up, _light ] );
  },
  // light attack
  li: ( hold ) => {
    press( hold, _light );
  },
  // downlight
  dl: ( hold ) => {
    press( hold, [ Down, _light ] );
  },

  // upheavy
  uh: ( hold ) => {
    press( hold, [ Up, _heavy ] );
  },
  // heavy attack
  h: ( hold ) => {
    press( hold, _heavy );
  },
  // downheavy
  dh: ( hold ) => {
    press( hold, [ Down, _heavy ] );
  },

  // special
  dashJump: () => {
    tap( [ _dash, _jump ] );
  },
};

module.exports = { inputs };
