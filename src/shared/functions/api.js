import Axios from 'axios'

export const baseURL = `${window.location.origin}/api`

const axios = Axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

axios.interceptors.request.use(
  async (config) => {
    const updatedConfig = {
      ...config,
      headers: {
        ...config.headers,
      },
    }

    return updatedConfig
  },
  (error) => {
    // Do something with request error
    Promise.reject(error)
  },
)

const baseConfig = {
  method: 'get',
}

const api = (url, options = {}, config = {}) => {
  const mergedConfig = { ...baseConfig, ...config }

  return axios({
    ...mergedConfig,
    params: options,
    url,
  })
}

export default api
