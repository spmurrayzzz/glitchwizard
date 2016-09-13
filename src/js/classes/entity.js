import BaseClass from './base.js';
import { $, each, isFunction } from '../lib/util.js';
import { extend } from '../lib/util.js';
import camera from '../lib/camera.js';

var Entity = BaseClass.extend({

  init: function( cfg ) {
    this.cfg = extend( { x: 0, y: 0 }, cfg );

    this.w = this.cfg.w;
    this.h = this.cfg.h;

    this.x = this.cfg.x;
    this.y = this.cfg.y;

    this.offscreen = document.createElement('canvas');
    this.offscreen.width = this.w;
    this.offscreen.height = this.h;
    this.offscreenCtx = this.offscreen.getContext('2d');

    if ( isFunction( this.buildSprite ) ) {
      this.sprite = this.buildSprite();
    }
  },

  collidesWith: function( entity ) {
    var a = this.hitbox ? this.hitbox : this;
    var b = entity.hitbox ? entity.hitbox : entity;
    if (
      a.x < b.x + b.w &&
      b.x < a.x + a.w &&
      a.y < b.y + b.h &&
      b.y < a.y + a.h
    ) {
      return true;
    }
    return false;
  },

  isOffscreen: function() {
    var a = this;
    var b = camera;
    if (
      a.x < b.x + b.w &&
      b.x < a.x + a.w
    ) {
      return false;
    }
    return true;
  },

  isOnscreen: function() {
    return !this.isOffscreen();
  },

  isBehind: function() {
    var a = this;
    var b = camera;
    if ( a.x < b.x ) {
      return true;
    }
    return false;
  },

  update: function() {},

  render: function() {}

});

export default Entity;
