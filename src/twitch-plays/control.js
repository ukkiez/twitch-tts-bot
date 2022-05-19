const { inputs } = require( "./util/inputs.js" );

const _inputsByCommandKey = {
  n: "up",
  e: "right",
  s: "down",
  w: "left",

  // dash: "dash",
  // downdash: "downDash",

  // jump: "fh",
  // sh: "sh",
  // fh: "fh",

  // dashjump: "dashJump",
}
const inputsByCommandKey = new Map( Object.entries( _inputsByCommandKey ) );

const commandCheckList = [
  // "dash",
  // "downdash",

  // "jump",
  // "sh",
  // "fh",
];
// sort the checklist specifically so that longer strings are checked earlier
// than others, reason is that e.g. we want to check "downdash" before "dash",
// because if we check "dash" earlier, we'll potentially not be parsing
// "downdash" but rather "dash" and "down"
commandCheckList.sort( function( a, b ) {
  return ( b.length - a.length );
} );

const getCommands = ( message ) => {
  message = message.trim();

  const commands = [];

  // first start getting commands from the checklist, and removing those parts
  // from the message (e.g. remove "downdash", then "jump", etc.)
  for ( const check of commandCheckList ) {
    const command = {
      key: undefined,
      hold: false,
    };

    if ( !message.includes( check ) ) {
      continue;
    }

    const match = message.match( check );

    if ( !inputsByCommandKey.has( match[ 0 ] ) ) {
      throw new Error( "Matched command from checklist, but did not find related input." );
    }

    const index = match.index;
    let length = match[ 0 ].length;

    command.key = match[ 0 ];
    commands.push( command );

    if ( message[ index + length ] ) {
      // check if someone accidentally put a symbol (like "-") after one of
      // these commands, and remove it if that's the case
      for ( let i = ( index + length ); i <= message.length - 1; i++ ) {
        if ( /[^\w]/.test( message[ i ] ) ) {
          // just increase the stored length, since we'll be removing up to and
          // including that part of the string below
          length++;
        }
      }
    }

    // remove the matched part from the message
    message = message.substring( 0, index ) + message.substring( index + length );

    if ( !message ) {
      // we've already parsed the complete message
      return commands;
    }
  }

  const data = Array.from( message );
  for ( let i = 0; i <= data.length - 1; i++ ) {
    const command = {
      key: undefined,
      hold: false,
    };

    const char = data[ i ];

    if ( !inputsByCommandKey.has( char ) ) {
      if ( char !== "-" ) {
        // it is either the case that this is a regular message, or is formatted
        // incorrectly, so just return nothing
        return [];
      }

      continue;
    }

    command.key = char;
    // check if the next input is a "-" to indicate the user wants to hold this
    // input
    if ( data[ i + 1 ] === "-" ) {
      command.hold = true;

      // skip the symbol when moving on to the next iteration
      i++;
    }

    commands.push( command );
  }

  return commands;
}

const exec = ( command, hold ) => {
  inputs[ inputsByCommandKey[ command ] ]( hold );
}

const parse = ( message ) => {
  const commands = getCommands( message );

  console.log( { commands } );

  if ( !commands.length ) {
    return;
  }
};

module.exports = { parse };
