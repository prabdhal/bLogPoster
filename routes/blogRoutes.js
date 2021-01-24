const router = require('express').Router();
const Article = require('../models/articleSchema');

// get blogs home page
router.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' });

  res.render('index', { title: 'Home', articles, user: req.user });
});

router.get('/view/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });

  res.render('view', { title: 'View Article', article, user: req.user });
});

// get new article page
router.get('/new', async (req, res) => {
  res.render('new', {
    title: 'New Article',
    article: new Article(),
    user: req.user,
  });
});

// get edit article page
router.get('/edit/:id', async (req, res) => {
  const article = await Article.findById(req.params.id);

  res.render('edit', { title: 'Edit Article', article, user: req.user });
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
    if (err) {
      console.log(err);
      res.render('new', {
        title: 'New Article',
        article: new Article(),
        user: req.user,
      });
    } else {
      console.log('article successfully saved!' + saveArticle);
      res.redirect(`/blogs/view/${article.slug}`);
    }
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
    if (err) {
      console.log(err);
      res.render('new', { title: 'New Article', article, user: req.user });
    } else {
      console.log('article successfully saved!' + result);
      res.redirect(`/blogs/view/${article.slug}`);
    }
  });
});

router.put('/publish/:id', async (req, res) => {
  const article = await Article.findById(req.params.id);

  console.log('article is currently: ' + article.published);
  article.published = !article.published;
  console.log('article is now: ' + article.published);

  const saveArticle = await article.save((err, result) => {
    if (err) {
      console.log(err);
      res.redirect('/blogs');
    } else {
      console.log('article successfully saved!' + result);
      res.redirect('/blogs');
    }
  });
});

// delete article
router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);

  res.redirect('/blogs');
});

module.exports = router;
