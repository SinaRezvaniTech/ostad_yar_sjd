const autoBind = require('auto-bind')
const { validationResult } = require('express-validator')

//models
const Quiz = require('../models/quiz')
const Answer = require('../models/answer')

module.exports = class {
  constructor() {
    autoBind(this)
    this.Quiz = Quiz
    this.Answer = Answer
  }

  validationBody(req, res) {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      const errors = result.array()
      const message = []
      errors.forEach((err) => message.push(err.msg))
      res.status(400).json({
        message: 'validation error',
        data: message,
      })
      return false
    }
    return true
  }

  validate(req, res, next) {
    if (!this.validationBody(req, res)) {
      return
    }

    next()
  }

  response({ res, message, code = 200, data = {} }) {
    return res.status(code).json({
      message,
      data,
    })
  }
}
