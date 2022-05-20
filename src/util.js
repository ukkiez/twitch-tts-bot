const http = require( "http" );

const randomElement = ( array, key ) => {
  if ( key ) {
    return array[ Math.floor( Math.random() * array.length ) ][ key ];
  }

  return array[ Math.floor( Math.random() * array.length ) ];
};

const fetch = ( host, path, callback ) => {
  let data = "";
  const request = http.request( { host, path }, function( res ) {
    res.on( "data", function( chunk ) {
      data += chunk;
    } );
    res.on( "end", function() {
      callback( data );
    } );
  } );
  request.end();

  return data;
}

const getUserLevel = ( context ) => {
  const { broadcaster, mod } = context.badges || {};

  return {
    broadcaster,
    mod,

    notPleb: ( broadcaster || mod ),
  }
}

module.exports = { randomElement, fetch, getUserLevel };
