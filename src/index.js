const tmi = require("tmi.js");
const say = require( "say" );

const fs = require( "fs" );

const fetch = require( "./fetch.js" );

const { username, password, channels } = require( "../config.json" );
const preferencesByUserId = require( "../preferences.json");

const { voices, rates } = require( "./data.js" );

const getBop = require( "./bop.js" );

const ukkiez = require( "./god.js" );

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
const speak = ( message, userId, speaker, _rate = 1 ) => {
  let voice = speaker;
  let rate = _rate;
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

  if ( message === "!ukkiez" ) {
    speak( "FrankerZ FrankerZ FrankerZ", null, "albert" );
    return;
  }

  if ( message.startsWith( "!bop" ) ) {
    const [ , person ] = message.split( /\s/ );

    if ( person === "ukkiez" ) {
      const choice = randomElement( ukkiez );
      client.say( target, `@${ context[ "display-name" ] } ${ choice }` );
      speak( choice, null, "claire" );
    }
    return;
  }

  if ( message === "!dum" ) {
    say.speak( "[[volm 0.8]] dum dum de dum dum de dum de dum de dum", "bad news" );
    setTimeout( () => {
      say.speak( "[[volm 0.8]] dum dum de dum dum de dum de dum de dum", "bad news" );
    }, 150 );
    return;
  }

  if ( message === "!la" ) {
    say.speak( "[[volm 0.8]] la la la la li la la la la la li la la", "good news" );
    setTimeout( () => {
      say.speak( "[[volm 0.8]] la la la la li la la la la la li la la", "good news" );
    }, 150 );
    return;
  }

  if ( message === "!albert" ) {
    speak( "albert is love, albert is laif", null, "whisper" );
    return;
  }

  if ( message === "!hgt" ) {
    client.say( target, `@${ context[ "display-name" ] } Fetching HGT bop data...` );
    speak( "Fetching HGT bop data", null, "fiona" );

    fetch( "dustkid.com", "/json/profile/328806/hgt/all", ( data ) => {
      const boppableRank = getBop( JSON.parse( data ) );

      if ( !boppableRank.ss && mostBoppableRanks.ss.length ) {
        boppableRank.ss = mostBoppableRanks.ss.sort( ( a, b ) => b.rank-a.rank )[ 0 ];
      }
      if ( !boppableRank.anypercent && mostBoppableRanks.anypercent.length ) {
        boppableRank.anypercent = mostBoppableRanks.anypercent.sort( ( a, b ) => b.rank-a.rank )[ 0 ];
      }

      if ( !boppableRank.ss && !boppableRank.anypercent ) {
        client.say( target, "Hgt has no top tens left OMEGALUL" );
        speak( "Hgt has no top tens left OMEGALUL, WE DID IT BOYS!!!", null, "good_news" );
        return;
      }

      const { ss, anypercent } = boppableRank;
      if ( ss ) {
        client.say( target, `Easiest SS bop is ${ ss.levelname } (rank ${ ss.rank+1 }): http://dustkid.com/level/${ ss.level }` );
      }
      else {
        client.say( target, "Hgt doesn't have any SS top 10s left widePoog" );
        speak( "No SS top tens xDDDDDDD", null, "good_news" );
      }

      if ( anypercent ) {
        client.say( target, `Easiest Any% bop is ${ anypercent.levelname } (rank ${ anypercent.rank+1 }): http://dustkid.com/level/${ anypercent.level }` );
      }
      else {
        client.say( target, "Hgt doesn't have a Any% top 10 left KEKW" );
        speak( "Hgt doesn't have a Any percent top 10 left LMAOOOOOOOO", null, "hysterical" );
      }

      speak( "go get him, boys, you can do it, I believe in you", null, randomElement( voices, "speaker" ) );
    } );

    return;
  }

  if ( message === "!monkley" ) {
    client.say( target, `@${ context[ "display-name" ] } Fetching Monkley bop data...` );
    speak( "Fetching Monkley bop data", null, "fiona" );

    fetch( "dustkid.com", "/json/profile/288455/Monkley/all", ( data ) => {
      const boppableRank = getBop( JSON.parse( data ) );

      if ( !boppableRank.ss && mostBoppableRanks.ss.length ) {
        boppableRank.ss = mostBoppableRanks.ss.sort( ( a, b ) => b.rank-a.rank )[ 0 ];
      }
      if ( !boppableRank.anypercent && mostBoppableRanks.anypercent.length ) {
        boppableRank.anypercent = mostBoppableRanks.anypercent.sort( ( a, b ) => b.rank-a.rank )[ 0 ];
      }

      if ( !boppableRank.ss && !boppableRank.anypercent ) {
        client.say( target, "Monkley has no top tens left OMEGALUL" );
        speak( "Monkley has no top tens left OMEGALUL, WE DID IT BOYS!!!", null, "good_news" );
        return;
      }

      const { ss, anypercent } = boppableRank;
      if ( ss ) {
        client.say( target, `Easiest SS bop is ${ ss.levelname } (rank ${ ss.rank+1 }): http://dustkid.com/level/${ ss.level }` );
      }
      else {
        client.say( target, "Monkley doesn't have any SS top 10s left widePoog" );
        speak( "No SS top tens xDDDDDDD", null, "good_news" );
      }

      if ( anypercent ) {
        client.say( target, `Easiest Any% bop is ${ anypercent.levelname } (rank ${ anypercent.rank+1 }): http://dustkid.com/level/${ anypercent.level }` );
      }
      else {
        client.say( target, "Monkley doesn't have a Any% top 10 left KEKW" );
        speak( "Monkley doesn't have a Any percent top 10 left LMAOOOOOOOO", null, "hysterical" );
      }

      speak( "go get him, boys, you can do it, I believe in you", null, randomElement( voices, "speaker" ) );
    } );

    return;
  }

  if ( message === "duck" ) {
    speak( "Duck? More like cuck, LMAO. Split keyboard intensifies", null, "Lekha" );
    return;
  }

  if ( ( message === "!lotus" ) || ( message === "!thefallinglotus" ) ) {
    speak( "That jorf was sweet as", null, "lee" );
    client.say( target, "https://www.youtube.com/watch?v=ZdVHZwI8pcA" );
    return;
  }

  if ( ( message === "!holykau" ) || ( message === "!kau" )  ) {
    client.say( target, "Wash your sins away: http://atlas.dustforce.com/9889/bearatyte, courtesy of the Church of The Holy Kau" );
    return;
  }

  if ( message === "!maybetta" ) {
    speak( "5 5 5 5 5", null, "luca" );
    return;
  }

  if ( message === "!skyhawk" ) {
    client.say( target, "https://www.twitch.tv/skyhawk033/clip/BlazingGracefulFloofVoteYea-YWmJfTyA9SjWnV9M" );
    return;
  }

  if ( message === "!marksel" ) {
    speak( "I didn't do it, I didn't cheat, I swear. I deed naht.", null );
    return;
  }

  if ( ( message === "!repo" ) || ( message === "!bot" ) ) {
    client.say( target, `@${ context[ "display-name" ] } See the code/download the bot here: https://github.com/ukkiez/twitch-tts-bot` );
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

  if ( ( message === "!help" ) || ( message ==="!tts" ) ) {
    client.say( target, `@${ context[ "display-name" ] } "!voice [speaker|locale] [speed]" | "!currentvoice" | "!randomvoice" | "!voices" | See the "About" section below strim for more LilZ` );
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
