const { randomElement } = require( "./util.js" );

const getBopUkkiez = ( userName ) => {
  const choices = [
    `@${ userName } learn sockboost`,
    `@${ userName } try downhill`,
    `@${ userName } { Parsing Error: user \`Ukkiez\` cannot be bopped }`,
    `@${ userName } don't ever fucking try that command ever again`,
    `@${ userName } Fetching Ukkiez bop data... jk OMEGALUL`,
    `@${ userName } ZreknarF ?`,
    `@${ userName } try again in 7 years.`,
    `!vote ban ${ userName }`,
  ];

  return randomElement( choices );
}

module.exports = getBopUkkiez;
