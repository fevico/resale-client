import axios from "axios"

export const baseURL = "http://10.225.240.246:8000"

const client = axios.create({baseURL})

export default client