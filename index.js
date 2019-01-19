const generators = require('./generators')
const midifile = require('./components/midifile')

// const baseKey = process.argv[2] || 'C'


// let scale = generators.getMajorScale()
// console.log(scale)

// console.log(scale)



let groups = {
    flat: [
        { duration: '4'},
        { duration: '4'},
        { duration: '4'},
        { duration: '4'}
    ],
    pluck4: [
        { duration: '16', wait: '4' },
        { duration: '16', wait: '16' },
        { duration: '16', wait: '0' },
        { duration: '4', wait: '16' },
    ],
    pluck4_v2: [
        { duration: '4', wait: '8' },
        { duration: '8', wait: '0' },
        { duration: '4', wait: '0' },
    ]
}

let config = {
    baseKey: 'E',
    octave: 3,
    width: 2, //ширина мелодии в октавах
    scale: 'major',
    scaleType: 'melodic', //natural,harmonic,melodic
    groupName: 'flat',
    loops: 100, //количество групп
    direction: 'random', //up,down,random
    allowRepeats: true //разрешать повторения нот (включать если не задан pitch)
}

config.group = groups[config.groupName]


let melody = generators.makeMelody(config)


midifile.create(`${config.baseKey}_${config.scaleType}_${config.scale}_${config.groupName}_${config.direction}`, melody)