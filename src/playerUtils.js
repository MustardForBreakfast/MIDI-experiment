import _throttle from 'lodash.throttle';

function changeTempo(tempo, player) {
	player.pause();
  player.setTempo(tempo);
  player.play();
}

const throttled_changeTempo = _throttle(changeTempo, 250);

export { throttled_changeTempo as changeTempo }
