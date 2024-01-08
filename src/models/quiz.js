const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

const quizSchema = new mongoose.Schema({
  chatId: { type: String },
  title: { type: String },
  quizes: { type: Array },
})
quizSchema.plugin(timestamp)

const Quiz = mongoose.model('quiz', quizSchema)
module.exports = Quiz
