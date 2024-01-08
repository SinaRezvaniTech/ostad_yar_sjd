const debug = require('debug')('app:main')
const mongoose = require('mongoose')
const config = require('config')

const TelegramBot = require('node-telegram-bot-api')
const fs = require('fs')
//data
const texts = require('./data/texts.json')
const buttons = require('./data/buttons.json')
//bot init
const bot = new TelegramBot(config.get('botToken'), { polling: true })

//For connect to the mongose DB
// DeprecationWarning: Mongoose: the `strictQuery` option will be switched back to `false` by default in Mongoose 7. Use `mongoose.set('strictQuery', false);` if you want to prepare for this change. Or use `mongoose.set('strictQuery', true);
mongoose.set('strictQuery', false)
mongoose
  // .connect(config.get('db.address'))
  .connect(config.get('db.address'), config.get('db.auth'))
  .then(() => {
    console.log('connected to mongodb ;)')
  })
  .catch((ex) => {
    console.log(`mongodb could not connect! error:${ex}`)
  })

//-----------------------------------------------------------------------------------

// controllers
const admin = require('./src/routes/admin')
const user = require('./src/routes/user')
//listeners ____________________________________________________________
bot.onText(/\/start/, async (msg) => {
  bot.sendMessage(msg.chat.id, `❤️ به ربات آزمون ساز سجاد خوش آمدید`)
})

bot.on('callback_query', async (callbackQuery) => {
  switch (callbackQuery.data.split(' ')[0]) {
    //back to menu ---------------------------------------
    case 'back_to_menu':
      //send response
      bot.sendMessage(callbackQuery.from.id, texts.start, {
        reply_markup: {
          inline_keyboard: buttons.start,
        },
      })

      //delete buttons after navigate
      bot.deleteMessage(
        callbackQuery.message.chat.id,
        callbackQuery.message.message_id
      )

      bot.off('text')

      break
    //create_q ---------------------------------------
    case 'create_q':
      //send response
      bot.sendMessage(callbackQuery.from.id, 'لطفا عنوان ازمون را وارد کنید')

      //delete buttons after navigate
      bot.deleteMessage(
        callbackQuery.message.chat.id,
        callbackQuery.message.message_id
      )

      bot.once('text', (msg) => {
        admin.createQ({ title: msg.text })

        bot.sendMessage(
          callbackQuery.from.id,
          'ازمون ایجاد شد. برای ایجاد سوالات ازمون روی ازمون های من کلیک کنید و سوالات را به ازمون خود اضافه کنید \n /start'
        )
      })

      break

    //my_q ---------------------------------------
    case 'my_q':
      let listMyQ = await admin.listQ({ chatId: callbackQuery.message.chat.id })
      let arrListQ = []
      listMyQ.map((i) => {
        arrListQ.push([
          {
            text: i.title,
            callback_data: `quiz_setting ${i.id}`,
          },
        ])
      }),
        //send response
        bot.sendMessage(callbackQuery.from.id, 'لیست آزمون های شما', {
          reply_markup: {
            inline_keyboard: [arrListQ],
          },
        })

      //delete buttons after navigate
      bot.deleteMessage(
        callbackQuery.message.chat.id,
        callbackQuery.message.message_id
      )

      bot.once('text', (msg) => {
        title = msg.text

        bot.sendMessage(
          callbackQuery.from.id,
          'ازمون ایجاد شد. برای ایجاد سوالات ازمون روی ازمون های من کلیک کنید و سوالات را به ازمون خود اضافه کنید \n /start'
        )
      })

      break
    default:
      break
  }
})
