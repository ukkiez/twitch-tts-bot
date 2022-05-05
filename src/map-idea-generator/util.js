const rE = ( array ) => {
  return array[ Math.floor( Math.random() * array.length ) ];
};

const titleCase = ( string ) => {
  return string.replace(
    /\w+/g,
    function( part ) {
      console.log( part )
      return part[ 0 ].toUpperCase() + part.substring( 1, part.length ).toLowerCase();
    }
  );
};

const replaceInString = ( replacement, original, string ) => {
  return string.replace( original, replacement );
};

module.exports = {
  rE,
  titleCase,
  replaceInString,
};
