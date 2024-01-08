const TelegramBot = require('node-telegram-bot-api')
const config = require('config')
const autoBind = require('auto-bind')
module.exports = class {
  constructor() {
    autoBind(this)
    
  }
}
