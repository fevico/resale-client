import axios from "axios"

export const baseURL = "http://10.69.247.246:8000"

const client = axios.create({baseURL})

export default client