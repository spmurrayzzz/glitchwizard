/**
 * Pixel font rendering module
 *
 * Usage:
 *
 * text.draw( <string>, <canvas context>, <x>, <y>, <size>, <color> );
 */

import { each, memoize, map } from './util.js';

/**
 * Map of all the letter matrices
 * Originally sourced from: https://github.com/jackrugile/radius-raid-js13k/blob/master/js/definitions.js#L536
 * 0/falsey - indicates a non-draw event
 * 1        - indicates a draw event
 * @type {Object}
 */
var letters = {
  '1': [
     [  , ,  1,  , 0 ],
     [  , 1, 1,  , 0 ],
     [  ,  , 1,  , 0 ],
     [  ,  , 1,  , 0 ],
     [ 1, 1, 1, 1, 1 ]
     ],
  '2': [
     [ 1, 1, 1, 1, 0 ],
     [  ,  ,  ,  , 1 ],
     [  , 1, 1, 1, 0 ],
     [ 1,  ,  ,  , 0 ],
     [ 1, 1, 1, 1, 1 ]
     ],
  '3': [
     [ 1, 1, 1, 1, 0 ],
     [  ,  ,  ,  , 1 ],
     [  , 1, 1, 1, 1 ],
     [  ,  ,  ,  , 1 ],
     [ 1, 1, 1, 1, 0 ]
     ],
  '4': [
     [ 1,  ,  , 1, 0 ],
     [ 1,  ,  , 1, 0 ],
     [ 1, 1, 1, 1, 1 ],
     [  ,  ,  , 1, 0 ],
     [  ,  ,  , 1, 0 ]
     ],
  '5': [
     [ 1, 1, 1, 1, 1 ],
     [ 1,  ,  ,  , 0 ],
     [ 1, 1, 1, 1, 0 ],
     [  ,  ,  ,  , 1 ],
     [ 1, 1, 1, 1, 0 ]
     ],
  '6': [
     [  , 1, 1, 1, 0 ],
     [ 1,  ,  ,  , 0 ],
     [ 1, 1, 1, 1, 0 ],
     [ 1,  ,  ,  , 1 ],
     [  , 1, 1, 1, 0 ]
     ],
  '7': [
     [ 1, 1, 1, 1, 1 ],
     [  ,  ,  ,  , 1 ],
     [  ,  ,  , 1, 0 ],
     [  ,  , 1,  , 0 ],
     [  ,  , 1,  , 0 ]
     ],
  '8': [
     [  , 1, 1, 1, 0 ],
     [ 1,  ,  ,  , 1 ],
     [  , 1, 1, 1, 0 ],
     [ 1,  ,  ,  , 1 ],
     [  , 1, 1, 1, 0 ]
     ],
  '9': [
     [  , 1, 1, 1, 0 ],
     [ 1,  ,  ,  , 1 ],
     [  , 1, 1, 1, 1 ],
     [  ,  ,  ,  , 1 ],
     [  , 1, 1, 1, 0 ]
     ],
  '0': [
     [  , 1, 1, 1, 0 ],
     [ 1,  ,  ,  , 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1,  ,  ,  , 1 ],
     [  , 1, 1, 1, 0 ]
     ],
  'A': [
     [ 1, 1, 1, 1, 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1, 1, 1, 1, 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1,  ,  ,  , 1 ]
     ],
  'B': [
     [ 1, 1, 1, 1, 0 ],
     [ 1,  ,  , 1, 0 ],
     [ 1, 1, 1, 1, 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1, 1, 1, 1, 1 ]
     ],
  'C': [
     [ 1, 1, 1, 1, 1 ],
     [ 1,  ,  ,  , 0 ],
     [ 1,  ,  ,  , 0 ],
     [ 1,  ,  ,  , 0 ],
     [ 1, 1, 1, 1, 1 ]
     ],
  'D': [
     [ 1, 1, 1,  , 0 ],
     [ 1,  ,  , 1, 0 ],
     [ 1,  ,  ,  , 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1, 1, 1, 1, 1 ]
     ],
  'E': [
     [ 1, 1, 1, 1, 1 ],
     [ 1,  ,  ,  , 0 ],
     [ 1, 1, 1,  , 0 ],
     [ 1,  ,  ,  , 0 ],
     [ 1, 1, 1, 1, 1 ]
     ],
  'F': [
     [ 1, 1, 1, 1, 1 ],
     [ 1,  ,  ,  , 0 ],
     [ 1, 1, 1,  , 0 ],
     [ 1,  ,  ,  , 0 ],
     [ 1,  ,  ,  , 0 ]
     ],
  'G': [
     [ 1, 1, 1, 1, 1 ],
     [ 1,  ,  ,  , 0 ],
     [ 1,  , 1, 1, 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1, 1, 1, 1, 1 ]
     ],
  'H': [
     [ 1,  ,  ,  , 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1, 1, 1, 1, 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1,  ,  ,  , 1 ]
     ],
  'I': [
     [ 1, 1, 1, 1, 1 ],
     [  ,  , 1,  , 0 ],
     [  ,  , 1,  , 0 ],
     [  ,  , 1,  , 0 ],
     [ 1, 1, 1, 1, 1 ]
     ],
  'J': [
     [  ,  ,  ,  , 1 ],
     [  ,  ,  ,  , 1 ],
     [  ,  ,  ,  , 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1, 1, 1, 1, 1 ]
     ],
  'K': [
     [ 1,  ,  , 1, 0 ],
     [ 1,  , 1,  , 0 ],
     [ 1, 1, 1,  , 0 ],
     [ 1,  ,  , 1, 0 ],
     [ 1,  ,  ,  , 1 ]
     ],
  'L': [
     [ 1,  ,  ,  , 0 ],
     [ 1,  ,  ,  , 0 ],
     [ 1,  ,  ,  , 0 ],
     [ 1,  ,  ,  , 0 ],
     [ 1, 1, 1, 1, 1 ]
     ],
  'M': [
     [ 1,  ,  ,  , 1 ],
     [ 1, 1,  , 1, 1 ],
     [ 1,  , 1,  , 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1,  ,  ,  , 1 ]
     ],
  'N': [
     [ 1,  ,  ,  , 1 ],
     [ 1, 1,  ,  , 1 ],
     [ 1,  , 1,  , 1 ],
     [ 1,  ,  , 1, 1 ],
     [ 1,  ,  ,  , 1 ]
     ],
  'O': [
     [ 1, 1, 1, 1, 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1, 1, 1, 1, 1 ]
     ],
  'P': [
     [ 1, 1, 1, 1, 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1, 1, 1, 1, 1 ],
     [ 1,  ,  ,  , 0 ],
     [ 1,  ,  ,  , 0 ]
     ],
  'Q': [
     [ 1, 1, 1, 1, 0 ],
     [ 1,  ,  , 1, 0 ],
     [ 1,  ,  , 1, 0 ],
     [ 1,  ,  , 1, 0 ],
     [ 1, 1, 1, 1, 1 ]
     ],
  'R': [
     [ 1, 1, 1, 1, 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1, 1, 1, 1, 1 ],
     [ 1,  ,  , 1, 0 ],
     [ 1,  ,  ,  , 1 ]
     ],
  'S': [
     [ 1, 1, 1, 1, 1 ],
     [ 1,  ,  ,  , 0 ],
     [ 1, 1, 1, 1, 1 ],
     [  ,  ,  ,  , 1 ],
     [ 1, 1, 1, 1, 1 ]
     ],
  'T': [
     [ 1, 1, 1, 1, 1 ],
     [  ,  , 1,  , 0 ],
     [  ,  , 1,  , 0 ],
     [  ,  , 1,  , 0 ],
     [  ,  , 1,  , 0 ]
     ],
  'U': [
     [ 1,  ,  ,  , 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1, 1, 1, 1, 1 ]
     ],
  'V': [
     [ 1,  ,  ,  , 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1,  ,  ,  , 1 ],
     [  , 1,  , 1, 0 ],
     [  ,  , 1,  , 0 ]
     ],
  'W': [
     [ 1,  ,  ,  , 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1,  , 1,  , 1 ],
     [ 1, 1,  , 1, 1 ],
     [ 1,  ,  ,  , 1 ]
     ],
  'X': [
     [ 1,  ,  ,  , 1 ],
     [  , 1,  , 1, 0 ],
     [  ,  , 1,  , 0 ],
     [  , 1,  , 1, 0 ],
     [ 1,  ,  ,  , 1 ]
     ],
  'Y': [
     [ 1,  ,  ,  , 1 ],
     [ 1,  ,  ,  , 1 ],
     [ 1, 1, 1, 1, 1 ],
     [  ,  , 1,  , 0 ],
     [  ,  , 1,  , 0 ]
     ],
  'Z': [
     [ 1, 1, 1, 1, 1 ],
     [  ,  ,  , 1, 0 ],
     [  ,  , 1,  , 0 ],
     [  , 1,  ,  , 0 ],
     [ 1, 1, 1, 1, 1 ]
     ],
  ' ': [
     [  ,  ,  ,  , 0 ],
     [  ,  ,  ,  , 0 ],
     [  ,  ,  ,  , 0 ],
     [  ,  ,  ,  , 0 ],
     [  ,  ,  ,  , 0 ]
     ],
  ',': [
     [  ,  ,  ,  , 0 ],
     [  ,  ,  ,  , 0 ],
     [  ,  ,  ,  , 0 ],
     [  ,  , 1,  , 0 ],
     [  ,  , 1,  , 0 ]
     ],
  '+': [
     [  ,  ,  ,  , 0 ],
     [  ,  , 1,  , 0 ],
     [  , 1, 1, 1, 0 ],
     [  ,  , 1,  , 0 ],
     [  ,  ,  ,  , 0 ]
     ],
  '/': [
     [  ,  ,  ,  , 1 ],
     [  ,  ,  , 1, 0 ],
     [  ,  , 1,  , 0 ],
     [  , 1,  ,  , 0 ],
     [ 1,  ,  ,  , 0 ]
     ],
  ':': [
     [  ,  ,  ,  , 0 ],
     [  ,  , 1,  , 0 ],
     [  ,  ,  ,  , 0 ],
     [  ,  , 1,  , 0 ],
     [  ,  ,  ,  , 0 ]
     ],
  '@': [
     [  1, 1, 1, 1, 1 ],
     [   ,  ,  ,  , 1 ],
     [  1, 1, 1,  , 1 ],
     [  1,  , 1,  , 1 ],
     [  1, 1, 1, 1, 1 ]
   ],
  '.': [
     [   ,  ,  ,  ,   ],
     [   ,  ,  ,  ,   ],
     [   ,  ,  ,  ,   ],
     [   ,  ,  ,  ,   ],
     [  1,  ,  ,  ,   ]
   ],
  '=': [
     [   ,  ,  ,  ,   ],
     [  1, 1, 1, 1, 1 ],
     [   ,  ,  ,  ,   ],
     [  1, 1, 1, 1, 1 ],
     [   ,  ,  ,  ,   ],
     ]
};

