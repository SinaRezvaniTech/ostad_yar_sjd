const myAccount = require('./myAccount')
const referralHandler = require('./referralHandler')
const registerUser = require('./registerUser')

module.exports = {
  myAccount: myAccount.myAccount,
  referralHandler: referralHandler.referralHandler,
  registerUser: registerUser.registerUser,
}
