import axios from "axios"

const baseURL = "http://10.125.249.246:8000"

const client = axios.create({baseURL})

export default client