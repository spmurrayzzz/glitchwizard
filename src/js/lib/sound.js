import jsfxr from '../vendor/jsfxr.js';

var AC = window.AudioContext || window.webkitAudioContext,
  audioEnabled = true,
  ctx = new AC();

function createSoundEffect( sound ) {
  var buffer = jsfxr( sound, ctx );
  return {
    play: function() {
      if ( !audioEnabled ) {
        return false;
      }
      var src = ctx.createBufferSource();
      src.buffer = buffer;
      src.connect( ctx.destination );
      src.start( 0 );
    }
  };
}

var sounds = {
  jump: createSoundEffect( [0,,0.2964,,0.18,0.3314,,0.1583,,,,,0.09,0.1348,-0.6,,,,1,-0.16,0.12,0.27,-0.16,0.35 ] ),
  hurt: createSoundEffect( [ 3,,0.0322,,0.48,0.7076,,-0.3268,,,,,,,,,,,1,,,,,0.35 ] ),
  wizard: createSoundEffect( [ 0,,0.2557,,0.59,0.3608,,0.2042,,,,,,0.2346,,0.4444,,,1,,,,,0.35 ] )
};

export default sounds;
