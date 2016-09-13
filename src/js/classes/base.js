import Emitter from './emitter.js';
import { extend as assign } from '../lib/util.js';

function BaseClass() {};

function extend( target ) {
  var superProto = this.prototype || {},
    proto = Object.create( superProto );

  assign( proto, target );

  function Base() {
    Emitter.call( this );
    if ( typeof this.init === 'function' ) {
      this.init.apply( this, arguments );
    }
  }

  Base.extend = extend;
  Base.prototype = proto;
  Base.prototype.constructor = Base;

  return Base;
}

export default extend.call( BaseClass, Emitter.prototype );
