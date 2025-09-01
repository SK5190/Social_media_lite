import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true,
});

export const registerUser = (userData) => API.post('/auth/register', userData);
export const loginUser = (userData) => API.post('/auth/login', userData);
export const createPost = (postData) => API.post('/post', postData);
export const getAllPosts = () => API.get('/post');
export const deletePost = (id) => API.delete(`/post/${id}`);

export default API;
