const controller = require('../controller')

//data
const texts = require('../../../data/texts.json')
const buttons = require('../../../data/buttons.json')
const config = require('config')
const { register } = require('../../../services/authServices')
module.exports = new (class extends controller {
  async referralHandler({ bot, callbackQuery }) {
    // const refralAddress = `https://t.me/openline_network_bot?start=${callbackQuery.message.chat.id}`
    // let refralsCount = 0
    // let verifyedRefralsCount = 0
    // //if user had refrrals
    // myAccount(callbackQuery.message.chat.id)
    //   .then((res) => {
    //     if (res.data.data.refrrals) {
    //       refralsCount = res.data.data.refrrals.length
    //       //verifyed refrrals
    //       res.data.data.refrrals.map((r) => {
    //         if (r.hadDeposit) {
    //           verifyedRefralsCount = verifyedRefralsCount + 1
    //         }
    //       })
    //       bot.sendMessage(
    //         callbackQuery.message.chat.id,
    //         `${texts.my_refral_link_title} \n ${texts.my_refral_number} ${refralsCount} \n ${texts.my_refral_number_verifyed} ${verifyedRefralsCount} \n\n ${texts.my_refral_address} \n <code>${refralAddress}</code>`,
    //         {
    //           reply_markup: {
    //             inline_keyboard: [
    //               [
    //                 {
    //                   text: '🔙 بازگشت به منوی اصلی',
    //                   callback_data: 'back_to_menu',
    //                 },
    //               ],
    //             ],
    //           },
    //           parse_mode: 'HTML',
    //         }
    //       )
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err)
    //   })
  }
})()
