const generators = require('./generators')
const midifile = require('./components/midifile')

// const baseKey = process.argv[2] || 'C'


// let scale = generators.getMajorScale()
// console.log(scale)

// console.log(scale)



let groups = {
    pluck4: [
        { duration: '16', wait: '2' }, //group delay
        { duration: '16', wait: '16' },
        { duration: '16', wait: '0' },
        { duration: '8', wait: '16' },
    ]
}

let group

let config = {
    baseKey: 'G',
    octave: 3,
    width: 2, //ширина мелодии в октавах
    scale: 'major',
    scaleType: 'harmonic', //natural,harmonic,melodic
    groupName: 'pluck4',
    loops: 50, //количество групп
    direction: 'up', //направление в группе up/down/random
    allowRepeats: false //разрешать нот повторения в группе
}

config.group = groups[config.groupName]


let melody = generators.makeMelody(config)


midifile.create(`${config.baseKey}_${config.scaleType}_${config.scale}_${config.groupName}_${config.direction}`, melody)