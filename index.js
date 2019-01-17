const generators = require('./generators')
const midifile = require('./components/midifile')

// const baseKey = process.argv[2] || 'C'


// let scale = generators.getMajorScale()
// console.log(scale)

// console.log(scale)



let groups = {
    pluck_4: [
        { duration: '16', wait: '2' }, //group delay
        { duration: '16', wait: '16' },
        { duration: '16', wait: '0' },
        { duration: '8', wait: '16' },
    ]
}

let config = {
    baseKey: 'C',
    octave: 4,
    width: 1, //ширина мелодии в октавах
    scale: 'minor',
    scaleType: 'harmonic', //natural,harmonic,melodic
    group: groups.pluck_4, //группа - длительности
    loops: 10, //количество групп
    direction: 'down', //направление в группе
    strictDirection: false //не разрешать повторения в группе
}



let melody = generators.makeMelody(config)


midifile.create(`${config.baseKey}_${config.scaleType}_${config.scale}`, melody)