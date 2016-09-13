'use strict';

const pngparse = require("pngparse");
const path =  __dirname + '/assets/' + process.argv[ 2 ];
const fs = require('fs');
const file = fs.readFileSync( path );

pngparse.parse( file , function( err, response ) {
  if ( err ) {
    throw( err );
  }

  let pixels = response.data;
  fs.writeFileSync( __dirname + '/pixeldata', JSON.stringify( pixels.toJSON().data ) );
});
