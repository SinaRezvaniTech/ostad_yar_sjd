const { v4: uuidv4 } = require('uuid')
const crypto = require('crypto')
const config = require('config')
//DoesWalletHaveEnoughMoney  --------------------------------------
async function DoesWalletHaveEnoughMoney({ user, product }) {
  if (
    user.wallet >=
      product.price - parseFloat(user.cooperationDiscount) * product.price ||
    user.credit >=
      product.price -
        parseFloat(user.cooperationDiscount) * product.price +
        user.debt
  ) {
    return true
  } else {
    return false
  }
}
module.exports = {
  DoesWalletHaveEnoughMoney,
}
