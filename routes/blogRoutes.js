const router = require('express').Router();
const Article = require('../models/articleSchema');
const Comment = require('../models/commentSchema');

// get blogs home page
router.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' });

  res.render('index', { title: 'Home', articles, user: req.user });
});

router.get('/view/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
  const comments = article.comments;
  console.log(comments);

  res.render('view', {
    title: 'View Article',
    article,
    user: req.user,
    comments,
  });
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

router.post('/view/:slug/comment', async (req, res) => {
  const { comment } = req.body;

  const article = await Article.findOne({ slug: req.params.slug });

  const comments = new Comment({
    author: req.user.username,
    comment,
  });

  console.log(comments);
  article.comments.push(comments);
  console.log(article);

  const saveComment = await comments.save(async (err, result) => {
    if (err) {
      console.log(err);

      res.redirect(`/blogs/view/${article.slug}`);
    } else {
      await article.save();
      console.log('article successfully saved!');
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

router.put('/comment/:id', async (req, res) => {
  const article = await Article.findById(req.params.id);

  article.comments.push(comment);

  const saveComment = await article.save((err, result) => {
    if (err) {
      console.log(err);
      res.redirect('/blogs');
    } else {
      console.log('article successfully saved!' + result);
      res.redirect('/blogs');
    }
  });
});

router.put('/view/:slug/comment/:id/like', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
  const commentId = req.params.id;

  for (i = 0; i < article.comments.length; i++) {
    console.log(article.comments[i]._id + ' compare with ' + commentId);
    if (article.comments[i]._id == commentId) {
      article.comments[i].likes += 1;
    }
  }

  const saveArticle = await article.save((err, result) => {
    if (err) {
      console.log(err);
      res.redirect('/blogs');
    } else {
      console.log('article successfully saved!' + result);
      res.redirect(`/blogs/view/${article.slug}`);
    }
  });
});

// delete article
router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);

  res.redirect('/blogs');
});

router.delete('view/:slug/comment/:id', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });

  const comment = await Comment.findByIdAndDelete(req.params.id);

  article.comments.remove(comment);

  res.redirect('/blogs');
});

module.exports = router;
