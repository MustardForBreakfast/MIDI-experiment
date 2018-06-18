import MidiPlayer from 'midi-player-js';
import SoundFont from 'soundfont-player';
import axios from "axios";
import testSong from './midi/SuperMarioBrothers.midi';

/****** 1) Initialize everything ******/

const ac = new AudioContext();

const songBuffer = axios.get(testSong, {
  responseType: "arraybuffer",
  maxRedirects: 5
})
.then(response => {
  const { data: midiArrayBuffer } = response;
  return midiArrayBuffer;
});

const pianoPromise = Soundfont.instrument(ac, 'acoustic_grand_piano');
const banjoPromise = Soundfont.instrument(ac, 'banjo');
const drumPromise = Soundfont.instrument(ac, 'synth_drum');
const instruments = Promise.all([pianoPromise, banjoPromise, drumPromise]);

const windowLoaded = new Promise(resolve => {window.onload = () => {resolve()}});




/****** 2) Set stuff up once we've got all the resources loaded in. ******/


Promise.all([instruments, songBuffer, windowLoaded]).then((data)=>{
  const instruments = data[0];
  const piano = instruments[0];
  const banjo = instruments[1];
  const drum = instruments[2];

  const buffer = data[1];

  const Player = new MidiPlayer.Player( event => {
    if (event.name == 'Note on') {
      piano.play(event.noteName, ac.currentTime, {gain:event.velocity/100});
      //document.querySelector('#track-' + event.track + ' code').innerHTML = JSON.stringify(event);
    }
    console.log(event);
  });

  // Load the MIDI file
  Player.loadArrayBuffer(buffer);

  // Wrangle DOM nodes
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
