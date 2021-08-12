import Axios from 'axios';
import env from "react-dotenv";

export const axiosAPI = Axios.create({
    baseURL: `${env.API_URL}`
});

export const axiosStock = Axios.create({
    baseURL: `${env.SPHINX_API_URL}`
});