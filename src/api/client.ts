import axios from "axios"

export const baseURL = "http://10.54.201.246:8000" 

const client = axios.create({baseURL})

export default client