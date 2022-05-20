const { client, checkMessage } = require( "./client.js" );

const { parse, addKillSwitch } = require( "./twitchplays-controller/index.js" );

const { speak, getRandomVoice } = require( "./index.js" );
const { getUserLevel } = require( "./util.js" );

let _twitchPlays = false;
let _killSwitch = false;
client.on( "message", ( target, context, message, self ) => {
  if ( !checkMessage( target, context, message, self ) ) {
    return;
  }

  const userName = context[ "display-name" ];

  const { "user-id": userId } = context;
  if ( !userId ) {
    return false;
  }

  const { broadcaster } = getUserLevel( context );
  if ( broadcaster ) {
    if ( message === "!twitchplays" ) {
      _twitchPlays = !_twitchPlays;

      if ( _twitchPlays ) {
        client.say( target, "Twitch Plays mode enabled! FrankerZ" );
        speak( "Twitch Plays mode activated!", null, getRandomVoice() );

        if ( !_killSwitch ) {
          // add the ability to exit the node process by pressing the "0" key,
          // just in case; we don't bother removing the listener after disabling
          // twitch plays mode (for now maybe)
          addKillSwitch( "0" );
        }
      }
      else {
        client.say( target, "Twitch Plays mode disabled. dgMoley" );
        speak( "Twitch Plays mode disabled.", null, getRandomVoice() );
      }
    }
  }

  if ( _twitchPlays ) {
    parse( message );
  }
} );
