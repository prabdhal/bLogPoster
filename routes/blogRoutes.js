const router = require('express').Router();
const Article = require('../models/articleSchema');
const Comment = require('../models/commentSchema');

// get blogs home page
router.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' });

  res.render('index', { title: 'Home', articles, user: req.user });
});

// view an article and all corresponding comments
router.get('/view/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
  const allComments = await Comment.find();

  let comments = [];

  for (i = 0; i < allComments.length; i++) {
    if (allComments[i].blogRef == article._id) {
      comments = allComments[i];
    }
  }
  console.log(comments);

  res.render('view', {
    title: 'View Article',
    article,
    user: req.user,
    comments: allComments,
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

// post a comment
router.post('/view/:slug/comment', async (req, res) => {
  const { comment } = req.body;

  const article = await Article.findOne({ slug: req.params.slug });

  const comments = new Comment({
    blogRef: article._id,
    author: req.user.username,
    comment,
  });

  console.log(comments);
  console.log(article);

  const saveComment = await comments.save((err, result) => {
    if (err) {
      console.log(err);
      res.redirect(`/blogs/view/${article.slug}`);
    } else {
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

// publish article
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

// edit comment
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

// like comment
router.put('/view/:slug/comment/:id/like', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
  const comment = await Comment.findById(req.params.id);
  const user = req.user;

  console.log('the user is ' + user);
  let authorLikedAlready = false;
  let removeIndex = null;

  if (comment.usersLiked.length == 0) {
    comment.usersLiked.push(user.username);
    console.log(`${user.username} has liked the comment... ${comment}`);
  } else {
    for (i = 0; i < comment.usersLiked.length; i++) {
      if (user.username == comment.usersLiked[i]) {
        authorLikedAlready = true;
        removeIndex = i;
        console.log(
          `The user reliking has been identified at index ${removeIndex}`
        );
      }
    }
  }
  console.log(`authorLikedAlready: ${authorLikedAlready}`);
  if (authorLikedAlready) comment.usersLiked.splice(removeIndex, 1);

  const saveComment = await comment.save((err, result) => {
    if (err) {
      console.log('An error occurred during save ' + err);
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

// delete comment
router.delete('view/:slug/comment/:id', async (req, res) => {
  const delComment = await Comment.findByIdAndDelete(req.params.id);

  res.redirect('/blogs');
});

module.exports = router;
