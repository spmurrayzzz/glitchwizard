import Entity from './entity.js';
import bomb from '../sprites/bomb.js';
import { drawSprite, approach, random } from '../lib/util.js';
import player from '../lib/player.js';

var Bomb = Entity.extend({

  init: function( opts ) {
    var self = this;
    opts.w = 48;
    opts.h = 48;
    Entity.prototype.init.apply( this, arguments );

    this.direction = { x: 0 };
    this.speed = 5;
    this.velocity = { x: 0, y: 0 };
    this.gravity = 17;

    this.flung = false;
    this.timer = null;

    this.flingInterval = 500;

    Object.defineProperties( this.hitbox = {}, {
      x: {
        get: function() {
          return self.x + 10;
        }
      },
      w: {
        value: self.w - 10
      },
      y: {
        get: function() {
          return self.y + 10;
        }
      },
      h: {
        value: self.h - 10
      }
    });
  },

  checkBounds: function() {
    if ( this.y > 600 ) {
      this.y = 600;
      this.emit('landed');
    }
  },

  fling: function() {
    this.velocity.y = random( -15, -20 );
    this.flung = true;
  },

  startFlingTimer: function() {
    var self = this;
    this.timer = window.setTimeout(function(){
      self.fling();
      self.once( 'landed', function() {
        self.startFlingTimer();
      });
    }, this.flingInterval );
  },

  checkPlayer: function() {
    if ( !this.timer && player.x >= this.x - random( 350, 500 ) ) {
      this.startFlingTimer();
    }
  },

  resetTimer: function() {
    window.clearTimeout( this.timer );
    this.timer = null;
    this.flung = false;
  },

  checkTimer: function() {
    if ( this.timer && this.isOffscreen() ) {
      this.resetTimer();
    }
  },

  update: function( scale ) {
    this.checkTimer();

    if ( this.isOffscreen() ) {
      return;
    }
    this.checkPlayer();

    this.velocity.y = approach( this.gravity, this.velocity.y, 0.4 );
    this.y += this.velocity.y * scale;

    this.checkBounds();
  },

  render: function( ctx ) {
    if ( this.isOffscreen() ) {
      return;
    }
    drawSprite( ctx, this, bomb );
  }

});

export default Bomb;
