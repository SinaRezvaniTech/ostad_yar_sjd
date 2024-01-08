const axios = require('axios')
const { v4: uuidv4 } = require('uuid')
const _ = require('lodash')
const jwt = require('jsonwebtoken')
//os
const os = require('node-os-utils')
//moment
const moment = require('moment')
const momentRange = require('moment-range')
const Moment = momentRange.extendMoment(moment)
//bot init
const TelegramBot = require('node-telegram-bot-api')
// classes
const controller = require('../controller')
const config = require('config')
const { default: mongoose } = require('mongoose')

module.exports = new (class extends controller {
  async AQ(req, res) {
    const a = new this.Answer({
      name: req.name,
      answer: req.answer,
      quiz: req.quiz,
    })

    await a.save()
  }

  async joinQ(req, res) {
    let quiz = await this.Quiz.findOne({ _id: req.id })
    return quiz
  }
})()
