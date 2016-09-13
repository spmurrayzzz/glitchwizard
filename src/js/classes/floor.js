import Entity from './entity.js';
import sprites from '../sprites/floor.js';
import { drawSprite, each, random } from '../lib/util.js';

var Floor = Entity.extend({

  init: function( opts ) {
    var self = this;

    if ( opts.size === 0 ) {
      this.small = true;
      this.size = 0;
    } else {
      this.size = opts.size || 3;
    }

    Entity.prototype.init.apply( this, arguments );

    this.setDimensions();

    Object.defineProperties( this.hitbox = {}, {
      x: {
        get: function() {
          return self.x + 35;
        }
      },
      w: {
        get: function() {
          return self.w - 55;
        }
      },
      y: {
        get: function() {
          return self.y + 20;
        }
      },
      h: {
        value: 1
      }
    });
  },

  setDimensions: function() {
    this.w = 128 * ( this.size + 2 );
    this.h = 128;
  },

  hasSpikes: function() {
    return !!this.spikes;
  },

  buildSprite: function() {
    var ctx, sprite;
    var i = 1;
    var size = this.size;
    var w = 32;
    var h = 32;

    sprite = document.createElement('canvas');
    ctx = sprite.getContext('2d');

    sprite.width = ( this.size + 2 ) * w;
    sprite.height = h;

    drawSprite( ctx, { x: 0, y: 0, w: w, h: h }, sprites.left );
    for ( i; i <= size; i++ ) {
      if ( !this.small ) {
        drawSprite(
          ctx,
          { x: w * i, y: 0, w: w, h: h },
          sprites.middle
        );
      }
    }
    drawSprite( ctx, { x: w * i, y: 0, w: w, h: h }, sprites.right );
    return sprite;
  },

  render: function( ctx ) {
    if ( this.isOffscreen() ) {
      return;
    }

    drawSprite( ctx, this, this.sprite );
  }

});

export default Floor;
