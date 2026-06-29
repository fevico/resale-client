import axios from "axios"

export const baseURL = "http://172.26.223.246:8000"

const client = axios.create({baseURL})

export default client