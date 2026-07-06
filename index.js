import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config() 

const app = express();
const port = 3000;


//database connection configuration
const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//A simple in-memory array to store books and their reviews for demonstration purposes
let books = [
  { id: 1, title: "The Spanish Love Deception" },
  { id: 2, title: "To Kill a Mockingbird" },
];


//Get all books and their reviews, with optional sorting
app.get('/', async (req, res) => {
  const sort = req.query.sort;
  let query = "SELECT books.id AS book_id, books.title, books.author, books.isbn, reviews.rating, reviews.date_read, reviews.notes FROM books INNER JOIN reviews ON books.id = reviews.book_id";

  if (sort === 'rating') {
    query += " ORDER BY reviews.rating DESC";
  } else if (sort === 'recency') {
    query += " ORDER BY reviews.date_read DESC";
  } else {
    query += " ORDER BY books.id ASC";
  }

  
  try {
    const result = await db.query(query);
    res.render('index.ejs', { books: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong.");
  }
});


//Add a new book and its review
app.post('/add', async (req, res) => {
  const { title, author, isbn, rating, date_read, notes } = req.body;

  try {
    // Insert the new book into the books table and get its ID
    const bookResult = await db.query(
      "INSERT INTO books (title, author, isbn) VALUES ($1, $2, $3) RETURNING id",
      [title, author, isbn]
    );
   // Get the ID of the newly inserted book
    const newBookId = bookResult.rows[0].id;

   // Insert the review for the new book into the reviews table
    await db.query(
      "INSERT INTO reviews (book_id, rating, date_read, notes) VALUES ($1, $2, $3, $4)",
      [newBookId, rating, date_read, notes]
    );

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong adding the book.");
  }
});


//Edit an existing book and its review
app.post('/edit', async (req, res) => {
  const { book_id, title, author, isbn, rating, date_read, notes } = req.body;

  try {
    await db.query(
      "UPDATE books SET title = $1, author = $2, isbn = $3 WHERE id = $4",
      [title, author, isbn, book_id]
    );
// Update the review for the book
    await db.query(
      "UPDATE reviews SET rating = $1, date_read = $2, notes = $3 WHERE book_id = $4",
      [rating, date_read, notes, book_id]
    );

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong updating the book.");
  }
});


//Delete a book and its review
app.post('/delete/:id', async (req, res) => {
  const bookId = req.params.id;

  try {
    // Delete the review first, then the book
    await db.query("DELETE FROM reviews WHERE book_id = $1", [bookId]);
    await db.query("DELETE FROM books WHERE id = $1", [bookId]);

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong deleting the book.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});   


