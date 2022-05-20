const say = require( "say" );
const fs = require( "fs" );

const { client, checkMessage } = require( "./client.js" );

const preferencesByUserId = require( "../preferences.json");
const { voices, rates } = require( "./data.js" );

const { randomElement, fetch } = require( "./util.js" );

const getBop = require( "./special-commands/bop.js" );
const getBopUkkiez = require( "./special-commands/god.js" );

require( "./map-idea-generator/index.js" );
require( "./twitch-plays.js" );

const localesBySpeaker = new Map();
for ( const { speaker, locale } of voices ) {
  localesBySpeaker.set( speaker.toLowerCase(), locale );
}

const speakerList = voices.map( ( { speaker, locale } ) => {
  return `${ speaker } (${locale})`;
} );

// prepending messages with this string allows us to control the volume (thank
// god we finally managed to find someone mentioning this)
const volume = "[[volm 0.4 ]] ";

const getRandomVoice = ( voice ) => {
  const _voice = randomElement( voices, "speaker" );
  if ( _voice === voice ) {
    getRandomVoice( voice );
  }
  else {
    return _voice;
  }
}

let speaking = false;
let queue = [];
const speak = ( message, userId, speaker = "alex", _rate = 1 ) => {
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

  if ( !queue[ 0 ]?.message ) {
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
  if ( !checkMessage( target, context, message, self ) ) {
    return;
  }

  if ( context[ "custom-reward-id" ] === "064667d5-71be-425a-9c9f-3dbea70957d1" ) {
    // time the user out when they redeem the "timeout self" channel point
    // reward
    client.say( target, "/timeout " + context[ "display-name" ] + " 1" );
    client.say( target, "get shit on" );
    speak( "Get shit on.", null, getRandomVoice() );
    return;
  }

  if ( context[ "custom-reward-id" ] === "8c181bea-3544-495d-b916-705854d3f551" ) {
    // time the user out themselves when they redeem the "timeout someone else"
    // channel point reward and add "me" or "myself" as a message
    if ( ( message === "me" ) || ( message === "myself" ) ) {
      client.say( target, "/timeout " + context[ "display-name" ] + " 60" );
      client.say( target, "Could have just redeemed \"timeout self\", but sure, here's 60 seconds ¯\\_(ツ)_/¯" );
      speak( "Could have just redeemed \"timeout self\", but sure, here is 60 seconds.", null, getRandomVoice() );
    }
    return;
  }

  if ( context[ "custom-reward-id" ] === "9afbf27b-5eff-4d86-939a-4cae520d29d8" ) {
    // mod the user out themselves when they redeem the "mod" channel point
    // reward and add "me" or "myself" as a message
    if ( ( message === "me" ) || ( message === "myself" ) ) {
      client.say( target, "/mod " + context[ "display-name" ] );
      client.say( target, "Welcome, you narcissist LilZ" );
      speak( "Welcome, you narcissist.", null, getRandomVoice() );
    }
    return;
  }

  if ( /https?:\/\/[^\s]+/.test( message ) ) {
    message = message.replace( /https?:\/\/[^\s]+/, "weblink" );
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
      const bopText = getBopUkkiez( userName );
      client.say( target, bopText );
      speak( bopText, null, "claire" );
    }
    return;
  }

  if ( message === "!dum" ) {
    say.speak( "[[volm 0.4 ]] dum dum de dum dum de dum de dum de dum", "bad news" );
    return;
  }

  if ( message === "!la" ) {
    say.speak( "[[volm 0.4 ]] la la la la li la la la la la li la la", "good news" );
    return;
  }

  if ( message === "!albert" ) {
    speak( "albert is love, albert is life", null, "whisper" );
    return;
  }

  if ( message === "!hgt" ) {
    client.say( target, `@${ userName } Fetching HGT bop data...` );
    speak( "Fetching HGT bop data", null, "fiona" );

    fetch( "dustkid.com", "/json/profile/328806/hgt/all", ( data ) => {
      const boppableRank = getBop( JSON.parse( data ) );

      if ( !boppableRank.ss && !boppableRank.anypercent ) {
        client.say( target, "Hgt has no top tens left OMEGALUL" );
        speak( "Hgt has no top tens left OMEGALUL, WE DID IT BOYS!!!", null, "good_news" );
        return;
      }

      const { ss, anypercent } = boppableRank;
      if ( ss ) {
        client.say( target, `@${ userName } Easiest Hgt SS bop is ${ ss.levelname } (rank ${ ss.rank+1 }): http://dustkid.com/level/${ ss.level }` );
      }
      else {
        client.say( target, "Hgt doesn't have any SS top 10s left widePoog" );
        speak( "No SS top tens xDDDDDDD", null, "good_news" );
      }

      if ( anypercent ) {
        client.say( target, `@${ userName } Easiest Hgt Any% bop is ${ anypercent.levelname } (rank ${ anypercent.rank+1 }): http://dustkid.com/level/${ anypercent.level }` );
      }
      else {
        client.say( target, "Hgt doesn't have a Any% top 10 left KEKW" );
        speak( "Hgt doesn't have a Any percent top 10 left LMAOOOOOOOO", null, "hysterical" );
      }

      speak( "go get him, boys, you can do it, I believe in you", null, randomElement( voices, "speaker" ) );
    } );

    return;
  }

  if ( message === "!duck" ) {
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
    speak( "Wash your sins away. Courtesy of the Church of The Holy Kau.", null, getRandomVoice() );
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
    speak( "I didn't do it, I didn't cheat, I swear. I deed naht.", null, "Rishi" );
    return;
  }

  if ( ( message === "!repo" ) || ( message === "!bot" ) ) {
    client.say( target, `@${ userName } See the code/download the bot here: https://github.com/ukkiez/twitch-tts-bot` );
  }

  if ( message === "!voices" ) {
    // list all voices and their locales
    client.say( target, speakerList.join( ", " ) );
    return;
  }

  if ( message === "!voice" ) {
    client.say( target, `@${ userName } Use "!voice [speaker|locale] [speed]" to set your voice, see "!voices" for the full list FrankerZ` );
    return;
  }

  if ( ( message === "!help" ) || ( message ==="!tts" ) ) {
    client.say( target, `@${ userName } "!voice [speaker|locale] [speed]" | "!currentvoice" | "!randomvoice" | "!voices" | See the "About" section below strim for more LilZ` );
    return;
  }

  if ( ( message === "!currentvoice" ) || ( message === "!cv" ) ) {
    // have the bot reply with the user's current voice
    const { voice, rate } = preferencesByUserId[ userId ];
    client.say( target, `@${ userName } Current voice: "${ voice } (${ localesBySpeaker.get( voice.toLowerCase() ) })" at ${ rate }x speed.` );
    return;
  }

  if ( ( message === "!voice random" ) || ( message === "!randomvoice" ) || ( message === "!random" ) || ( message === "!rv" ) ) {
    // give the user a random voice
    const voice = getRandomVoice( preferencesByUserId[ userId ]?.voice );
    const rate = randomElement( rates );

    saveUserPreference( userId, { voice, rate } );
    speak( `${ userName } set their voice to ${ voice }`, userId );
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
      // try to match either speaker names or (part of) the given locale; for
      // locales just pick the first voice we can find

      if ( speaker.toLowerCase() === voice ) {
        return true;
      }

      const parts = locale.split( "_" );
      if ( ( parts[ 0 ]?.toLowerCase() === voice ) || ( parts[ 1 ]?.toLowerCase() === voice ) ) {
        return true;
      }
    } );

    if ( !matchedVoice || ( matchedVoice === -1 ) ) {
      client.say( target, `@${ userName } Not sure what voice that is ZrehplaR ?` );
      return;
    }

    saveUserPreference( userId, { voice: matchedVoice.speaker, rate } );
    speak( `${ userName } set their voice to ${ matchedVoice.speaker }`, userId );
    return;
  }

  speak( message, userId );
} );

module.exports = { speak, getRandomVoice };
