import Entity from './entity.js';
import spikes from '../sprites/spikes.js';
import { drawSprite } from '../lib/util.js';

var Spikes = Entity.extend({

  init: function( opts ) {
    var self = this;
    opts.w = 128;
    opts.h = 55;
    Entity.prototype.init.apply( this, arguments );
    Object.defineProperties( this.hitbox = {}, {
      x: {
        get: function() {
          return self.x + 25;
        }
      },
      w: {
        get: function() {
          return self.w - 35;
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

  render: function( ctx ) {
    if ( this.isOffscreen() ) {
      return;
    }
    drawSprite( ctx, this, spikes );
  }

});

export default Spikes;
