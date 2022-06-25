import axios from 'axios'

import { API_ENDPOINT } from 'Utils/constants'

export const apiInstance = axios.create({
  baseURL: API_ENDPOINT
})
