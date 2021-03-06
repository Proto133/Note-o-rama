let noteTitle;
let noteText;
let saveBtn;
let addNote;
let noteList;
let refreshNote;

if (window.location.pathname === '/notes') {
    noteTitle = document.querySelector('.note-title');
    noteText = document.querySelector('.note-textarea');
    saveBtn = document.querySelector('.save-note');
    addNote = document.querySelector('.new-note');
    noteList = document.querySelectorAll('.list-container .list-group');
    refreshNote = document.querySelector('.refresh-note');
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

//Sends values from front end user input to API/notes
const saveNote = (note) =>
    fetch('/api/notes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
    });

// Uses Fetch DELETE METHOD to delete Note from API
const remove = (id) =>
    fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

const showFreshNote = () => {
    //Disallows saving a blank note
    hide(saveBtn);
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


// User Saves new Note
const submitData = () => {
    const newNote = {
        title: noteTitle.value,
        text: noteText.value,
    };
    saveNote(newNote).then(() => {
        getAndRenderNotes();
        showFreshNote();
    });
};

// IF Notes list is empty replace it with welcome Text
// const placeHolderData = () => {
//     const placeHolderNote = {
//         title: "Welcome to Note-O-Rama",
//         text: "To get started, click the plus sign in the top right corner of the page and create your first note! Once, you've made a title and some content -- a save button will appear. Click on the that to save your note, and that's it; you're all done!"
//     };
//     saveNote(placeHolderNote).then(() => {
//         getAndRenderNotes();
//         showFreshNote();
//     });
// };



// Delete the clicked note
const searchAndDestroy = (e) => {
    // Prevents the click listener for the list from being called when the button inside of it is clicked
    e.stopPropagation();

    const note = e.target;
    const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;
    if (newNote.id === noteId) {
        newNote = {};
    }
    remove(noteId).then(() => {
        getAndRenderNotes();
        showFreshNote();
    });
};

// Sets the newNote and displays it
const handleNoteView = (e) => {
    e.preventDefault();
    newNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
    showFreshNote();
};

// Clears newNote object ready for user input.
const addNoteView = (e) => {
    newNote = {};
    addNote.classList.remove('fa-redo');
    addNote.classList.add('fa-plus');
    showFreshNote();
};

const toggleSaveBtn = () => {
    if (!noteTitle.value.trim() || !noteText.value.trim()) {
        hide(saveBtn);
    } else {
        show(saveBtn);
        addNote.classList.remove('fa-plus');
        addNote.classList.add('fa-redo');
    }
};

// Render the list of note titles
const showList = async(notes) => {
    let jsonNotes = await notes.json();

    if (window.location.pathname === '/notes') {
        noteList.forEach((el) => (el.innerHTML = ''));
    }

    let noteListItems = [];

    // Returns HTML element with or without a delete button
    const createLi = (text, id, delBtn = true) => {
        const liEl = document.createElement('li');
        liEl.classList.add('list-group-item', 'noselect');

        const spanEl = document.createElement('span');
        spanEl.classList.add('list-item-title', 'normal', 'noselect');
        spanEl.innerText = text;
        spanEl.addEventListener('click', handleNoteView);

        //Tiny Screen Protocol
        const spanElTiny = document.createElement('span');
        spanElTiny.classList.add('list-item-title', 'hidden', 'noselect');
        spanElTiny.innerText = `Note ${id}`;
        spanElTiny.addEventListener('click', handleNoteView);

        liEl.append(spanEl);
        liEl.append(spanElTiny);

        if (delBtn) {
            const delBtnEl = document.createElement('i');
            delBtnEl.classList.add(
                'noselect',
                'fas',
                'fa-trash-alt',
                'float-right',
                'text-danger',
                'delete-note'
            );
            delBtnEl.addEventListener('click', searchAndDestroy);

            liEl.append(delBtnEl);
        }

        return liEl;
    };

    if (jsonNotes.length <= 0) {
        // placeHolderData();
        noteListItems.push(createLi('No saved Notes', false));
    }

    jsonNotes.forEach((note) => {
        const li = createLi(note.title, note.id);
        li.dataset.note = JSON.stringify(note);

        noteListItems.push(li);
    });

    if (window.location.pathname === '/notes') {
        noteListItems.forEach((note) => noteList[0].append(note));
    }

};

// const initialView = () => {
//     getNotes().then(async(notes) => {
//         let initNote = await notes.json()
//         if (initNote) {
//             newNote = initNote[0];
//             console.log(newNote);
//         }
//     }).then(showFreshNote(newNote));
// };


// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(showList);

if (window.location.pathname === '/notes') {
    saveBtn.addEventListener('click', submitData);
    addNote.addEventListener('click', addNoteView);
    noteTitle.addEventListener('keyup', toggleSaveBtn);
    noteText.addEventListener('keyup', toggleSaveBtn);
}

// initialView();
getAndRenderNotes();