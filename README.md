# Reading-log 📚

A web app to log the books you've read, rate them, and keep your own notes — inspired by Derek Sivers' book notes page. Book covers are pulled automatically from the Open Library Covers API using each book's ISBN.

## Features

- Add new books with title, author, ISBN, rating, date read, and notes
- View all books with covers fetched from Open Library
- Edit existing book entries inline
- Delete book entries
- Sort books by rating or by recency (date read)

## Tech Stack

- Node.js
- Express.js
- PostgreSQL (via the `pg` package)
- EJS (templating)
- Open Library Covers API

## Prerequisites

- Node.js installed
- PostgreSQL installed and running locally

## Database Setup

Create a database and run the following SQL to set up the required tables:

```sql
CREATE TABLE books (
  id     SERIAL PRIMARY KEY,
  title  TEXT NOT NULL,
  author TEXT NOT NULL,
  isbn   VARCHAR(13)
);

CREATE TABLE reviews (
  id        SERIAL PRIMARY KEY,
  book_id   INTEGER REFERENCES books(id),
  rating    INTEGER CHECK (rating BETWEEN 1 AND 10),
  date_read DATE,
  notes     TEXT
);
```

## Environment Variables
```

Create a `.env` file in the project root with the following (replace with your own local Postgres credentials):
DB_USER=your_postgres_username
DB_HOST=localhost
DB_NAME=your_database_name
DB_PASSWORD=your_postgres_password
DB_PORT=5432
```


## Installation & Running the App

1. Clone the repo: git clone <your-repo-url>
2. Navigate into the project folder: cd books-project
3. Install dependencies:npm i
4. Set up your `.env` file and database as described above.
5. Start the server: nodemon index.js
6. Open your browser and go to: http://localhost:3000

