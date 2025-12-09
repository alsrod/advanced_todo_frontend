import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/todos';

export const getTodos = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createTodo = async (todo) => {
    const response = await axios.post(API_URL, todo);
    return response.data;
};

export const updateTodo = async (id, todo) => {
    const response = await axios.put(`${API_URL}/${id}`, todo);
    return response.data;
};

export const deleteTodo = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