/**
 * Convert string to an array of uppercase characters
 * @param  {String} str   - string to convert
 * @return {Array}
 */
var parseString = memoize(function( str ) {
  return Array.prototype.slice.call( str )
    .map(function( char ) { return char.toUpperCase() });
});

/**
 * Returns an object containing letter draw matrix and its width
 * @param  {String} char    - character to retrieve
 * @return {Object}
 */
var getLetter = memoize(function( char ) {
  return {
    map: letters[ char ],
    width: getLetterWidth( char ),
    char: char
  };
});

/**
 * Returns the draw width of a given character
 * @param  {String} char    - character to calculate width
 * @return {Number}
 */
var getLetterWidth = memoize(function( char ) {
  return letters[ char ].reduce(function( prev, curr ) {
    return prev < curr.length ? curr.length : prev;
  }, 0 );
});

/**
 * Convenience function for parsing a string and returning associated letter
 * draw matrices and widths
 *
 * @param  {String} str     - string to parse
 * @return {Array}          - array of letter data
 */
var getLetterData = memoize(function( str ) {
  return parseString( str ).map( getLetter );
});

/**
 * Draw an individual letter matrix into a given Canvas context
 * @param  {CanvasRenderingContext2D} ctx
 * @param  {Object} letter - object containing draw matrix and width
 * @param  {Number} startX - x position to start drawing
 * @param  {Number} startY - y position to start drawing
 * @param  {Number} size   - font size
 */
