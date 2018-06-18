import testSong from './midi/SuperMarioBrothers.midi';
import { initializeOrchestra } from './midiHelpers.js';

/*
List of Available instruments:
(Master: https://github.com/gleitz/midi-js-soundfonts/tree/gh-pages/FluidR3_GM)

// Strings
  acoustic_bass
  acoustic_guitar_nylon
  acoustic_guitar_steel
  banjo
  cello
  contrabass
  distortion_guitar
  dulcimer
  electric_bass_finger
  electric_bass_pick
  electric_guitar_clean
  electric_guitar_jazz
  electric_guitar_muted
  fiddle
  fretless_bass
  guitar_fret_noise
  guitar_harmonics
  koto
  orchestral_harp
  overdriven_guitar
  pizzicato_strings
  shamisen
  sitar
  slap_bass_1
  slap_bass_2
  string_ensemble_1
  string_ensemble_2
  tremolo_strings
  viola
  violin


// Woodwinds
  accordion
  alto_sax
  bagpipe
  baritone_sax
  bassoon
  clarinet
  flute
  harmonica
  oboe
  ocarina
  pan_flute
  piccolo
  recorder
  shanai
  soprano_sax
  tango_accordion
  tenor_sax


// Brass
  brass_section
  english_horn
  french_horn
  muted_trumpet
  trombone
  trumpet
  tuba


// Pianos and Keyboards
  acoustic_grand_piano
  bright_acoustic_piano
  celesta
  clavinet
  electric_grand_piano
  electric_piano_1
  electric_piano_2
  honkytonk_piano
  harpsichord


// Pipes
  church_organ
  drawbar_organ
  lead_3_calliope
  percussive_organ
  reed_organ
  rock_organ
  shakuhachi


// Vocal
  choir_aahs
  voice_oohs
  whistle


// Bells and Mallets
  glockenspiel
  kalimba
  marimba
  music_box
  tinkle_bell
  tubular_bells
  vibraphone
  xylophone


// Percussion
  agogo
  melodic_tom
  percussion // ERROR with this one.
  steel_drums
  synth_drum
  taiko_drum
  timpani
  woodblock


// Synth and Electronic
  lead_1_square
  lead_2_sawtooth
  lead_4_chiff
  lead_5_charang
  lead_6_voice
  lead_7_fifths
  lead_8_bass_lead // ERROR with this one
  pad_1_new_age
  pad_2_warm
  pad_3_polysynth
  pad_4_choir
  pad_5_bowed
  pad_6_metalic
  pad_7_halo
  pad_8_sweep
  synth_bass_1
  synth_bass_2
  synth_brass_1
  synth_brass_2
  synth_choir
  synth_strings_1
  synth_strings_2

// SFX
  applause
  bird_tweet
  blown_bottle
  breath_noise
  fx_1_rain
  fx_2_soundtrack
  fx_3_crystal
  fx_4_atmosphere
  fx_5_brightness
  fx_6_goblins
  fx_7_echoes
  fx_8_scifi
  gunshot
  helicopter
  orchestra_hit
  reverse_cymbal
  seashore
  telephone_ring
*/


const trackAssignments = {
  // TRACK 1 IS RESERVED FOR METADATA. Start at 2.
  // All empty tracks will not play.
  2: 'steel_drums',
  3: 'steel_drums',
  4: 'tuba',
  // 5: 'synth_drum',
}

const PlayerPromise = initializeOrchestra(trackAssignments, testSong);
const windowLoaded = new Promise(resolve => {window.onload = () => {resolve()}});

Promise.all([PlayerPromise, windowLoaded]).then((data) => {
  const Player = data[0];

  const playButton = document.getElementById('play');
  const pauseButton = document.getElementById('pause');
  const stopButton = document.getElementById('stop');

  playButton.addEventListener('click', ()=>{ Player.play() });
  pauseButton.addEventListener('click', ()=>{ Player.pause() });
  stopButton.addEventListener('click', ()=>{ Player.stop() });
})
