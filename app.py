from flask import Flask, jsonify, request, render_template

app = Flask(__name__)

# In-memory database for demo purposes
books = [
    {"id": 1, "title": "The Great Gatsby", "author": "F. Scott Fitzgerald"},
    {"id": 2, "title": "1984", "author": "George Orwell"},
    {"id": 3, "title": "To Kill a Mockingbird", "author": "Harper Lee"}
]

# Helper function to find a book by ID
def find_book(book_id):
    return next((book for book in books if book["id"] == book_id), None)

@app.route('/')
def home():
    return render_template('index.html')

# GET all books
@app.route('/books', methods=['GET'])
def get_books():
    return jsonify({"books": books})

# GET a single book by ID
@app.route('/books/<int:book_id>', methods=['GET'])
def get_book(book_id):
    book = find_book(book_id)
    if not book:
        return jsonify({"error": "Book not found"}), 404
    return jsonify(book)

# POST a new book
@app.route('/books', methods=['POST'])
def add_book():
    new_book = request.get_json()
    
    # Simple validation
    if not new_book or "title" not in new_book or "author" not in new_book:
        return jsonify({"error": "Invalid input, 'title' and 'author' are required"}), 400
    
    # Generate a new ID
    new_id = max(book["id"] for book in books) + 1 if books else 1
    new_book["id"] = new_id
    books.append(new_book)
    
    return jsonify(new_book), 201

# PUT to update an existing book
@app.route('/books/<int:book_id>', methods=['PUT'])
def update_book(book_id):
    book = find_book(book_id)
    if not book:
        return jsonify({"error": "Book not found"}), 404
    
    data = request.get_json()
    book["title"] = data.get("title", book["title"])
    book["author"] = data.get("author", book["author"])
    
    return jsonify(book)

# DELETE a book
@app.route('/books/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    book = find_book(book_id)
    if not book:
        return jsonify({"error": "Book not found"}), 404
    
    books.remove(book)
    return jsonify({"message": "Book deleted successfully"})

if __name__ == '__main__':
    app.run(debug=True)
