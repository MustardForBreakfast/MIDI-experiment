import MidiPlayer from 'midi-player-js';
import SoundFont from 'soundfont-player';
import axios from "axios";
import testSong from './midi/SuperMarioBrothers.midi';
import { handleMIDI } from './playHelpers.js';
import { loadInstruments } from './instruments.js';

/****** 1) Initialize everything ******/
const windowLoaded = new Promise(resolve => {window.onload = () => {resolve()}});
const ac = new AudioContext();
const instruments = loadInstruments([
  'acoustic_grand_piano',
  'banjo',
  'synth_drum',
], ac);
const songBuffer = axios.get(testSong, {
  responseType: "arraybuffer",
  maxRedirects: 5
})
.then(response => {
  const { data: midiArrayBuffer } = response;
  return midiArrayBuffer;
});

/****** 2) Configure the MIDI stuff ******/
Promise.all([instruments, songBuffer, windowLoaded]).then((data)=>{
  // gather the instruments
  const { 
    acoustic_grand_piano,
    banjo,
    synth_drum,
  } = data[0];

  // arrange the orchestra
  const parts = {
    2: acoustic_grand_piano,
    3: acoustic_grand_piano,
    4: banjo,
    5: synth_drum,
  }

  // configure the player
  function onMIDI(event) {handleMIDI(parts, ac, event)}
  const Player = new MidiPlayer.Player((event = {}) => {onMIDI(event)});

  // Initialize the MIDI file
  const buffer = data[1];
  Player.loadArrayBuffer(buffer);

  /****** 3) Configure the DOM ******/
  // Wrangle the DOM nodes
  const pianoButton = document.getElementById('piano');
  const banjoButton = document.getElementById('banjo');
  const playButton = document.getElementById('play');
  const pauseButton = document.getElementById('pause');
  const stopButton = document.getElementById('stop');

  // Assign button behavior
  pianoButton.addEventListener('click', ()=>{ piano.play('C4') });
  banjoButton.addEventListener('click', ()=>{ banjo.play('C4') });
  playButton.addEventListener('click', ()=>{ Player.play() });
  pauseButton.addEventListener('click', ()=>{ Player.pause() });
  stopButton.addEventListener('click', ()=>{ Player.stop() });
})
