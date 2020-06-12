
const axios = require('axios')
const utils = require('./../utils/utils.js')

class HttpProvider {
  constructor(host, username = false, password = false, headers = {}, timeout = 30000) {
    if (!utils.isValidURL(host)) throw new Error('Invalid URL provided to HttpProvider');
    this.instance = axios.create({
      baseURL: host,
      timeout,
      headers,
      auth: {
        username,
        password,
      },
    })
  }

  async request(url, payload = {}, method = 'get') {
    const res = await this.instance.request({
      data: null,
      params: payload,
      url,
      method: method.toLowerCase(),
    })
    return res
  }
}


module.exports = HttpProvider
