let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

if (window.location.pathname === '/notes') {
    noteTitle = document.querySelector('.note-title');
    noteText = document.querySelector('.note-textarea');
    saveNoteBtn = document.querySelector('.save-note');
    newNoteBtn = document.querySelector('.new-note');
    noteList = document.querySelectorAll('.list-container .list-group');
}

// Show an element
const show = (elem) => {
    elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
    elem.style.display = 'none';
};

// newNote is used to keep track of the note in the textarea
let newNote = {};


//Uses FETCH to retrieve notes from db.json through our /api/notes route
const getNotes = () =>
    fetch('/api/notes', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

// const saveNote = (note) =>


// const deleteNote = (id) =>


const renderNewNote = () => {
    hide(saveNoteBtn);

    if (newNote.id) {
        noteTitle.setAttribute('readonly', true);
        noteText.setAttribute('readonly', true);
        noteTitle.value = newNote.title;
        noteText.value = newNote.text;
    } else {
        noteTitle.removeAttribute('readonly');
        noteText.removeAttribute('readonly');
        noteTitle.value = '';
        noteText.value = '';
    }
};

// const handleNoteSave = () => {

// };

// Delete the clicked note
// const handleNoteDelete = (e) => {



// Sets the view of new note and displays it
const freshNote = (e) => {
    e.preventDefault();
    newNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
    renderNewNote();
};

// Render the list of note titles
// const renderNoteList =
// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === '/notes') {
    saveNoteBtn.addEventListener('click', handleNoteSave);
    newNoteBtn.addEventListener('click', handleNewNoteView);
    noteTitle.addEventListener('keyup', handleRenderSaveBtn);
    noteText.addEventListener('keyup', handleRenderSaveBtn);
}

getAndRenderNotes();