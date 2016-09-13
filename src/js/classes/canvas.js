import BaseClass from './base.js';
import { $, each, extend } from '../lib/util.js';
import loop from '../lib/loop.js';

var Canvas = BaseClass.extend({

  init: function( cfg ) {
    this.cfg = cfg = extend( {}, cfg );

    if ( cfg.selector ) {
      this.el = $( cfg.selector )[ 0 ];
      this.w = this.el.width;
      this.h = this.el.height;
    } else {
      this.el = document.createElement('canvas');
      this.w = this.el.width = cfg.w;
      this.h = this.el.height = cfg.h;
    }

    this.ctx = this.el.getContext('2d');

    this.w = this.el.width;
    this.h = this.el.height;

    this.entities = [];
    this.player = null;

    this.bindEvents();
  },

  /**
   * Listen to game loop events
   */
  bindEvents: function() {
    loop.on( 'update', this.onUpdate.bind( this ) );
    loop.on( 'render', this.onRender.bind( this ) );
  },

  /**
   * `update` event handler
   * @param  {Number} scale - scale factor based on time delta of last frame
   */
  onUpdate: function( scale ) {
    var self = this;
    self.emit( 'before-update', scale );
    each( this.world.bombs, function( item ) {
      item.update.call( item, scale );
    });
    each( this.entities, function( item ) {
      item.update.call( item, scale );
    });
    self.emit( 'update', scale );
  },

  /**
   * `render` event handler
   * @param  {Number} scale - scale factor based on time delta of last frame
   */
  onRender: function( scale ) {
    var self = this;
    self.emit('before-render');
    self.ctx.clearRect( 0, 0, self.w, self.h );
    each( this.world.floors, function( item ) {
      item.render.call( item, self.ctx );
    });
    each( this.world.spikes, function( item ) {
      item.render.call( item, self.ctx );
    });
    each( this.world.bombs, function( item ) {
      item.render.call( item, self.ctx );
    });
    each( this.entities, function( item ) {
      item.render.call( item, self.ctx );
    });
    self.emit('render');
  },

  addEntity: function( entity ) {
    this.entities.push( entity );
  }

});

export default Canvas;
