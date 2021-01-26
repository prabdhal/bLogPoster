const router = require('express').Router();
const Article = require('../models/articleSchema');
const Comment = require('../models/commentSchema');
const Reply = require('../models/replySchema');
const { checkAuthenticated } = require('../config/auth');

// get blogs home page
router.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' });

  res.render('index', { title: 'Home', articles, user: req.user });
});

// view an article and all corresponding comments
router.get('/view/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
  const allComments = await Comment.find();
  const allReplies = await Reply.find();

  let comments = [];
  let replies = [];

  for (i = 0; i < allComments.length; i++) {
    if (allComments[i].blogRef == article._id) {
      comments.push(allComments[i]);
    }
  }
  for (i = 0; i < allReplies.length; i++) {
    console.log(allReplies[i].blogRef + ' vs ' + article._id);
    if (allReplies[i].blogRef == article._id) {
      replies.push(allReplies[i]);
    }
  }

  res.render('view', {
    title: 'View Article',
    article,
    user: req.user,
    comments,
    replies,
  });
});

// get new article page
router.get('/new', checkAuthenticated, async (req, res) => {
  res.render('new', {
    title: 'New Article',
    article: new Article(),
    user: req.user,
  });
});

// get edit article page
router.get('/edit/:id', checkAuthenticated, async (req, res) => {
  const article = await Article.findById(req.params.id);

  res.render('edit', { title: 'Edit Article', article, user: req.user });
});

// create new article
router.post('/new', checkAuthenticated, async (req, res) => {
  const { title, author, description, markdown } = req.body;
  const user = req.user;

  const article = new Article({
    title,
    author,
    description,
    markdown,
    createdUsername: user.username,
  });

  const saveArticle = await article.save((err, result) => {
    if (err) {
      console.log(err);
      res.render('new', {
        title: 'New Article',
        article: new Article(),
        user,
      });
    } else {
      console.log('article successfully saved!' + saveArticle);
      res.redirect(`/blogs/view/${article.slug}`);
    }
  });
});

// post a comment
router.post('/view/:slug/comment', checkAuthenticated, async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
  const { comment } = req.body;

  const comments = new Comment({
    blogRef: article._id,
    author: req.user.username,
    comment,
  });

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

// post a reply
router.post(
  '/view/:slug/comment/:id/reply',
  checkAuthenticated,
  async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    const comment = await Comment.findById(req.params.id);
    const { replyComment } = req.body;

    const replies = new Reply({
      blogRef: article._id,
      commentRef: comment._id,
      author: req.user.username,
      replyComment,
    });

    const saveReply = await replies.save((err, result) => {
      if (err) {
        console.log('An error occurred during save ' + err);
        res.redirect(`/blogs/view/${article.slug}`);
      } else {
        console.log('reply successfully saved!' + result);
        res.redirect(`/blogs/view/${article.slug}`);
      }
    });
  }
);

// edit article
router.put('/edit/:id', checkAuthenticated, async (req, res) => {
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
router.put('/publish/:id', checkAuthenticated, async (req, res) => {
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
router.put('/view/:slug/comment/:id', checkAuthenticated, async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
  const userComment = await Comment.findById(req.params.id);
  const { comment } = req.body;

  userComment.comment = comment;

  const saveComment = await userComment.save((err, result) => {
    if (err) {
      console.log(err);
      res.redirect(`/blogs/view/${article.slug}`);
    } else {
      console.log('comment successfully saved!' + result);
      res.redirect(`/blogs/view/${article.slug}`);
    }
  });
});

// edit reply
router.put(
  '/view/:slug/comment/:id/reply/:id',
  checkAuthenticated,
  async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    const userComment = await Comment.findById(req.params.id);
    const reply = await Reply.findById(req.params.id);
    const { replyComment } = req.body;

    reply.replyComment = replyComment;

    const saveComment = await reply.save((err, result) => {
      if (err) {
        console.log(err);
        res.redirect(`/blogs/view/${article.slug}`);
      } else {
        console.log('comment successfully saved!' + result);
        res.redirect(`/blogs/view/${article.slug}`);
      }
    });
  }
);

// like comment
router.put(
  '/view/:slug/comment/:id/like',
  checkAuthenticated,
  async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    const comment = await Comment.findById(req.params.id);
    const user = req.user;

    let authorLikedAlready = false;
    let removeIndex = null;

    for (i = 0; i < comment.usersLiked.length; i++) {
      if (user.username == comment.usersLiked[i]) {
        authorLikedAlready = true;
        removeIndex = i;
      }
    }

    if (authorLikedAlready) comment.usersLiked.splice(removeIndex, 1);
    else comment.usersLiked.push(user.username);

    const saveComment = await comment.save((err, result) => {
      if (err) {
        console.log('An error occurred during save ' + err);
        res.redirect('/blogs');
      } else {
        console.log('article successfully saved!' + result);
        res.redirect(`/blogs/view/${article.slug}`);
      }
    });
  }
);

// like reply
router.put(
  '/view/:slug/comment/:id/reply/:id/like',
  checkAuthenticated,
  async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    const reply = await Reply.findById(req.params.id);
    const user = req.user;

    let authorLikedAlready = false;
    let removeIndex = null;

    for (i = 0; i < reply.usersLiked.length; i++) {
      if (user.username == reply.usersLiked[i]) {
        authorLikedAlready = true;
        removeIndex = i;
      }
    }

    if (authorLikedAlready) reply.usersLiked.splice(removeIndex, 1);
    else reply.usersLiked.push(user.username);

    const saveReply = await reply.save((err, result) => {
      if (err) {
        console.log('An error occurred during save ' + err);
        res.redirect(`/blogs/view/${article.slug}`);
      } else {
        console.log('reply successfully saved!' + result);
        res.redirect(`/blogs/view/${article.slug}`);
      }
    });
  }
);

// delete article
router.delete('/:id', checkAuthenticated, async (req, res) => {
  const article = await Article.findById(req.params.id);
  const comments = await Comment.find({ blogRef: article._id });

  for (i = 0; i < comments.length; i++) {
    await Reply.deleteMany({ commentRef: comments[i]._id });
  }
  await Comment.deleteMany({ blogRef: article._id });
  await Article.deleteOne(article);

  res.redirect('/blogs');
});

// delete comment
router.delete(
  '/view/:slug/comment/:id',
  checkAuthenticated,
  async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    const comment = await Comment.findById(req.params.id);

    await Reply.deleteMany({ commentRef: comment._id });
    await Comment.deleteOne(comment);

    res.redirect(`/blogs/view/${article.slug}`);
  }
);

// delete reply
router.delete(
  '/view/:slug/comment/:id/reply/:id',
  checkAuthenticated,
  async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    await Reply.findByIdAndDelete(req.params.id);

    res.redirect(`/blogs/view/${article.slug}`);
  }
);

module.exports = router;
