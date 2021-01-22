const router = require('express').Router();
const article = require('../models/articleSchema');
const Article = require('../models/articleSchema');

// get blogs home page
router.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' });

  res.render('index', { title: 'Home', articles });
});

router.get('/view/:id', async (req, res) => {
  const article = await Article.findById(req.params.id);

  res.render('view', { title: 'View Article', article });
});

// get new article page
router.get('/new', async (req, res) => {
  res.render('new', { title: 'New Article', article: new Article() });
});

// get edit article page
router.get('/edit/:id', async (req, res) => {
  const article = await Article.findById(req.params.id);

  res.render('edit', { title: 'Edit Article', article });
});

// create new article
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
    res.redirect(`/blogs/view/${article._id}`);
  });
});

// edit article
router.put('/edit/:id', async (req, res) => {
  const { title, author, description, markdown } = req.body;

  const article = await Article.findById(req.params.id);

  article.title = title;
  article.author = author;
  article.description = description;
  article.markdown = markdown;

  const saveArticle = await article.save((err, result) => {
    if (err) console.log(err);
    else console.log('article successfully saved!' + result);
    res.redirect(`/blogs/view/${article._id}`);
  });
});

// delete article
router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);

  res.redirect('/blogs');
});

module.exports = router;
