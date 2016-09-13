import Entity from '../classes/entity.js';
import canvases from './canvases.js';
import {
  each, approach, listenTo, drawSprite, filter, sequence, random
} from './util.js';
import text from './text.js';
import loop from './loop.js';
import keys from './keys.js';
import camera from './camera.js';
import sprites from '../sprites/glitch.js';
import world from '../lib/world.js';
import sound from '../lib/sound.js';

var frames = {
  glitch: [ sprites.glitch1, sprites.glitch2 ],
  wizard: [ sprites.wizard1, sprites.wizard2 ]
};

var flash = sequence( 1, 0.8, 0.5, 0.3, 0, 0.3, 0.5, 0.8, 1 );

var Player = Entity.extend({

  init: function() {
    Entity.prototype.init.apply( this, arguments );

    // X-axis direction, 1 = right, -1 = left
    this.direction = { x: 0 };
    // top speed of player movement
    Object.defineProperty( this, 'speed', {
      get: function() {
        return this.mode ? 6 : 5;
      }
    })
    // storage of point in time velocites for the player
    this.velocity = { x: 0, y: 0 };
    // gravity factor
    this.gravity = 12;

    // initial x/y coords
    this.x = 10;
    this.y = 400;

    // set health related stuff
    this.vulnerable = false;
    this.hurt = false;
    this.health = 4;
    this.dead = false;

    // initialize animation frame state
    this.lastAnim = Date.now();
    this.currentFrame = 0;

    // glitch or wizard mode
    this.mode = 0;

    // platforms traveled
    this.distance = 0;

    // setup a getter to grab the right frameset based on current `mode`
    Object.defineProperty( this, 'frames', {
      get: function() {
        return frames[ this.mode === 0 ? 'glitch' : 'wizard' ];
      }
    });

    // add our player entity to the main canvas
    canvases.main.addEntity( this );

    this.bindEvents();
  },

  bindEvents: function() {
    this.on( 'ouch', this.checkMode.bind( this ) );
    this.once( 'move', function() {
      this.vulnerable = true;
      world.start();
    }.bind( this ) );
  },

  checkMode: function() {
    if ( this.mode === 0 ) {
      this.mode = random( 0, 2 );
      this.mode === 1;
    } else {
      this.mode = 0;
    }
    var fn = this.mode ? sound.wizard : sound.hurt;
    fn.play();
  },

  checkKeys: function() {
    if ( this.dead ) {
      return;
    }

    if ( this.falling && this.mode === 0 ) {
      return;
    }

    this.right = keys.RIGHT;
    this.left = keys.LEFT;

    if ( keys.RIGHT || keys.LEFT ) {
      this.emit('move');
    }

    if ( keys.SPACE ) {
      this.startJump();
    }
  },

  checkBounds: function() {
    if ( this.x - camera.x <= 0 ) {
      this.x = camera.x;
    }
    if ( !this.dead && this.y >= camera.y + camera.w ) {
      sound.hurt.play();
      this.die();
    }
  },

  startJump: function() {
    if ( this.jumping || this.falling  ) {
      return;
    }
    this.velocity.y = -10;
    this.gravity = this.mode ? 4 : 8;
    this.currentFrame = 1;
    this.emit('jump');
    sound.jump.play();
  },

  ouch: function() {
    this.setHurt( true );

    this.health--;
    this.velocity.y = -6;
    this.direction.x = -1
    this.velocity.x = 3;

    camera.shake();

    this.emit('ouch');

    if ( this.health === 0 ) {
      this.die();
    }
  },

  setHurt: function( hurt ) {
    this.lastHurt = hurt ? Date.now() : this.lastHurt;
    this.hurt = hurt;
    this.vulnerable = !hurt;
  },

  checkHurt: function() {
    var now;

    if ( !this.hurt ) {
      return;
    }

    if ( Date.now() - this.lastHurt > 2000 ) {
      this.setHurt( false );
    }
  },

  checkRestart: function() {
    if ( this.dead && keys.R )  {
      window.location.href = window.location.href;
    }
  },

  die: function() {
    this.dead = true;
    this.vulnerable = false;
    this.deathEffect = true;
  },

  setDirection: function() {
    if ( this.right ) {
      this.direction.x = 1;
    } else if ( this.left ) {
      this.direction.x = -1;
    }
  },

  update: function( scale ) {
    this.checkKeys();
    this.setDirection();
    this.checkHurt();
    this.checkRestart();

    this.velocity.y = approach( this.gravity, this.velocity.y, 0.4 );
    this.y += this.velocity.y * scale;

    this.velocity.x = approach(
      this.right || this.left ? this.speed : 0, this.velocity.x, 0.5
    );
    this.x += this.velocity.x * scale * this.direction.x;

    this.adjustCamera( scale );
    this.checkCollisions();
    this.checkBounds();

    this.moving     = this.velocity.x > 0 ? true : false;
    this.falling    = this.velocity.y > 0 ? true : false;
    this.jumping    = this.velocity.y < 0 ? true : false;

    this.emit( 'update', this.velocity.x * scale * this.direction.x );
  },

  render: function( ctx ) {
    var now = Date.now();
    var frame = this.currentFrame;

    if ( this.hurt ) {
      ctx.globalAlpha = flash();
    }

    drawSprite( ctx, this, this.frames[ frame ] );

    ctx.globalAlpha = 1;

    this.setFrame( now, frame );
  },

  setFrame: function( now, frame ) {
    if ( this.moving && now - this.lastAnim >= 300 ) {
      this.lastAnim = now;
      this.currentFrame = frame === 1 ? 0 : 1;
    }

    if ( !this.moving && !this.jumping ) {
      this.currentFrame = 0;
    }
  },

  adjustCamera: function( scale ) {
    if ( this.x > camera.x + camera.offset && this.direction.x === 1 ) {
      camera.x += ( this.x - camera.x - camera.offset ) * 0.1 * scale;
    }
    if ( ( this.jumping || this.falling ) && this.y < 350 ) {
      camera.y += ( this.y - camera.y - 350 ) * 0.1 * scale;
    } else {
      camera.y = approach( 0, camera.y, 5 );
    }
  },

  checkCollisions: function() {
    var player = this;

    if ( player.dead ) {
      return;
    }

    // Check for platform collisons
    each( world.getOnscreenFloors(), function( floor ) {
      if ( floor.collidesWith( player ) ) {
        player.velocity.y = 0;
        player.y = floor.hitbox.y - player.h;
        player.distance++;
      }
    });

    // Check for collisions with spikes
    each( world.getOnscreenSpikes(), function( spike ) {
      if ( player.vulnerable && spike.collidesWith( player ) ) {
        player.ouch();
      }
    });

    // Check for collisions with bombs
    each( world.getOnscreenBombs(), function( bomb ) {
      if ( player.vulnerable && bomb.collidesWith( player ) ) {
        player.ouch();
      }
    });

    // Check for collisions with arrows
    each( world.getOnscreenArrows(), function( arrow ) {
      if ( player.vulnerable && arrow.collidesWith( player ) ) {
        player.ouch();
      }
    });
  }

});

export default window.p = new Player({ w: 64, h: 92 });
