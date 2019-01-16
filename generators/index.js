const keys = [ 'C','C#','D','D#','E','F','F#','G','G#','A','A#','B' ]

const getMajorScale = (baseKey) => {
    let major = [2,2,1,2,2,2,1]
    // let majorHarmonic = [2,2,1,2,1,3,1]
    return generateScale(baseKey, major)
}

const getMinorScale = (baseKey) => {
    let minor = [2,1,2,2,1,2,2]
    return generateScale(baseKey, minor)
}

const getRandomKey = (scale, startOctave, endOctave) => {
    let keyIndex = Math.round(Math.random()*(scale.length-1))
    let octave = startOctave + Math.round(Math.random()*(endOctave - startOctave - 1))
    let key = scale[keyIndex]
    return {
        ...key,
        octave: octave,
        key: scale[keyIndex].key
    }
}

const generateScale = (baseKey = 'F', structure) => {
    let scale = []
    let index = keys.indexOf(baseKey)
    scale.push({scaleIndex: 0, index: 0, key: baseKey})
    for(let i=0;i<structure.length;i++){
        index = index+structure[i]
        if(index > keys.length-1) index = index-keys.length
        scale.push({scaleIndex: i+1, index: index, key: keys[index]})
    }
    return scale
}

const randomScale = (config) => {
    let scale = []
    let notes = []

    if(config.scale === 'major'){
        scale = getMajorScale(config.baseKey)
    }else if(config.scale === 'minor'){
        scale = getMinorScale(config.baseKey)
    }

    for(let i=0;i<config.count;i++){
        let note = getRandomKey(scale, config.startOctave, config.endOctave)
        if(i > 0){
            let prevScaleIndex = notes[i-1].scaleIndex
            if(config.scale === 'major'){
                if(config.scaleType === 'harmonic' && note.scaleIndex === 6){
                    let prevIndex = note.index === 0 ? keys.length - 1 : note.index - 1
                    note.key = keys[prevIndex]
                }
                if(config.scaleType === 'melodic' && (note.scaleIndex === 5 || note.scaleIndex === 6) && note.scaleIndex < prevScaleIndex ){
                    let prevIndex = note.index === 0 ? keys.length - 1 : note.index - 1
                    note.key = keys[prevIndex]
                }
            }
            else if(config.scale === 'minor'){
                if(config.scaleType === 'harmonic' && note.scaleIndex === 6){
                    let nextIndex = note.index === keys.length - 1 ? 0 : note.index + 1
                    note.key = keys[nextIndex]
                }
                if(config.scaleType === 'melodic' && (note.scaleIndex === 5 || note.scaleIndex === 6) && note.scaleIndex > prevScaleIndex ){
                    let nextIndex = note.index === keys.length - 1 ? 0 : note.index + 1
                    note.key = keys[nextIndex]
                }
            }
        }
        notes.push(note)
    }
    return notes
}


module.exports = {
    randomScale
}