import SoundFont from 'soundfont-player';

export function loadInstruments(instrumentNames, ac) {
  return Promise.all(instrumentNames.map(name => Soundfont.instrument(ac, name)))
  .then(loaded => {
    return loaded.reduce((dictionary, instrument, i)=>{
      const name = instrumentNames[i];
      dictionary[name] = instrument;
      return dictionary
    }, {})
  })
}
