const random = (array) => {
    let index = Math.round(Math.random()*(array.length-1))
    return { 
        ...array[index]
    }
}

/*
note.index - индекс в октаве keys
note.scaleIndex - ступень в гамме
note.key - буква клавиши без номера октавы
note.octave - номер октавы
note.tone - порядковый номер клавиши на клавиатуре
note.wait - задержка
note.duration - длительность
*/

const keys = [ 'C','C#','D','D#','E','F','F#','G','G#','A','A#','B' ]

let allNotes = []
for(let octave=0;octave<9;octave++){
    for(let index=0;index<keys.length;index++){
        let tone = index + octave*keys.length //это и есть индекс в массиве
        allNotes.push({
            octave,
            index,
            key: keys[index],
            tone: tone
        }) 
    }
}

const generateScale = (baseKey = 'C', type = 'major') => {
    let structure = []
    switch (type) {
        case 'major':
            structure = [2,2,1,2,2,2,1]
            break
        case 'minor':
            structure = [2,1,2,2,1,2,2]
            break
        default:
            break
    }

    let index = keys.indexOf(baseKey)
    let indexes = [index]
    for(let i=0;i<structure.length;i++){
        index = index+structure[i]
        if(index > keys.length-1) index = index-keys.length
        indexes.push(index)
    }

    let scaleNotes = []
    for(let note of allNotes){
        let stage = indexes.indexOf(note.index)
        if(stage > -1){ //in scale
            scaleNotes.push({
                ...note,
                stage
            })
        }
    }
    
    return scaleNotes
}

const randomGroup = (range, config) => {
    let notes = []
    let noteExists = (note) => {
        return config.allowRepeats ? false : notes.findIndex(n => note.tone === n.tone) > -1
    }
    for(let i=0;i<config.group.length;i++){
        let note
        do{
            note = random(range)
        }while(noteExists(note))

        notes.push(note)
    }
    return notes
}

const adjustGroup = (notes, config) => {
    let group = []
    for(let i=0;i<notes.length;i++){
        let note = notes[i]
        let stage = note.stage

        //correct harmonic && melodic gamma
        if(i > 0){
            
            let direction = ''
            if(stage > notes[i-1].stage){
                direction = 'up'
            }else if(stage < notes[i-1].stage){
                direction = 'down'
            }
            if(config.scale === 'major'){
                if(
                    (config.scaleType === 'harmonic' && stage === 6) || (config.scaleType === 'melodic' && (stage === 5 || stage === 6) && direction === 'down')
                ){
                    note = allNotes[note.tone - 1]
                }
            }
            else if(config.scale === 'minor'){
                if(
                    (config.scaleType === 'harmonic' && stage === 6) || (config.scaleType === 'melodic' && (stage === 5 || stage === 6) && direction === 'up')
                ){
                    note = allNotes[note.tone + 1]
                }
            }
        }

        group.push({
            ...note,
            stage,
            wait: config.group[i].wait,
            duration: config.group[i].duration
        })
    }
    return group
}

const makeMelody = (config) => {
    let scale = generateScale(config.baseKey, config.scale)
    let baseNote = scale.find(note => note.octave === config.octave && note.key === config.baseKey)
    let fromIndex = scale.indexOf(baseNote)
    let toIndex = fromIndex + config.width*8 //8 - количество ступеней
    if(toIndex > scale.length - 1) toIndex = scale.length - 1
    let range = scale.slice(fromIndex, toIndex + 1)

    let groups = []
    for(let i=0;i<config.loops;i++){
    
        let group = randomGroup(range, config)
        if(config.direction === 'up'){
            group.sort((a,b) => a.tone - b.tone)
        }
        else if(config.direction === 'down'){
            group.sort((a,b) => b.tone - a.tone)
        }

        let adjustedGroup = adjustGroup(group, config)

        groups.push(adjustedGroup)
    }
    return groups
}


module.exports = {
    allNotes,
    generateScale,
    makeMelody
}