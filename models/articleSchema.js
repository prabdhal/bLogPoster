const mongoose = require('mongoose');
const marked = require('marked'); // allows us to create a markdown and converts it into html
const slugify = require('slugify'); // allow use to convert article title into a url friendly slug
const createDomPurify = require('dompurify'); // sanitizes the html from malicious code
const { JSDOM } = require('jsdom'); // allows us to renders html inside of Node.js
const dompurify = createDomPurify(new JSDOM().window); // allows the dom purifier to create html and purify it by using this jsdom window object

const articleSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  markdown: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  sanitizedHtml: {
    type: String,
    required: true,
  },
  published: {
    type: Boolean,
    default: false,
  },
});

articleSchema.pre('validate', function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  if (this.markdown) {
    this.sanitizedHtml = dompurify.sanitize(marked(this.markdown));
  }

  next();
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
