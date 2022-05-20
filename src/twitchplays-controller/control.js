const { inputs } = require( "./util/inputs.js" );

const framesToMs = ( frames ) => {
  if ( !frames && isNaN( frames ) ) {
    return;
  }

  return Math.ceil( ( ( 1 / 60 ) * frames ) * 1000 );
};

const defaultDelay = framesToMs( 15 );

const _inputsByCommandKey = {
  n: "up",
  e: "right",
  s: "down",
  w: "left",

  dash: "dash",
  downdash: "downDash",

  jump: "fh",
  j: "fh",
  sh: "sh",
  fh: "fh",

  dashjump: "dashJump",
  dj: "dashJump",

  light: "l",
  ul: "ul",
  l: "l",
  dl: "dl",

  heavy: "h",
  uh: "uh",
  h: "h",
  dh: "dh",
}

const inputsByCommandKey = new Map( Object.entries( _inputsByCommandKey ) );

const commandKeysByInitial = new Map();
for ( const key of Object.keys( _inputsByCommandKey ) ) {
  const initial = key[ 0 ];
  if ( !commandKeysByInitial.has( initial ) ) {
    commandKeysByInitial.set( initial, [ key ] );
  }
  else {
    commandKeysByInitial.get( initial ).push( key );
  }
}

const parseMessage = ( message ) => {
  message = message.trim();

  const commands = [];

  const data = Array.from( message );
  let possibleKeys;
  let currentString = "";
  for ( let i = 0; i <= data.length - 1; i++ ) {
    const character = data[ i ];

    if ( [ "+", "-" ].includes( character ) ) {
      if ( possibleKeys?.find( key => key === currentString ) ) {
        // even though there are multiple possibilities left, the + or -
        // indicates that we already found the full command
        commands.push( {
          key: currentString,
          hold: false,
          delay: 0,
        } );

        possibleKeys = undefined;
        currentString = "";
      }

      const _lastCommand = commands[ commands.length - 1 ];
      if ( !_lastCommand?.key ) {
        // this message was formatted incorrectly, as no command was found
        // before this symbol
        return [];
      }

      if ( character === "+" ) {
        _lastCommand.delay += defaultDelay;
      }
      else if ( character === "-" ) {
        _lastCommand.hold = true;
      }

      continue;
    }

    checkPossibleKeys: if ( possibleKeys ) {
      currentString += character;
      const filteredPossibleKeys = possibleKeys.filter( key => key.startsWith( currentString ) );

      if ( filteredPossibleKeys.length === 0 ) {
        const _key = possibleKeys.find( key => key === currentString.substring( 0, currentString.length - 1 ) );
        if ( _key ) {
          // the previous iteration already found a command, and we're possibly
          // starting a new one right now
          commands.push( {
            key: _key,
            hold: false,
            delay: 0,
          } );

          possibleKeys = undefined;

          // continue with parsing this character
          break checkPossibleKeys;
        }

        // this message is invalid
        return [];
      }
      else if ( filteredPossibleKeys.length === 1 ) {
        commands.push( {
          key: filteredPossibleKeys[ 0 ],
          hold: false,
          delay: 0,
        } );

        // skip iterations until we get to where the end of this key would be
        i += ( filteredPossibleKeys[ 0 ].length - currentString.length );

        // reset the possible keys, since we've fully parsed this particular
        // command
        possibleKeys = undefined;
        currentString = "";
        continue;
      }
      else if ( data[ i + 1 ] === undefined ) {
        // we already parsed the full message, so check if the current string
        // matches a command key fully, otherwise we know the message is invalid
        if ( !possibleKeys.find( key => key === currentString ) ) {
          return [];
        }

        commands.push( {
          key: currentString,
          hold: false,
          delay: 0,
        } );
        break;
      }

      possibleKeys = filteredPossibleKeys;
      continue;
    }

    if ( commandKeysByInitial.has( character ) ) {
      possibleKeys = commandKeysByInitial.get( character );

      if ( possibleKeys && ( data[ i + 1 ] === undefined ) ) {
        // it's the last iteration, so check if we can find a exact match for a
        // command, otherwise the message is invalid
        const _key = possibleKeys.find( key => key === character );
        if ( _key ) {
          commands.push( {
            key: _key,
            hold: false,
            delay: 0,
          } );
        }
        else {
          return [];
        }

        break;
      }

      if ( possibleKeys.length === 1 ) {
        commands.push( {
          key: possibleKeys[ 0 ],
          hold: false,
          delay: 0,
        } );

        // skip iterations until we get to where the end of this key would be
        i += ( possibleKeys[ 0 ].length - 1 );

        // reset the possible keys, since we've fully parsed this particular
        // command
        possibleKeys = undefined;

        currentString = "";
        continue;
      }

      // start keeping track of the string, and build it as we attempt to figure
      // out which command key this string refers to (if any)
      currentString = character;

      continue;
    }

    // this message is not formatted correctly, or it is not supposed to be a
    // command list at all
    return [];
  }

  return commands;
}

const exec = async ( commands ) => {
  for ( const { key, hold, delay } of commands ) {
    const input = inputsByCommandKey.get( key );
    if ( !inputs[ input ] ) {
      console.error( `Unknown input "${ input } (key: ${ key }".` );
    }

    inputs[ input ]( hold );
    if ( delay ) {
      await inputs.sleep( delay );
    }
  }
}

const parse = ( message ) => {
  console.time( "parseMessage()" );
  const commands = parseMessage( message );
  console.timeEnd( "parseMessage()" );

  console.log( { commands } );

  if ( !commands.length ) {
    return;
  }

  // exec( commands );
};

module.exports = { parse };
