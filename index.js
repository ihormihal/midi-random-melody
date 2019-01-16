const generators = require('./generators')
const midifile = require('./components/midifile')

// const baseKey = process.argv[2] || 'C'

let notes = generators.randomScale({
    baseKey: 'C',
    startOctave: 3,
    endOctave: 6,
    scale: 'major',
    scaleType: 'melodic', //natural,harmonic,melodic
    count: 400
})

let group = [
    { duration: '16', wait: '4' }, //group delay
    { duration: '16', wait: '16' },
    { duration: '16', wait: '0' },
    { duration: '8', wait: '16' },
]

midifile.create('test', notes, group)