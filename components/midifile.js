const fs = require('fs')
const MidiWriter = require('midi-writer-js')

const create = (name = 'test', notes, group) => {
    let time = new Date().toISOString()
    const track = new MidiWriter.Track()
    for(let i=0;i<notes.length;i++){
        let note = notes[i]
        let groupIndex = i%group.length
        let noteConfig = {
            ...group[groupIndex],
            pitch:[note.key+note.octave]
        }
        track.addEvent(new MidiWriter.NoteEvent(noteConfig))
    }
    
    // Generate a file
    const write = new MidiWriter.Writer([track])
    const fileName = `${name}_${time}.mid`
    const filePath = `./output/${fileName}`

    fs.appendFile(filePath, '', (err) => {
        const wstream = fs.createWriteStream(filePath)
        wstream.on('finish', () => {
            console.log(`File "${fileName}" has been written.`);
        })
        wstream.write(write.buildFile())
        wstream.end()
    });
}

module.exports = { 
    create
}