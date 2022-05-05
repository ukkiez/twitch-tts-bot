const { client } = require( "../client.js" );

const { templates, dataByCategory } = require( "./data.js" );
const { rE, replaceInString, titleCase } = require( "./util.js" );

const generateMapIdea = ( numberOfIdeas ) => {
  const result = [];
  for ( let i = 0; i <= numberOfIdeas; i++ ) {
    let map = rE( templates );
    let _ideasByCategory = new Map();
    for ( const [ category ] of map.matchAll( /@\w+/g ) ) {
      let idea = rE( dataByCategory[ category ] );

      if ( _ideasByCategory.has( category ) ) {
        const previouslySeenIdeas = _ideasByCategory.get( category );

        if ( ~previouslySeenIdeas.indexOf( idea ) ) {
          while ( ~previouslySeenIdeas.indexOf( idea ) ) {
            // generate new ideas until we get one that we haven't encountered
            // before
            idea = rE( dataByCategory[ category ] );
          }
        }

        previouslySeenIdeas.push( idea );
      }
      else {
        _ideasByCategory.set( category, [] );
      }

      // remember this idea, so that when we encounter the category again we can
      // make sure to not create duplicates
      _ideasByCategory.get( category ).push( idea );

      map = replaceInString( idea, category, map );
    }

    result.push( map );
  }

  return result;
}

// called every time a message is sent in the chat
client.on( "message", ( target, context, message, self ) => {
  // ignore messages from the bot itself
  if ( self ) {
    return;
  }

  const userName = context[ "display-name" ];
  if ( userName.toLowerCase() === "nightbot" ) {
    return;
  }

  const { "user-id": userId } = context;
  if ( !userId ) {
    return;
  }

  if ( message.startsWith( "!map" ) || message.startsWith( "!idea" ) ) {
    client.say( target, `@${ userName } ${ generateMapIdea( 1 )[ 0 ] }` );
  }
} );

module.exports = { generateMapIdea };
