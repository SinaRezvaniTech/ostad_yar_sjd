const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

const answerSchema = new mongoose.Schema({
  answer: { type: String },
  name: { type: String },
  chatId: { type: String },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'quiz' },
})
answerSchema.plugin(timestamp)

const Answer = mongoose.model('answer', answerSchema)
module.exports = Answer
