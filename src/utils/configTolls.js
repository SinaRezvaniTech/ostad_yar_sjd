const { v4: uuidv4 } = require('uuid')
const crypto = require('crypto')
const config = require('config')

//find best server
async function findBestServer({ Config, serverCode }) {
  let serverConfigs = await Config.aggregate([
    {
      $lookup: {
        from: 'products',
        localField: 'product',
        foreignField: '_id',
        as: 'product_info',
      },
    },
    {
      $unwind: '$product_info',
    },
    {
      $match: {
        'configString.subDomain.code': `${serverCode}`, // شرط بر اساس subDomain.code
      },
    },
    {
      $group: {
        _id: '$configString.subDomain.number',
        totalUserLimit: { $sum: '$product_info.userLimit' },
      },
    },
    {
      $project: {
        numberDomain: '$_id',
        totalUserLimit: 1,
        _id: 0,
      },
    },
  ])

  let bestServer = serverConfigs[0]
  for (let i = 1; i < serverConfigs.length; i++) {
    const currentServer = serverConfigs[i]

    if (currentServer.totalUserLimit < bestServer.totalUserLimit) {
      bestServer = currentServer
    }
  }

  return bestServer
}
//port generator --------------------------------------
async function generateRandomPort(Config) {
  let port
  do {
    port = Math.floor(Math.random() * (57000 - 10000 + 1) + 1000)
  } while (
    [2083, 443, 2084, 80].includes(port) ||
    (await isPortUsed(port, Config))
  )

  return port
}
async function isPortUsed(port, Config) {
  let config = await Config.findOne({
    'configString.port': port,
  })
  if (config) {
    return true
  }

  return false
}

//inbound id generator -------------------------------------
async function generateInboundId(Config) {
  let id
  do {
    id = Math.floor(Math.floor(Math.random() * 100000) + 1)
  } while (id == 2082 || (await isidUsed(id, Config)))

  return id
}
async function isidUsed(id, Config) {
  let config = await Config.findOne({
    inboundId: id,
  })
  if (config) {
    return true
  }

  return false
}

//addMonthsToDate --------------------------------------
function addMonthsToDate(months) {
  const currentDate = new Date()
  currentDate.setMonth(currentDate.getMonth() + parseFloat(months))
  return currentDate.getTime()
}
//add 24 h --------------------------------------
function add24HoursToDate() {
  const currentDate = new Date()
  currentDate.setDate(currentDate.getDate() + 1) // اضافه کردن یک روز

  return currentDate.getTime()
}
//short id ------------------------------------------------------------
function generateShortUUID() {
  const validChars = '0123456789ABCDEF'
  let uuid = ''

  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * 16)
    uuid += validChars.charAt(randomIndex)
  }

  return uuid
}

//configUrlGenerator TODO --------------------------------

function configUrlGenerator({ data, product, remark }) {
  //base url
  const baseUrl = `${data.configString.subDomain.code}.${
    data.configString.subDomain.number
  }.${config.get('v2rayDomain')}`

  //remark finalyRemark
  const finalyRemark = product
    ? `${
        product.volume == 'unlimit' ? product.volume : `${product.volume} GB`
      } | ${data.inboundId}`
    : `${remark}`

  //returning config

  return (
    `vless://` + // static *
    data.configString.clientId + //clientId
    `@` + // static *
    baseUrl + // baseUrl
    `:${data.configString.port}` + // port
    '?type=tcp' + // static *
    '&flow=xtls-rprx-vision' + // static *
    '&encryption=none' + // static *
    `&security=${data.configString.security}` + // security
    '&fp=chrome' + // static *
    `&pbk=${data.configString.pbk}` + // pbk
    `&sni=${baseUrl}` + // static *
    `&sid=${data.configString.sid}` + // sid
    '&spx=%2F' + // static *
    `#${finalyRemark}` // finalyRemark
  )
}
//isDateMoreThan30DaysAhead --------------------------------

function isDateMoreThanXDaysAhead(targetDate, days) {
  const currentDate = new Date()
  const timeDifferenceInMs = targetDate.getTime() - currentDate.getTime()
  const daysDifference = timeDifferenceInMs / (1000 * 3600 * 24)

  return daysDifference > days
}
module.exports = {
  generateRandomPort,
  isDateMoreThanXDaysAhead,
  generateInboundId,
  addMonthsToDate,
  generateShortUUID,
  add24HoursToDate,
  configUrlGenerator,
  findBestServer,
}
