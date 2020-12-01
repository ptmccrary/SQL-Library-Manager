var express = require('express');
var router = express.Router();

// Import 'Book' model
const { Book } = require('../models/');

// Handler function to wrap each route
function asyncHandler(cb) {
  return async(req, res, next) => {
    try {
      await cb(req, res, next);
    } catch(err) {
      next(err);
    }
  }
}

// Book doesn't exist error handler
function errorHandler(errStatus, msg) {
  const err = new Error(msg);
  err.status = errStatus;
  throw err;
};

// Sequelize validation error handler
async function sequelizeValidationHandler(err, route, title) {
  if (err.name === 'SequelizeValidationError') {
    book = await Book.build(req.body);
    res.render(`${route}`, { book, errors: err.errors, title: `${title}` });
  } else {
    throw error;
  }
}

// Get / - redirect to /books route
router.get('/', asyncHandler(async (req, res) => {
  res.redirect('/books');
}));

// Get /books - shows full list of books
router.get('/books', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render('index', { books, title: 'Books' });
}));

// Get /books/new - shows create new book form
router.get('/books/new', (req, res) => {
  res.render('new-book', { book: {}, title: 'New Book' });
});

// Post /books/new - posts a new book to the DB
router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect('/');
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("new-book", {book, errors: error.errors, title: "New Book" })
    } else {
      throw error;
    }
  }
}));

// Get /books/:id - shows book detail form
router.get('/books/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render('update-book', { book, title: 'UpdateBook' });
  } else {
    errorHandler(404, `There is no book in our database that matches that ID.`);
  }
}));

// Post /books/:id - updates book info in DB
router.post('/books/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect('/books');
    } else {
      errorHandler(404, `There is no book in our database that matches that ID.`);
    }
  } catch(error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("update-book", {book, errors: error.errors, title: "Update Book" })
    } else {
      throw error;
    }
  }
}));

/** Post /books/:id/delete - deletes a book
* ! Can't be undone
*/
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy(req.body);
    res.redirect('/books');
  } else {
    errorHandler(500, `There seems to be an issue on our end. Try again soon.`);
  }
}));

module.exports = router;
