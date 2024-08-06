const mongoose = require('mongoose')
const marked = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  markdown: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  sanitizedHtml: {
    type: String,
    required: true
  }
})

articleSchema.pre('validate', function(next) {
  // adds id to each and every article to make it easy to identify
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }

  // sanitizes the markdown field of the document to prevent any potentially malicious HTML code or script injection
  if (this.markdown) {
    this.sanitizedHtml = dompurify.sanitize(this.markdown)
  }

  next()
})

module.exports = mongoose.model('Article', articleSchema)