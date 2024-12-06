const API_URL = process.env.REACT_APP_API_URL;

export const Api = (() => {
    let accessToken = null;

    const setAccessToken = (token) => {
        accessToken = token;
    };

    const request = async (endpoint, options = {}) => {
        const headers = options.headers || {};
        headers['Accept'] = 'application/json';

        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }

        if (options.body && !(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        const config = {
            ...options,
            headers,
        };

        const url = `${API_URL}${endpoint}`;

        try {
            const response = await fetch(url, config);

            if (response.status === 204) {
                return null;
            }

            const contentType = response.headers.get('Content-Type');
            let data;
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                const text = await response.text();
                throw new Error(`Неожиданный формат ответа: ${text}`);
            }

            if (!response.ok) {
                throw new Error(data.detail || `Ошибка сервера: ${response.status} ${response.statusText}`);
            }

            return data;
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error.message);
            throw error;
        }
    };

    const getRelativePath = (url) => {
        try {
            const parsedUrl = new URL(url);
            return parsedUrl.pathname.replace(/^\/api/, '') + parsedUrl.search;
        } catch (error) {
            console.error('Неверный URL:', url);
            return null;
        }
    };

    // AUTHENTICATION
    const login = async (username, password) => {
        return request('/auth/', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
    };

    const register = async (userData) => {
        const formData = new FormData();
        Object.keys(userData).forEach(key => {
            if (userData[key] !== undefined && userData[key] !== null) {
                formData.append(key, userData[key]);
            }
        });
        return request('/register/', {
            method: 'POST',
            body: formData,
        });
    };

    const getCurrentUser = async () => {
        return request('/user/current/', { method: 'GET' });
    };

    const updateUser = async (userId, userData) => {
        const formData = new FormData();
        Object.keys(userData).forEach(key => {
            if (userData[key] !== undefined && userData[key] !== null) {
                formData.append(key, userData[key]);
            }
        });
        return request(`/user/${userId}/`, {
            method: 'PATCH',
            body: formData,
        });
    };

    // CHATS
    const getChats = async (pageSize = 100) => {
        let allChats = [];
        let nextUrl = `/chats/?page_size=${pageSize}`;
        while (nextUrl) {
            try {
                const data = await request(nextUrl, { method: 'GET' });
                allChats = allChats.concat(data.results);
                nextUrl = data.next ? getRelativePath(data.next) : null;
            } catch (error) {
                console.error('Ошибка при получении чатов:', error);
                break;
            }
        }
        return allChats;
    };

    const getChat = async (chatId) => {
        return request(`/chat/${chatId}/`, { method: 'GET' });
    };

    const createChat = async (chatData) => {
        return request('/chats/', {
            method: 'POST',
            body: JSON.stringify(chatData),
        });
    };

    const deleteChat = async (chatId) => {
        return request(`/chat/${chatId}/`, { method: 'DELETE' });
    };

    // MESSAGES
    const getMessages = async (chatId, limit = 50) => {
        let allMessages = [];
        let nextUrl = `/messages/?chat=${chatId}&limit=${limit}`;
        while (nextUrl) {
            try {
                const data = await request(nextUrl, { method: 'GET' });
                allMessages = allMessages.concat(data.results);
                nextUrl = data.next ? getRelativePath(data.next) : null;
            } catch (error) {
                console.error('Ошибка при получении сообщений:', error);
                break;
            }
        }
        return allMessages;
    };

    const sendMessage = async (messageData, isFormData = false) => {
        return request('/messages/', {
            method: 'POST',
            body: isFormData ? messageData : JSON.stringify(messageData),
        });
    };

    const deleteMessage = async (messageId) => {
        return request(`/message/${messageId}/`, { method: 'DELETE' });
    };

    const editMessage = async (messageId, messageData) => {
        return request(`/message/${messageId}/`, {
            method: 'PATCH',
            body: JSON.stringify(messageData),
        });
    };

    // USERS
    const getUsers = async (pageSize = 100) => {
        let allUsers = [];
        let nextUrl = `/users/?page_size=${pageSize}`;
        while (nextUrl) {
            try {
                const data = await request(nextUrl, { method: 'GET' });
                allUsers = allUsers.concat(data.results);
                nextUrl = data.next ? getRelativePath(data.next) : null;
            } catch (error) {
                console.error('Ошибка при получении списка пользователей:', error);
                break;
            }
        }
        return allUsers;
    };

    return {
        setAccessToken,
        login,
        register,
        getCurrentUser,
        updateUser,
        getChats,
        getChat,
        createChat,
        deleteChat,
        getMessages,
        sendMessage,
        deleteMessage,
        editMessage,
        getUsers,
    };
})();
