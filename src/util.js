const randomElement = ( array, key ) => {
  if ( key ) {
    return array[ Math.floor( Math.random() * array.length ) ][ key ];
  }

  return array[ Math.floor( Math.random() * array.length ) ];
};

module.exports = { randomElement };