var drawLetter = memoize(function( ctx, letter, startX, startY, size ) {
  each( letter, function( row, rowIndex ) {
    var y = startY + rowIndex * size;
    each( row, function( col, colIndex ) {
      var x;

      if ( col === 0 ) {
        return;
      }

      x = startX + colIndex * size;
      ctx.fillRect( x, y, size, size );
    });
  });
}, function( ctx, letter ) {
  return letter.char;
});

/**
 * Offscreen renderer cache
 * @type {Object}
 */
var renderers = {};

/**
 * Convenience function for generate renderer cache key
 * @param  {String} str     - text to render
 * @param  {Number} size    - font size
 * @param  {String} color   - text color
 * @return {String}
 */
function keyGen( str, size, color) {
  return str + size + color;
}

/**
 * Create offscreen rendering interface
 * @param  {Number} width
 * @param  {Number} height
 * @param  {String} color
 * @return {Object}
 */
function createRenderer( width, height, color ) {
  var renderer = {
    canvas: document.createElement('canvas')
  };
  renderer.ctx = renderer.canvas.getContext('2d');
  renderer.canvas.width = width;
  renderer.canvas.height = height;
  renderer.ctx.fillStyle = color;
  return renderer;
}

/**
 * Returns an array of cumulative offsets for rendering consecutive letters
 * @param  {Array} letters
 * @param  {Number} size
 * @return {Array}
 */
