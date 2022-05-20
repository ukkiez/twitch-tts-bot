const delay = ( func, ms ) => {
  setTimeout( () => {
    func();
  }, ms );
}

module.exports = { delay };
