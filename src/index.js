const tmi = require("tmi.js");
const say = require( "say" );

const fs = require( "fs" );

const { username, password, channels } = require( "../config.json" );
const preferencesByUserId = require( "../preferences.json");

const { voices, rates } = require( "./data.js" );

const localesBySpeaker = new Map();
for ( const { speaker, locale } of voices ) {
  localesBySpeaker.set( speaker.toLowerCase(), locale );
}

const speakerList = voices.map( ( { speaker, locale } ) => {
  return `${ speaker } (${locale})`;
} );

// define configuration options
const opts = {
  identity: {
    username,
    password,
  },
  channels,
};

// prepending messages with this string allows us to control the volume (thank
// god we finally managed to find someone mentioning this)
const volume = "[[volm 0.8]] ";

const randomElement = ( array, key ) => {
  if ( key ) {
    return array[ Math.floor( Math.random() * array.length ) ][ key ];
  }

  return array[ Math.floor( Math.random() * array.length ) ];
};

// create a client with our options
const client = new tmi.client( opts );

client.connect();
client.on( "connected", ( addr, port ) => {
  console.log( `* Connected to ${addr}:${port}` );
} );

let speaking = false;
let queue = [];
const speak = ( message, userId, speaker ) => {
  let voice = speaker;
  let rate = 1;
  if ( userId ) {
    ( { voice = "alex", rate = 1 } = preferencesByUserId[ userId ] || {} );
  }

  if ( message ) {
    let _voice = voice;
    if ( _voice.includes( "_" ) ) {
      _voice = _voice.replace( "_", " " );
    }

    queue.push( { message, voice: _voice, rate } );
  }

  if ( speaking ) {
    return;
  }

  if ( !speaking ) {
    speaking = true;
    say.speak( ( volume + queue[ 0 ].message ), queue[ 0 ].voice, queue[ 0 ].rate, ( err ) => {
      if ( err ) {
        console.error( err );
      }

      speaking = false;
      queue.shift();

      if ( queue.length ) {
        setTimeout( () => {
          speak();
        }, 500 );
      }
    } );
  }
}

const saveUserPreference = ( userId, preference ) => {
  if ( !preference || ( typeof preference !== "object" ) || Array.isArray( preference ) ) {
    return;
  }

  preferencesByUserId[ userId ] = { ...preference };

  try {
    // store user preferences in a local file, so that if the bot is restarted
    // they can get their last-assigned voices again
    fs.writeFileSync( `preferences.json`, JSON.stringify( preferencesByUserId, null, 2 ) );
  }
  catch ( error ) {
    console.error( error );
  }
}

// called every time a message is sent in the chat
client.on( "message", ( target, context, message, self ) => {
  // ignore messages from the bot itself
  if ( self ) {
    return;
  }

  const { "user-id": userId } = context;
  if ( !userId ) {
    return;
  }

  if ( !preferencesByUserId[ userId ] ) {
    saveUserPreference( userId, { voice: randomElement( voices, "speaker" ), rate: randomElement( rates ) } );
  }

  message = message.trim().toLowerCase();

  if ( message === "!maybetta" ) {
    speak( "5 5 5 5 5", null, "luca" );
    return;
  }

  if ( message === "!voices" ) {
    // list all voices and their locales
    client.say( target, speakerList.join( ", " ) );
    return;
  }

  if ( message === "!voice" ) {
    client.say( target, `@${ context[ "display-name" ] } Use "!voice [speaker|locale] [speed]" to set your voice, see "!voices" for the full list FrankerZ` );
    return;
  }

  if ( ( message === "!help" ) || ( message === "!voice help" ) || ( message ==="!tts" ) ) {
    client.say( target, `@${ context[ "display-name" ] } "!voice [speaker|locale] [speed]" | "!currentvoice" | "!randomvoice" | "!voices" LilZ` );
    return;
  }

  if ( ( message === "!currentvoice" ) || ( message === "!cv" ) ) {
    // have the bot reply with the user's current voice
    const { voice, rate } = preferencesByUserId[ userId ];
    client.say( target, `@${ context[ "display-name" ] } Current voice: "${ voice } (${ localesBySpeaker.get( voice.toLowerCase() ) })" at ${ rate }x speed.` );
    return;
  }

  if ( ( message === "!voice random" ) || ( message === "!randomvoice" ) || ( message === "!random" ) || ( message === "!rv" ) ) {
    // give the user a random voice
    const getRandomVoice = ( voice ) => {
      const _voice = randomElement( voices, "speaker" );
      if ( _voice === voice ) {
        getRandomVoice( voice );
      }
      else {
        return _voice;
      }
    }
    const voice = randomElement( voices, "speaker" );
    const rate = randomElement( rates );

    saveUserPreference( userId, { voice, rate } );
    speak( `${ context[ "display-name" ] } set their voice to ${ voice }`, userId );
    return;
  }
  else if ( message.startsWith( "!voice" ) ) {
    let [ , voice, rate = 1 ] = message.split( /\s/ );
    if ( !voice || isNaN( rate ) ) {
      return;
    }

    if ( rate < 0.1 ) {
      rate = 0.1;
    }
    else if ( rate > 10 ) {
      rate = 10;
    }

    const matchedVoice = voices.find( ( { speaker, locale } ) => {
      if ( ( speaker.toLowerCase() === voice ) || ( locale.toLowerCase() === voice ) ) {
        // try to match both speaker names and their given locales; for locales
        // just pick the first voice we can find
        return true;
      }
    } );

    if ( !matchedVoice || ( matchedVoice === -1 ) ) {
      client.say( target, `@${ context[ "display-name" ] } I don't know what voice that is FrankerZ` );
      return;
    }

    saveUserPreference( userId, { voice: matchedVoice.speaker, rate } );
    speak( `${ context[ "display-name" ] } set their voice to ${ matchedVoice.speaker }`, userId );
    return;
  }

  speak( message, userId );
} );
