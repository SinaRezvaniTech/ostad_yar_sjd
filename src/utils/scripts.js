const ConfigModel = require('../models/config')
const { default: axios } = require('axios')
const config = require('config')

const deleteExpiredConfigs = async () => {
  try {
    const currentDate = new Date()
    const threeDaysAgo = new Date(currentDate)
    threeDaysAgo.setDate(currentDate.getDate() - 3)

    const expiredConfigs = await ConfigModel.find({
      expireTime: { $lt: threeDaysAgo },
    })

    await Promise.all(
      expiredConfigs.map(async (service) => {
        const response = await axios.post(
          `https://${service.configString.subDomain.code}.${
            service.configString.subDomain.number
          }.${config.get('v2rayDomain')}:2083/login`,
          {
            username: config.get('v2rayAuth.username'),
            password: config.get('v2rayAuth.password'),
          }
        )

        const cookie = response.headers['set-cookie']

        await axios.post(
          `https://${service.configString.subDomain.code}.${
            service.configString.subDomain.number
          }.${config.get('v2rayDomain')}:2083/panel/api/inbounds/del/${
            service.inboundId
          }`,
          {},
          { headers: { Cookie: cookie.join('; ') } }
        )

        await ConfigModel.findOneAndDelete({ inboundId: service.inboundId })
      })
    )

    // console.log('عملیات حذف با موفقیت انجام شد.')
  } catch (error) {
    // console.error('خطا در عملیات حذف:', error)
  }
}

module.exports = {
  deleteExpiredConfigs,
}
