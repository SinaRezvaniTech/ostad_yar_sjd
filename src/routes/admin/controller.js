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
  async createQ(req, res) {
    const q = new this.Quiz({
      title: req.title,
      chatId: req.chatId,
    })

    await q.save()
  }

  async deleteQ(req, res) {
    let quiz = await this.Quiz.findOne({ _id: req.id })
    if (quiz) {
      await quiz.remove()
    }
  }

  async addToQ(req, res) {
    let quiz = await this.Quiz.findOne({ _id: req.id })
    if (quiz) {
      let quizes = quiz.quizes
      quizes.push(req.text)
      quiz.set({
        quizes,
      })
      await quiz.save()
    }
  }
  async listQ(req, res) {
    let quiz = await this.Quiz.find({ chatId: req.chatId })
    return quiz
  }

  async listA(req, res) {
    let answers = await this.Answer.find({ quiz: req.id })
    return answers
  }

  async singleQ(req, res) {
    let quiz = await this.Quiz.findOne({ _id: req.id })
    return quiz
  }
  async createA(req, res) {
    const a = new this.Answer({
      name: req.name,
      chatId: req.chatId,
      quiz: req.quiz,
      answer: req.answer,
    })

    await a.save()
  }
})()
