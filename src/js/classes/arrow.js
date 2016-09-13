import Entity from './entity.js';
import arrow from '../sprites/arrow.js';
import { drawSprite, random, approach } from '../lib/util.js';
import camera from '../lib/camera.js';

var Arrow = Entity.extend({

  init: function( opts ) {
    var self = this;
    opts.w = 64;
    opts.h = 64;
    Entity.prototype.init.apply( this, arguments );
    Object.defineProperties( this.hitbox = {}, {
      x: {
        get: function() {
          return self.x + 20;
        }
      },
      w: {
        get: function() {
          return self.w - 35;
        }
      },
      y: {
        get: function() {
          return self.y + 25;
        }
      },
      h: {
        value: 15
      }
    });
    this.speed = random( 13, 15 );
    this.velocity = { x: 0 };
  },

  throwAt: function( player ) {
    this.x = camera.x + camera.w + 100;
    this.y = player.y + player.h / 2 - this.h / 2;
    this.thrown = true;
  },

  update: function( scale ) {
    if ( this.isOffscreen() && this.isBehind() ) {
      this.thrown = false;
      return;
    }
    this.velocity.x = approach( this.speed, this.velocity.x, 0.1 );
    this.x -= this.velocity.x * scale;
  },

  render: function( ctx ) {
    if ( this.isOffscreen() ) {
      return;
    }
    drawSprite( ctx, this, arrow );
  }

});

export default Arrow;
