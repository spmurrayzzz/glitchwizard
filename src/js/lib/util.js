export function $( selector ) {
  return Array.prototype.slice.call(
    document.querySelectorAll( selector )
  );
}

export function createElem( type ) {
  return document.createElement( type );
}

export function isObject( obj ) {
  return Object.prototype.toString.call( obj ) === '[object Object]';
}

export function isFunction( arg ) {
  return typeof arg === 'function';
}

export function extend( target ) {
  var objs = [];
  var i;
  for ( i = 1; i < arguments.length; i++ ) {
    objs[ i - 1 ] = arguments[ i ];
  }

  function extend( items, target ) {
    var a, b;

    if ( items.length === 0 ) {
      return target;
    }

    if ( items.length === 1 ) {
      each( items[ 0 ], function( value, key ) {
        target[ key ] = value;
      });
      items.pop();
      return target;
    }

    b = items[ items.length - 1 ];
    a = items[ items.length - 2 ];

    each( b, function( value, key ) {
      a[ key ] = value;
    });

    items.pop();
    return extend( items, target );
  }

  return extend( objs, target );
}

export function each( collection, fn, ctx ) {
  if ( Array.isArray( collection ) ) {
    collection.forEach( fn.bind( ctx ? ctx : collection ) );
  } else {
    Object.keys( collection || {} ).forEach(function( key ) {
      fn.call( ctx || collection, collection[ key ], key, collection );
    });
  }
}

export function map( collection, fn, ctx ) {
  var output;
  if ( Array.isArray( collection ) ) {
    output = collection.map( fn.bind( ctx ? ctx : collection ) );
  } else {
    output = [];
    each( collection, function( item, key ) {
      output.push(
        fn.call( ctx || collection, item, key, collection )
      );
    });
  }
  return output;
}

export function random( min, max ) {
  return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
}

export function throttle( fn, rate, ctx ) {
  var canFire = true;
  return function() {
    if ( !canFire ) {
      return ;
    }
    window.setTimeout(function() {
      canFire = true;
    }, rate )
    canFire = false;
    return fn.apply( ctx, arguments );
  }
}

export function debounce( fn, wait, ctx ) {
  var timer = null;
  return function() {
    var args = [];
    var len = arguments.length;
    var i;

    if ( timer ) {
      window.clearTimeout( timer );
    }

    for ( i = 0; i < len; i++) {
      args[ i ] = arguments[ i ];
    }

    timer = setTimeout(function() {
      fn.apply( ctx, args );
    }, wait || 0 );
  }
}

export function memoize( fn, keyGen, ctx ) {
  var cache = {};
  ctx = typeof keyGen === 'function' ? ctx : keyGen;

  return function( argKey ) {
    if ( keyGen ) {
      argKey = keyGen.apply( null, arguments );
    }
    return cache[ argKey ] || ( cache[ argKey ] = fn.apply( ctx, arguments ) );
  };
}

export function approach( target, current, accel ) {
  var diff = target - current;

  if ( diff > accel ) {
    return current + accel;
  } else if ( diff < -accel ) {
    return current - accel;
  } else {
    return target;
  }
}

export function listenTo( event, fn ) {
  return window.addEventListener( event, fn );
}

export function drawSprite( ctx, entity, sprite ) {
  ctx.imageSmoothingEnabled = false;
  ctx.mozImageSmoothingEnabled = false;
  ctx.drawImage( sprite, entity.x, entity.y, entity.w, entity.h );
}

export function sequence() {
  var len = arguments.length;
  var args = [];
  var index = 0;
  var i;

  for ( i = 0; i < len; i++) {
    args[ i ] = arguments[ i ];
  }

  return function() {
    index = index >= len ? 0 : index;
    return args[ index++ ];
  };
}

export function shuffle( arr ) {
  var len = arr.length;
  var i;
  var temp;

  while ( len ) {
    i = Math.floor( Math.random() * len-- );

    temp        = arr[ len ];
    arr[ len ]  = arr[ i ];
    arr[ i ]    = temp;
  }

  return arr;
}