function getOffsets( letters, size ) {
  var offset = 0;
  return map( letters, function( letter, index, arr ) {
    var last = arr[ index - 1 ];
    return offset += ( last ? last.width : 0 ) * size +
      ( index !== 0 ? size : 0 );
  }, 0 );
}

/**
 * Populate the renderer cache for a given font drawing
 * @param  {String} str   - string to draw
 * @param  {Number} size  - font size
 * @param  {String} color - color of font
 * @return {Object}       - renderer interface
 */
function primeCache( str, size, color ) {
  var letters;
  var key;
  var height;
  var width;
  var offsets;
  var renderer;

  str = str.toUpperCase();
  letters = getLetterData( str );
  height = letters[ 0 ].map.length * size;
  key = keyGen( str, size, color );

  // Build an array of letter X offsets
  offsets = getOffsets( letters, size );

  // Calculate total width
  width = offsets[ offsets.length - 1 ] +
    getLetterWidth( str[ str.length - 1 ] ) * size;

  // Create offscreen renderer and cache it
  renderers[ key ] = renderer = createRenderer( width, height, color );

  // Draw letters to offscreen renderer
  each( letters, function( letter, index, arr ) {
    drawLetter(
      renderer.ctx, letter.map, offsets[ index ], 0, size
    );
  });

  return renderer;
}

export default {

  /**
   * Draw a string of characters into a given Canvas context
   * @param  {CanvasRenderingContext2D} ctx
   * @param  {Object} str     - string to draw
   * @param  {Number} startX  - x position to start drawing
   * @param  {Number} startY  - y position to start drawing
   * @param  {Number} size    - font size
   */
  draw: function( ctx, str, startX, startY, size, color, opts ) {
    var key = keyGen( str, size, color );
    var renderer;

    if ( !( renderer = renderers[ key ] ) ) {
      renderer = primeCache( str, size, color );
    }

    // Draw rendered text to canvas
    ctx.imageSmoothingEnabled = false;
    each( opts, function( val, key ) {
      ctx[ key ] = val;
    });
    ctx.drawImage( renderer.canvas, startX, startY );
    ctx.shadowBlur = 0;
  },

  prime: function( str, size, color ) {
    primeCache.apply( null, arguments );
  }

}
