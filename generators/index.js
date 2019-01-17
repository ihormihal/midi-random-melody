const random = (array, sliceFrom = 0, sliceTo) => {
    if(!sliceTo) sliceTo = array.length
    let range = array.slice(sliceFrom, sliceTo)
    let index = Math.round(Math.random()*(range.length-1))
    return { 
        ...range[index]
    }
}

/*
note.index - индекс в октаве keys
note.scaleIndex - ступень в гамме
note.key - буква клавиши без номера октавы
note.octave - номер октавы
note.tone - порядковый номер клавиши на клавиатуре
note.rangeIndex - порядковый номер в диапазоне гаммы
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
    let groupLength = config.group.length
    for(let i=0;i<groupLength;i++){
        let groupNote = config.group[i]
        let note = random(range)
        let restAmount = groupLength - i - 1
        let groupDirection = config.direction || 'random'

        if(i === 0 && !config.allowRepeats){
            if(groupDirection === 'up'){
                note = random(range, 0, range.length - groupLength + 1) //потому что в slice последний индекс не учитывается
            }
            else if(groupDirection === 'down'){
                note = random(range, groupLength - 1)
            }
        }

        let rangeIndex = range.findIndex(item => note.tone === item.tone)
        let stage = note.stage

        if(i > 0){
            if(config.allowRepeats){
                //нам нужно вверх включая индекс предыдущей ноты
                if(groupDirection === 'up'){
                    note = random(range, notes[i-1].rangeIndex)
                }
                //нам нужно вниз включая индекс предыдущей ноты
                else if(groupDirection === 'down'){
                    note = random(range, 0, notes[i-1].rangeIndex + 1)
                }
            }else{
                //нам нужно вверх исключая индекс предыдущей ноты, оставляя запас для оставшихся в группе
                if(groupDirection === 'up'){
                    note = random(range, notes[i-1].rangeIndex + 1, range.length - restAmount)
                }
                //нам нужно вниз исключая индекс предыдущей ноты, оставляя запас для оставшихся в группе
                else if(groupDirection === 'down'){
                    note = random(range, restAmount, notes[i-1].rangeIndex)
                }
            }

            //update
            rangeIndex = range.findIndex(item => note.tone === item.tone)
            stage = note.stage

            //correct gamma
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

        notes.push({
            ...note,
            stage,
            rangeIndex,
            wait: groupNote.wait,
            duration: groupNote.duration
        })
    }
    return notes
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
        groups.push(group)
    }
    return groups
}


module.exports = {
    allNotes,
    generateScale,
    makeMelody
}