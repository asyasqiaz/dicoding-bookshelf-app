const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete
  }
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function isLocalStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser Anda tidak mendukung local storage');
    return false;
  }
  return true;
}

function saveData() {
  if (isLocalStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromLocalStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
  const textBookTitle = document.createElement('h3');
  textBookTitle.innerText = bookObject.title;
  textBookTitle.classList.add('my-4', 'text-xl', 'font-medium', 'text-gray-900');

  const textBookAuthor = document.createElement('p');
  textBookAuthor.innerText = `Penulis: ${bookObject.author}`;
  textBookAuthor.classList.add('mb-2');

  const textBookYear = document.createElement('p');
  textBookYear.innerText = `Tahun: ${bookObject.year}`;

  const textContainer = document.createElement('div');
  textContainer.classList.add('book-item-text', 'p-4');
  textContainer.append(textBookTitle, textBookAuthor, textBookYear);

  const container = document.createElement('div');
  container.classList.add('book-item', 'border', 'border-gray-300', 'rounded-lg', 'bg-gray-50');
  container.append(textContainer);
  container.setAttribute('id', `book-${bookObject.id}`);

  if (bookObject.isComplete) {
    const uncompleteButton = document.createElement('button');
    uncompleteButton.classList.add('mx-4', 'my-4', 'px-4', 'py-2.5', 'text-white', 'bg-sky-500', 'hover:bg-sky-600', 'focus:ring-4', 'focus:outline-none', 'focus:ring-sky-100', 'font-medium', 'rounded-lg', 'text-sm', 'text-center');
    uncompleteButton.innerText = 'Belum Selesai Dibaca';
    uncompleteButton.addEventListener('click', function () {
      addBookToUncompleted(bookObject.id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('my-4', 'px-4', 'py-2.5', 'text-white', 'bg-sky-500', 'hover:bg-sky-600', 'focus:ring-4', 'focus:outline-none', 'focus:ring-sky-100', 'font-medium', 'rounded-lg', 'text-sm', 'text-center');
    trashButton.innerText = 'Hapus';
    trashButton.addEventListener('click', function () {
      const removeCompletedBook = confirm("Yakin ingin menghapus buku ini dari rak selesai dibaca?");
      if (removeCompletedBook == true) {
        removeBookFromCompleted(bookObject.id);
      }
      else {
        return;
      }
    });

    container.append(uncompleteButton, trashButton);
  }
  else {
    const completeButton = document.createElement('button');
    completeButton.classList.add('mx-4', 'my-4', 'px-4', 'py-2.5', 'text-white', 'bg-sky-500', 'hover:bg-sky-600', 'focus:ring-4', 'focus:outline-none', 'focus:ring-sky-100', 'font-medium', 'rounded-lg', 'text-sm', 'text-center');
    completeButton.innerText = 'Selesai Dibaca';
    completeButton.addEventListener('click', function () {
      addBookToCompleted(bookObject.id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('my-4', 'px-4', 'py-2.5', 'text-white', 'bg-sky-500', 'hover:bg-sky-600', 'focus:ring-4', 'focus:outline-none', 'focus:ring-sky-100', 'font-medium', 'rounded-lg', 'text-sm', 'text-center');
    trashButton.innerText = 'Hapus';
    trashButton.addEventListener('click', function () {
      const removeUncompletedBook = confirm("Yakin ingin menghapus buku ini dari rak belum selesai dibaca?");
      if (removeUncompletedBook == true) {
        removeBookFromUncompleted(bookObject.id);
      }
      else {
        return;
      }
    });

    container.append(completeButton, trashButton);
  }

  return container;
}

function addBook() {
  const bookTitle = document.getElementById('inputBookTitle').value;
  const bookAuthor = document.getElementById('inputBookAuthor').value;
  const bookYear = document.getElementById('inputBookYear').value;
  const isBookComplete = document.getElementById('inputBookIsComplete').checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, isBookComplete);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();

  document.getElementById('inputBookTitle').value = "";
  document.getElementById('inputBookAuthor').value = "";
  document.getElementById('inputBookYear').value = "";
  document.getElementById('inputBookIsComplete').checked = false;
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBookToUncompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBookFromUncompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('input-book');

  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  if (isLocalStorageExist()) {
    loadDataFromLocalStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log('Data buku berhasil disimpan.');
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookList = document.getElementById('incompleteBookshelfList');
  uncompletedBookList.innerHTML = '';

  const completedBookList = document.getElementById('completeBookshelfList');
  completedBookList.innerHTML = '';

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isComplete) {
      uncompletedBookList.append(bookElement);
    } else {
      completedBookList.append(bookElement);
    }
  }
})

const searchButton = document.getElementById('searchSubmit');
searchButton.addEventListener("click", function (event) {
  event.preventDefault();
  const searchBook = document.getElementById('searchBookTitle').value.toLowerCase();
  const bookListInShelves = document.querySelectorAll('.book-item-text > h3');
  for (const bookUnit of bookListInShelves) {
    if (bookUnit.innerText.toLowerCase().includes(searchBook)) {
      bookUnit.parentElement.parentElement.style.display = "block";
    } else {
      bookUnit.parentElement.parentElement.style.display = "none";
    }
  }
})