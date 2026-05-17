document.addEventListener('DOMContentLoaded', () => {
    const bookForm = document.getElementById('bookForm');
    const bookList = document.getElementById('bookList');
    const bookCount = document.getElementById('bookCount');
    const formTitle = document.getElementById('form-title');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    let isEditing = false;
    let currentEditId = null;

    // Fetch and display books
    async function fetchBooks() {
        try {
            const response = await fetch('/books');
            const data = await response.json();
            renderBooks(data.books);
        } catch (error) {
            console.error('Error fetching books:', error);
            bookList.innerHTML = '<p style="color: var(--danger); text-align: center;">Failed to load books.</p>';
        }
    }

    function renderBooks(books) {
        bookList.innerHTML = '';
        bookCount.textContent = `${books.length} book${books.length !== 1 ? 's' : ''}`;

        if (books.length === 0) {
            bookList.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">
                    <p>Your library is empty. Add some books to get started!</p>
                </div>
            `;
            return;
        }

        books.forEach(book => {
            const card = document.createElement('div');
            card.className = 'book-card';
            card.innerHTML = `
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">by ${book.author}</p>
                <div class="card-actions">
                    <button onclick="startEdit(${book.id}, '${escapeHtml(book.title)}', '${escapeHtml(book.author)}')">Edit</button>
                    <button class="delete-btn" onclick="deleteBook(${book.id})">Delete</button>
                </div>
            `;
            bookList.appendChild(card);
        });
    }

    // Add or Update Book
    bookForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;

        const bookData = { title, author };

        try {
            let url = '/books';
            let method = 'POST';

            if (isEditing) {
                url = `/books/${currentEditId}`;
                method = 'PUT';
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookData)
            });

            if (response.ok) {
                resetForm();
                fetchBooks();
            } else {
                alert('Error saving book');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Delete Book
    window.deleteBook = async (id) => {
        if (!confirm('Are you sure you want to remove this book?')) return;

        try {
            const response = await fetch(`/books/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchBooks();
            } else {
                alert('Error deleting book');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Start Editing
    window.startEdit = (id, title, author) => {
        isEditing = true;
        currentEditId = id;

        document.getElementById('title').value = unescapeHtml(title);
        document.getElementById('author').value = unescapeHtml(author);

        formTitle.textContent = 'Edit Book';
        submitBtn.textContent = 'Update Book';
        cancelBtn.classList.remove('hidden');

        // Scroll to form smoothly
        bookForm.scrollIntoView({ behavior: 'smooth' });
    };

    // Cancel Editing
    cancelBtn.addEventListener('click', resetForm);

    function resetForm() {
        isEditing = false;
        currentEditId = null;
        bookForm.reset();

        formTitle.textContent = 'Add New Book';
        submitBtn.textContent = 'Add to Library';
        cancelBtn.classList.add('hidden');
    }

    // Helper to prevent XSS in render
    function escapeHtml(text) {
        if (!text) return text;
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function unescapeHtml(text) {
        if (!text) return text;
        return text
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, "\"")
            .replace(/&#039;/g, "'");
    }

    // Initial load
    fetchBooks();
});
