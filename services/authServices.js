const http = require('./httpService')
const config = require('config')

const register = (data) => {
  return http.post(`${config.get('baseUrl')}/api/user/login`, data, {
    headers: {
      Authorization: `Bearer ${config.get('acces-token')}`,
    },
  })
}

const isLoginAdmin = () => {
  return http.get(`${config.get('baseUrl')}/api/admin/islogin`, {
    headers: {
      Authorization: `Bearer ${config.get('acces-token')}`,
    },
  })
}

module.exports = {
  register,
}
