const router = require('express').Router();
const Comment = require('../models/commentSchema');

// get blogs home page
router.get('/', async (req, res) => {
  const comments = await Comment.find().sort({ likes: 'desc' });

  res.render('index', { title: 'Home', articles, user: req.user });
});

// get edit article page
router.get('/edit/:id', async (req, res) => {
  const comments = await Comment.findById(req.params.id);

  res.render('edit', { title: 'Edit Article', article, user: req.user });
});

// create new article
router.post('/new', async (req, res) => {
  const { title, author, description, markdown } = req.body;

  const comments = new Comment({
    title,
    author,
    description,
    markdown,
  });

  const saveComment = await comment.save((err, result) => {
    if (err) {
      console.log(err);
      res.render('new', {
        title: 'New Article',
        comment: new Comment(),
        user: req.user,
      });
    } else {
      console.log('article successfully saved!' + saveComment);
      res.redirect(`/blogs/view/${article.slug}`);
    }
  });
});

// edit article
router.put('/edit/:id', async (req, res) => {
  const { title, author, description, markdown } = req.body;

  const comment = await Comment.findById(req.params.id);

  article.title = title;
  article.author = author;
  article.description = description;
  article.markdown = markdown;

  const saveComment = await comment.save((err, result) => {
    if (err) {
      console.log(err);
      res.render('new', { title: 'New Article', article, user: req.user });
    } else {
      console.log('article successfully saved!' + result);
      res.redirect(`/blogs/view/${article.slug}`);
    }
  });
});

router.put('/like/:id', async (req, res) => {
  const comment = await Comment.findById(req.params.id);

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

router.put('/reply/:id', async (req, res) => {
  const comment = await Comment.findById(req.params.id);

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
  await Comment.findByIdAndDelete(req.params.id);

  res.redirect('/blogs');
});

module.exports = router;
