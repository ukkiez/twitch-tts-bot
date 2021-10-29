const http = require("http");

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

module.exports = fetch;
