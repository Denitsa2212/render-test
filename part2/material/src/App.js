import { useState, useEffect } from 'react'
import axios from 'axios'
import Note from './components/Note'
import noteService from './services/notes'

const App = (props) => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);
  //Connect to server
  useEffect(() => {
    noteService
    .getAll()
    .then(initialNotes => {
      setNotes(initialNotes)
    })
  }, [])
  //Upload new note
  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5
    }
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }
  // Handle change of note input
  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }
  //Change importance
  const toggleImportanceOf = (id) => {
    console.log(`Changing importance of  ${id}`);
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        alert(
          `the note '${note.content}' was already deleted from server`
        )
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const notesToSHow = showAll ? notes : notes.filter(note => note.important === true);

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notesToSHow.map(note => 
          <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input 
          value={newNote} 
          onChange={handleNoteChange}
        />
        <button type="submit">save</button>
      </form>  
      <button onClick={() => setShowAll(!showAll)}>{showAll ? "Filter" : "ShowAll"}</button>
    </div>
  )
}

export default App 