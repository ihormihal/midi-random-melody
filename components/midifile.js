const fs = require('fs')
const MidiWriter = require('midi-writer-js')

const create = (name = 'test', melody) => {
    
    const track = new MidiWriter.Track()

    for(let i=0;i<melody.length;i++){
        for(let j=0;j<melody[i].length;j++){
            let note = melody[i][j]
            
            track.addEvent(new MidiWriter.NoteEvent({
                duration: note.duration,
                wait: i === 0 && j === 0 ? 0 : note.wait,
                pitch: note.key+note.octave
            }))
        }
    }
    
    // Generate a file
    let time = new Date().toISOString()
    const write = new MidiWriter.Writer([track])
    const fileName = `${name}_${time}.mid`
    const filePath = `./output/${fileName}`

    fs.writeFile(filePath, '', (err) => {
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