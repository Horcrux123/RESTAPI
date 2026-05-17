# Bibliophile - Simple Book Manager

This is a simple Web Application built using Python and Flask. It provides a modern, dark-themed interface to manage a collection of books.

## Features

- **Web Interface:** specific modern UI to view, add, edit, and delete books.
- **REST API:** The backend is a fully functional REST API.
- **Responsive Design:** Works on desktop and mobile.

## Prerequisites

- Python 3.x installed
- `pip` package manager

## Setup

1.  **Create a virtual environment:**
    ```bash
    python -m venv venv
    ```

2.  **Activate the virtual environment:**
    *   Windows:
        ```bash
        .\venv\Scripts\activate
        ```
    *   macOS/Linux:
        ```bash
        source venv/bin/activate
        ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

## Running the App

1.  Start the application:
    ```bash
    python app.py
    ```

2.  Open your browser and navigate to `http://127.0.0.1:5000/`.

## API Endpoints (Backend)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Web Interface (HTML) |
| `GET` | `/books` | Get all books (JSON) |
| `GET` | `/books/<id>` | Get a specific book by ID |
| `POST` | `/books` | Add a new book (JSON body required) |
| `PUT` | `/books/<id>` | Update an existing book (JSON body) |
| `DELETE` | `/books/<id>` | Delete a book |
