const http = require('./httpService')
const config = require('config')

const myAccount = (data) => {
  return http.get(`${config.get('baseUrl')}/api/user/myaccount?id=${data}`, {
    headers: {
      Authorization: `Bearer ${config.get('acces-token')}`,
    },
  })
}

const myServices = (data) => {
  return http.get(
    `${config.get('baseUrl')}/api/user/myservices?chatid=${data.chatId}`,
    {
      headers: {
        Authorization: `Bearer ${config.get('acces-token')}`,
      },
    }
  )
}
const servers = () => {
  return http.get(`${config.get('baseUrl')}/api/user/servers`, {
    headers: {
      Authorization: `Bearer ${config.get('acces-token')}`,
    },
  })
}

const myService = (data) => {
  return http.get(
    `${config.get('baseUrl')}/api/user/mysingleservice?chatid=${
      data.chatId
    }&inboundid=${data.inboundId}`,
    {
      headers: {
        Authorization: `Bearer ${config.get('acces-token')}`,
      },
    }
  )
}

const products = (data) => {
  return http.get(`${config.get('baseUrl')}/api/user/products?chatid=${data}`, {
    headers: {
      Authorization: `Bearer ${config.get('acces-token')}`,
    },
  })
}

const getImageFromTelegram = (telegramFileUrl) => {
  return http.get(telegramFileUrl, {
    headers: {
      responseType: 'blob',
    },
  })
}

//posts-------------------------------------------------------------
const updateProfile = (data) => {
  return http.post(`${config.get('baseUrl')}/api/user/update/profile`, data, {
    headers: {
      Authorization: `Bearer ${config.get('acces-token')}`,
    },
  })
}
const getTestConfig = (data) => {
  return http.post(`${config.get('baseUrl')}/api/user/testconfig`, data, {
    headers: {
      Authorization: `Bearer ${config.get('acces-token')}`,
    },
  })
}

const changeLocation = (data) => {
  return http.post(`${config.get('baseUrl')}/api/user/change/location`, data, {
    headers: {
      Authorization: `Bearer ${config.get('acces-token')}`,
    },
  })
}
const byConfig = (data) => {
  return http.post(`${config.get('baseUrl')}/api/user/byconfig`, data, {
    headers: {
      Authorization: `Bearer ${config.get('acces-token')}`,
    },
  })
}
const extentionConfig = (data) => {
  return http.post(`${config.get('baseUrl')}/api/user/extention`, data, {
    headers: {
      Authorization: `Bearer ${config.get('acces-token')}`,
    },
  })
}
const uploadPayment = (data) => {
  return http.post(`${config.get('baseUrl')}/api/user/create/payment`, data, {
    headers: {
      Authorization: `Bearer ${config.get('acces-token')}`,
      'Content-Type': 'multipart/form-data',
    },
  })
}
const createTicket = (data) => {
  return http.post(`${config.get('baseUrl')}/api/user/create/ticket`, data, {
    headers: {
      Authorization: `Bearer ${config.get('acces-token')}`,
    },
  })
}

module.exports = {
  myAccount,
  updateProfile,
  myService,
  myServices,
  getTestConfig,
  servers,
  changeLocation,
  products,
  byConfig,
  extentionConfig,
  uploadPayment,
  getImageFromTelegram,
  createTicket,
}
