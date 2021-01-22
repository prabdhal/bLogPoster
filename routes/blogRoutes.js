const router = require('express').Router();
const Article = require('../models/articleSchema');

// Blogs home page
router.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' });

  res.render('index', { title: 'Home', articles });
});

router.get('/new', async (req, res) => {
  res.render('new', { title: 'New Article' });
});

router.get('/edit/:id', async (req, res) => {
  const article = await Article.findById({ id: req.params.id });

  res.render('edit', { title: 'Edit Article', article });
});

router.post('/new', async (req, res) => {
  const { title, author, description, markdown } = req.body;

  const article = new Article({
    title,
    author,
    description,
    markdown,
  });

  const saveArticle = await article.save((err, result) => {
    if (err) console.log(err);
    else console.log('article successfully saved!' + result);
  });
});

module.exports = router;
