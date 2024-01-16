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
  bot.sendMessage(msg.chat.id, texts.start, {
    reply_markup: {
      inline_keyboard: buttons.start,
    },
  })
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

      bot.once('text', function myF(msg) {
        admin.createQ({ title: msg.text, chatId: msg.chat.id })

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
      })

      //send response
      if (listMyQ.length == 0) {
        bot.sendMessage(
          callbackQuery.from.id,
          ' شما هیچ ازمونی ثبت نکردید! \n /start'
        )
      } else {
        bot.sendMessage(callbackQuery.from.id, 'لیست آزمون های شما', {
          reply_markup: {
            inline_keyboard: arrListQ,
          },
        })
      }

      //delete buttons after navigate
      bot.deleteMessage(
        callbackQuery.message.chat.id,
        callbackQuery.message.message_id
      )

      break
    //quiz_setting ---------------------------------------
    case 'quiz_setting':
      const showQuizes = async () => {
        let myQ = await admin.singleQ({ id: callbackQuery.data.split(' ')[1] })
        //send response
        bot.sendMessage(
          callbackQuery.from.id,
          `✅ لیست سوالات: \n ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖ \n\n ${
            myQ
              ? myQ.quizes.map((i, index) => {
                  return `\n شماره ${index + 1} : ${i} \n`
                })
              : 'سوالی موجود نیست'
          } \n\n برای افزودن سوال  به لیست یک سوال ارسال کنید و برای بازگشت به منو /cancel را  فشار دهید و یا ارسال کنید \n\n🗑  برای پاک کردن این ازمون روی  /remove کلیک کنید \n\n 👁 برای نمایش ازمون دهندگان روی /showAnswers کلیک کنید \n\n ✅ برای به اشتراک گزاری این آزمون این کد را به دیگران بدهید تا در قسمت پیوستن در ازمون کلیک کنند و وارد ازمون شما شوند :\n\n ${
            myQ.id
          }`
        )
      }
      showQuizes()
      //delete buttons after navigate
      bot.deleteMessage(
        callbackQuery.message.chat.id,
        callbackQuery.message.message_id
      )

      bot.on('text', async function myF(msg) {
        if (msg.text == '/cancel') {
          bot.off('text', myF)
          bot.sendMessage(callbackQuery.from.id, texts.start, {
            reply_markup: {
              inline_keyboard: buttons.start,
            },
          })
        } else if (msg.text == '/remove') {
          bot.off('text', myF)
          await admin.deleteQ({
            id: callbackQuery.data.split(' ')[1],
          })
          bot.sendMessage(callbackQuery.from.id, '✅ ازمون با موفقیت پاک شد')
          bot.sendMessage(callbackQuery.from.id, texts.start, {
            reply_markup: {
              inline_keyboard: buttons.start,
            },
          })
        } else if (msg.text == '/showAnswers') {
          bot.off('text', myF)
          let listMyA = await admin.listA({
            id: callbackQuery.data.split(' ')[1],
          })
          if (listMyA.length == 0) {
            bot.sendMessage(
              callbackQuery.from.id,
              `هیچ کس در ازمون شما شرکت نکرده!`
            )
          }
          listMyA.map((i) => {
            bot.sendMessage(
              callbackQuery.from.id,
              `✅ نام : ${i.name} \n\n جواب ها ---------> \n ${i.answer}`
            )
          })

          bot.sendMessage(callbackQuery.from.id, texts.start, {
            reply_markup: {
              inline_keyboard: buttons.start,
            },
          })
        } else {
          await admin.addToQ({
            text: msg.text,
            id: callbackQuery.data.split(' ')[1],
          })
          showQuizes()
        }
      })
      break
    //join_q ---------------------------------------
    case 'join_q':
      bot.sendMessage(
        callbackQuery.from.id,
        '🔎 ای دی کوییز را برای پیوستن به آن وارد کنید'
      )
      bot.once('text', async function myF(msg) {
        //vars
        let myName = ''
        let myAns = ''
        let quizId = msg.text

        let mySingleQ = await admin.singleQ({ id: msg.text })
        if (mySingleQ) {
          bot.sendMessage(
            callbackQuery.from.id,
            'نام و نام خانوادگی خود را وارد کنید :'
          )
          bot.once('text', async function getName(msg) {
            //fill name
            myName = msg.text
            bot.sendMessage(
              callbackQuery.from.id,
              `✅ لیست سوالات: \n ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖ \n\n ${
                mySingleQ
                  ? mySingleQ.quizes.map((i, index) => {
                      return `\n شماره ${index + 1} : ${i} \n`
                    })
                  : 'سوالی موجود نیست'
              } \n\n جواب های خود را در قالب یک پیام ارسال کنید. مثال: \n\n جواب سوال۱ : این یک جواب تستی است \n جواب سوال ۲ :‌این یک جواب تستی است `
            )
            bot.once('text', async function getAns(msg) {
              await admin.createA({
                name: myName,
                quiz: quizId,
                chatId: msg.chat.id,
                answer: msg.text,
              })

              bot.sendMessage(
                callbackQuery.from.id,
                'جواب ها ارسال شدند. باتشکر'
              )
              bot.sendMessage(callbackQuery.from.id, texts.start, {
                reply_markup: {
                  inline_keyboard: buttons.start,
                },
              })
            })
          })
        } else {
          //----------------------------------------------------------
          bot.off('text', myF)
          bot.sendMessage(callbackQuery.from.id, 'ازمونی یافت نشد!')
          bot.sendMessage(callbackQuery.from.id, texts.start, {
            reply_markup: {
              inline_keyboard: buttons.start,
            },
          })
        }
      })
      break
    default:
      break
  }
})
