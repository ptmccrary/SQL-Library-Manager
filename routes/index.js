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
      res.status(500).send(err);
    }
  }
}

/* GET home page. */
router.get('/', asyncHandler(async (req, res) => {
  res.redirect('/books');
}));

// Get Books
router.get('/books', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.json(books)
}))

module.exports = router;
