const controller = require('../controller')

//data
const texts = require('../../../data/texts.json')
const buttons = require('../../../data/buttons.json')
const config = require('config')
const { register } = require('../../../services/authServices')
module.exports = new (class extends controller {
  async registerUser({ bot, msg, refrral }) {
    // register({ chatId: msg.chat.id, refrral })
    //   .then((res) => {})
    //   .catch((err) => {
    //     console.log(err)
    //   })
  }
})()
