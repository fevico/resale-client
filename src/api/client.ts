import axios from "axios"

const baseURL = "http://10.21.203.246:8000"

const client = axios.create({baseURL})

export default client