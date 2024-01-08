const controller = require('../controller')

//data
const texts = require('../../../data/texts.json')
const buttons = require('../../../data/buttons.json')
const config = require('config')
const { register } = require('../../../services/authServices')

module.exports = new (class extends controller {
  async myAccount({ bot, callbackQuery }) {}
})()
