export function handleMIDI(parts, ac, {
  byteIndex,
  channel,
  track,
  delta,
  name,
  noteName,
  noteNumber,
  tick,
  velocity,
}) {
  if(name === 'Note on'){
    parts[track].play(noteName, ac.currentTime, {gain: velocity/10})
  } else if (name === 'Note off') {
    parts[track].stop();
  }
  console.log(event);
}
