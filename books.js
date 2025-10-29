// DATA STRUCTURES 

// All book objects stored in an array
const myLibrary = [];

//use contructor for book using function constuctor
// every book objects get unique id  via crypto.randomUUID()
function Book(title, author, pages, read) {
  this.id = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

// add a prototype function to change read status 
// this method is inherited all book instances
Book.prototype.toggleRead = function () {
  this.read = !this.read;
}

// Add some initial books for demonstration
myLibrary.push(new Book("The Hobbit", "J.R.R. Tolkien", 310, true));
myLibrary.push(new Book("1984", "George Orwell", 328, false));
myLibrary.push(new Book("Sapiens: A Brief History of Humankind", "Yuval Noah Harari", 443, true));

// DOM ELEMENTS AND INITIALIZATION

const libraryGrid = document.getElementById('library-grid');
const newBookBtn = document.getElementById('new-book-btn');
const bookDialog = document.getElementById('book-dialog');
const bookForm = document.getElementById('book-form');
const closeDialogBtn = document.getElementById('close-dialog-btn');

// RENDERING LOGIC

// function that loops through the array and displays each book
// It regenerates the entire display based on the current myLibrary array state
function renderLibrary() {
  // clear all existing element before re rendering
  libraryGrid.innerHTML = '';

  myLibrary.forEach((book) => {
    const card = document.createElement('div');
    // use data-attribute to link DOM element to book object by unique ID
    card.dataset.id = book.id;

    // determine styling and button text
    const readStatusClass = book.read ? 'read-true' : 'read-false';
    const readBtnText = book.read ? 'Mark as Unread' : 'Mark as Read';
    
    card.className = 'book-card';
    card.innerHTML = `
      <div>
        <h3>${book.title}</h3>
        <p>by ${book.author}</p>
        <p>${book.pages}</p>
      </div>

      <div class="book-card-actions">
        <!--button to chage read status-->
        <button data-action="toggle-read" class="btn-base ${readStatusClass}">
          ${readBtnText}
        </button>
        <!--Button to remove the book-->
        <button data-action="remove" class="btn-base remove-btn">
          Remove
        </button>
      </div>
    `;

    libraryGrid.appendChild(card);
  });
}

// FUNCTIONALITY
// separate function to take arguments create a book and store it
function addBookToLibrary(e) {
  // stop the default form submission that causes a page refresh
  e.preventDefault();

  // get values from the form inputs
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const pages = parseInt(document.getElementById('pages').value, 10);
  const read = document.getElementById('read').checked;

  // create new Book object and add it to the array
  // simplified variable name back to 'book'
  const book = new Book(title, author, pages, read);
  myLibrary.push(book);

  renderLibrary(); //update library
  bookForm.reset();
  bookDialog.close();
}

// logic to remove the book from the array
function removeBook(bookId) {
  const bookIndex = myLibrary.findIndex(book => book.id === bookId);

  if (bookIndex > -1) {
    myLibrary.splice(bookIndex, 1);
    renderLibrary(); // update display
  } else {
    console.error("Book not found for ID:", bookId);
  }
}

// logic to toggle read status
function toggleReadStatus(bookId) {
  const book = myLibrary.find(b => b.id === bookId);

  if (book) {
    book.toggleRead(); //uses the Book.prototype method
    renderLibrary(); // update display
  }
}

//EVENT LISTENER
// add a "new Book" button that brings up a form
newBookBtn.addEventListener('click', () => {
  bookDialog.showModal();
});

// event for closing the dialog via cancel button
closeDialogBtn.addEventListener('click', () => {
  bookDialog.close();
});

//Event for handling form submission
bookForm.addEventListener('submit', addBookToLibrary);

// event delegation handles remove and toggle buttons
libraryGrid.addEventListener('click', (e) => {
  const button = e.target;
  const action = button.dataset.action;

  const card = button.closest('.book-card');
  if (!card) return;

  const bookId = card.dataset.id;
  if (action === 'remove') {
    removeBook(bookId);
  } else if(action === 'toggle-read') {
    toggleReadStatus(bookId);
  }
});

// INITIAL CALL
document.addEventListener('DOMContentLoaded', renderLibrary);