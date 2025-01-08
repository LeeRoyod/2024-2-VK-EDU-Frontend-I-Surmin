import {
    ILoginRequest,
    ILoginResponse,
    IRegisterRequest,
    IRegisterResponse,
    IRefreshTokenRequest,
    IRefreshTokenResponse,
    IUser,
    IMessage,
    IChat,
    IPagedResponse
} from './types'

const API_URL = process.env.REACT_APP_API_URL

export class Api {
    private static accessToken: string | null = null

    public static setAccessToken (token: string) {
        Api.accessToken = token
    }

    private static async request <T> (endpoint: string, options: RequestInit = {}): Promise<T> {
        const headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
        headers.set('Accept', 'application/json')

        if (Api.accessToken) {
            headers.set('Authorization', `Bearer ${Api.accessToken}`)
        }

        if (options.body && !(options.body instanceof FormData)) {
            headers.set('Content-Type', 'application/json')
        }

        const config: RequestInit = {
            ...options,
            headers
        }

        const url = `${API_URL}${endpoint}`

        try {
            const response = await fetch(url, config)

            if (response.status === 204) {
                return null as T
            }

            const contentType = response.headers.get('Content-Type')
            if (contentType && contentType.includes('application/json')) {
                const data = (await response.json()) as T
                if (!response.ok) {
                    throw new Error((data as any).detail || `Ошибка сервера: ${response.status} ${response.statusText}`)
                }
                return data
            } else {
                const text = await response.text()
                throw new Error(`Неожиданный формат ответа: ${text}`)
            }
        } catch (error: any) {
            console.error('Ошибка при выполнении запроса:', error.message)
            throw error
        }
    }

    // ============================
    // ========== AUTH ============
    // ============================

    public static async login (username: string, password: string): Promise<ILoginResponse> {
        const body: ILoginRequest = { username, password }
        return Api.request<ILoginResponse>('/auth/', {
            method: 'POST',
            body: JSON.stringify(body)
        })
    }

    public static async register (userData: IRegisterRequest): Promise<IRegisterResponse> {
        const formData = new FormData()
        Object.keys(userData).forEach(key => {
            const value = (userData as any)[key]
            if (value !== undefined && value !== null) {
                formData.append(key, value)
            }
        })

        return Api.request<IRegisterResponse>('/register/', {
            method: 'POST',
            body: formData
        })
    }

    public static async refreshToken (refresh: string): Promise<IRefreshTokenResponse> {
        const body: IRefreshTokenRequest = { refresh }
        return Api.request<IRefreshTokenResponse>('/auth/refresh/', {
            method: 'POST',
            body: JSON.stringify(body)
        })
    }

    public static async getCurrentUser (): Promise<IUser> {
        return Api.request<IUser>('/user/current/', { method: 'GET' })
    }

    public static async updateUser (
        userId: string,
        userData: Partial<IRegisterRequest>
    ): Promise<IUser> {
        const formData = new FormData()
        Object.keys(userData).forEach(key => {
            const value = (userData as any)[key]
            if (value !== undefined && value !== null) {
                formData.append(key, value)
            }
        })

        return Api.request<IUser>(`/user/${userId}/`, {
            method: 'PATCH',
            body: formData
        })
    }

    public static async setUserOnline (): Promise<void> {
        if (!Api.accessToken) {
            throw new Error('Нет accessToken. Невозможно установить онлайн-статус.')
        }
        const url = `${API_URL}/user/online/`
        const res = await fetch(url, {
            method: 'HEAD',
            headers: {
                Authorization: `Bearer ${Api.accessToken}`
            }
        })
        if (!res.ok) {
            throw new Error(`Ошибка установки онлайн статуса: ${res.status}`)
        }
    }

    // ============================
    // ========= CHATS ============
    // ============================

    public static async getChats (pageSize = 100): Promise<IChat[]> {
        let allChats: IChat[] = []
        let nextUrl: string | null = `/chats/?page_size=${pageSize}`

        while (nextUrl) {
            try {
                const data: IPagedResponse<IChat> = await Api.request<IPagedResponse<IChat>>(nextUrl, { method: 'GET' })
                allChats = [...allChats, ...data.results]
                nextUrl = data.next ? Api.getRelativePath(data.next) : null
            } catch (error) {
                console.error('Ошибка при получении чатов:', error)
                break
            }
        }
        return allChats
    }

    public static async getChat (chatId: string): Promise<IChat> {
        return Api.request<IChat>(`/chat/${chatId}/`, { method: 'GET' })
    }

    public static async createChat (chatData: Partial<IChat>): Promise<IChat> {
        return Api.request<IChat>('/chats/', {
            method: 'POST',
            body: JSON.stringify(chatData)
        })
    }

    public static async deleteChat (chatId: string): Promise<null> {
        return Api.request<null>(`/chat/${chatId}/`, { method: 'DELETE' })
    }

    // ============================
    // ======== MESSAGES ==========
    // ============================

    public static async getMessages (chatId: string, limit = 50): Promise<IMessage[]> {
        let allMessages: IMessage[] = []
        let nextUrl: string | null = `/messages/?chat=${chatId}&limit=${limit}`

        while (nextUrl) {
            try {
                const data: IPagedResponse<IMessage> = await Api.request<IPagedResponse<IMessage>>(nextUrl, { method: 'GET' })
                allMessages = [...allMessages, ...data.results]
                nextUrl = data.next ? Api.getRelativePath(data.next) : null
            } catch (error) {
                console.error('Ошибка при получении сообщений:', error)
                break
            }
        }
        return allMessages
    }

    public static async sendMessage (messageData: FormData | Record<string, any>): Promise<IMessage> {
        let options: RequestInit
        if (messageData instanceof FormData) {
            options = {
                method: 'POST',
                body: messageData
            }
        } else {
            options = {
                method: 'POST',
                body: JSON.stringify(messageData)
            }
        }
        return Api.request<IMessage>('/messages/', options)
    }

    public static async deleteMessage (messageId: string): Promise<null> {
        return Api.request<null>(`/message/${messageId}/`, { method: 'DELETE' })
    }

    public static async editMessage (
        messageId: string,
        messageData: { text: string }
    ): Promise<IMessage> {
        return Api.request<IMessage>(`/message/${messageId}/`, {
            method: 'PATCH',
            body: JSON.stringify(messageData)
        })
    }

    public static async readMessage (messageId: string): Promise<null> {
        return Api.request<null>(`/message/${messageId}/read/`, { method: 'POST' })
    }

    public static async readAllMessages (chatId: string): Promise<null> {
        return Api.request<null>(`/messages/read_all/?chat=${chatId}`, {
            method: 'POST'
        })
    }

    // ============================
    // ========= USERS ============
    // ============================

    public static async getUsers (pageSize = 100): Promise<IUser[]> {
        let allUsers: IUser[] = []
        let nextUrl: string | null = `/users/?page_size=${pageSize}`

        while (nextUrl) {
            try {
                const data: IPagedResponse<IUser> = await Api.request<IPagedResponse<IUser>>(nextUrl, { method: 'GET' })
                allUsers = [...allUsers, ...data.results]
                nextUrl = data.next ? Api.getRelativePath(data.next) : null
            } catch (error) {
                console.error('Ошибка при получении списка пользователей:', error)
                break
            }
        }
        return allUsers
    }

    private static getRelativePath (url: string): string | null {
        try {
            const parsedUrl = new URL(url)
            return parsedUrl.pathname.replace(/^\/api/, '') + parsedUrl.search
        } catch (error) {
            console.error('Неверный URL:', url)
            return null
        }
    }
}
