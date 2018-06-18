import SoundFont from 'soundfont-player';
import MidiPlayer from 'midi-player-js';
import axios from "axios";

function handleMIDIEvent(instrumentsByTrack, ac, event) {
  const {
    byteIndex,
    channel,
    track,
    delta,
    name,
    noteName,
    noteNumber,
    tick,
    velocity,
  } = event;
  const instrument = instrumentsByTrack[track];
  if(name === 'Note on' && instrument){
    instrument.play(noteName, ac.currentTime, {gain: velocity/10})
  } else if (name === 'Note off' && instrument) {
    instrument.stop();
  }
  console.log(event);
}

function loadInstruments(instrumentNames, ac) {
  return Promise.all(instrumentNames.map(name => name ? Soundfont.instrument(ac, name) : null))
  .then(loaded => {
    return loaded.reduce((dictionary, instrument, i)=>{
      const name = instrumentNames[i];
      if(instrument) {
        dictionary[name] = instrument;
      }
      return dictionary
    }, {})
  })
}

export function initializeOrchestra(trackAssignments, midiPath){
  const ac = new AudioContext();
  const instrumentNames = Object.keys(trackAssignments).map(key=>trackAssignments[key]);
  const instruments = loadInstruments(instrumentNames, ac);

  const songBuffer = axios.get(midiPath, {
    responseType: "arraybuffer",
    maxRedirects: 5
  })
  .then(response => {
    const { data: midiArrayBuffer } = response;
    return midiArrayBuffer;
  });

  return Promise.all([instruments, songBuffer]).then((data)=>{
    const loadedInstruments = data[0];
    const finalTrackAssignments = {};
    Object.keys(trackAssignments).forEach(track => {
      const instName = trackAssignments[track];
      finalTrackAssignments[track] = instName ? loadedInstruments[instName] : null;
    })

    function onMIDI(event) {handleMIDIEvent(finalTrackAssignments, ac, event)}
    const Player = new MidiPlayer.Player((event = {}) => {onMIDI(event)});
    Player.loadArrayBuffer(data[1]);

    return Player;
  })
}