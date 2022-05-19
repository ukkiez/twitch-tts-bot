const { inputs } = require( "./util/inputs.js" );

const framesToMs = ( frames ) => {
  if ( !frames && isNaN( frames ) ) {
    return;
  }

  return Math.ceil( ( ( 1 / 60 ) * frames ) * 1000 );
};

const _inputsByCommandKey = {
  n: "up",
  e: "right",
  s: "down",
  w: "left",

  dash: "dash",
  downdash: "downDash",

  jump: "fh",
  sh: "sh",
  fh: "fh",

  dashjump: "dashJump",
}
const inputsByCommandKey = new Map( Object.entries( _inputsByCommandKey ) );

const commandCheckList = [
  "dash",
  "downdash",

  "jump",
  "sh",
  "fh",
];
// sort the checklist specifically so that longer strings are checked earlier
// than others, reason is that e.g. we want to check "downdash" before "dash",
// because if we check "dash" earlier, we'll potentially not be parsing
// "downdash" but rather "dash" and "down"
commandCheckList.sort( function( a, b ) {
  return ( b.length - a.length );
} );

const parseMessage = ( message, _commands ) => {
  const commands = _commands || [];

  // first start getting commands from the checklist, and removing those parts
  // from the message (e.g. remove "downdash", then "jump", etc.)
  for ( const check of commandCheckList ) {
    const command = {
      key: undefined,
      hold: false,
      delay: undefined,
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
        if ( message[ i ] === "+" ) {
          command.delay = framesToMs( 15 );
          length++;
          continue;
        }

        if ( /[^\w]/.test( message[ i ] ) ) {
          // just increase the stored length, since we'll be removing up to and
          // including that part of the string below
          length++;
        }
        else {
          break;
        }
      }
    }

    // remove the matched part from the message
    message = message.substring( 0, index ) + message.substring( index + length );

    if ( !message ) {
      // we've already parsed the complete message
      return { message, commands };
    }
    else {
      return parseMessage( message, commands );
    }
  }

  return { message, commands };
}

const getCommands = ( message ) => {
  message = message.trim();

  let commands;
  ( { message, commands } = parseMessage( message ) );

  const data = Array.from( message );
  for ( let i = 0; i <= data.length - 1; i++ ) {
    const command = {
      key: undefined,
      hold: false,
      delay: undefined,
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

const exec = async ( commands ) => {
  // const held = commands.filter( ( { hold } ) => hold );
  // const tapped = commands.filter( ( { hold } ) => !hold );

  for ( const { key, hold, delay } of commands ) {
    if ( !inputs[ inputsByCommandKey.get( key ) ] ) {
      throw new Error( `Unknown command "${ inputsByCommandKey.get( key ) }".` );
    }

    inputs[ inputsByCommandKey.get( key ) ]( hold );
    await inputs.sleep( delay );
  }
}

const parse = ( message ) => {
  const commands = getCommands( message );

  console.log( { commands } );

  if ( !commands.length ) {
    return;
  }

  exec( commands );
};

module.exports = { parse };
