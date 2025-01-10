export interface ILoginRequest {
    username: string
    password: string
}

export interface ILoginResponse {
    access: string
    refresh: string
}

export interface IRegisterRequest {
    username: string
    password: string
    first_name: string
    last_name: string
    bio?: string
    avatar?: File
}

export interface IRegisterResponse {
    id: string
    username: string
    first_name: string
    last_name: string
    bio?: string
    avatar?: string
}

export interface IRefreshTokenRequest {
    refresh: string
}

export interface IRefreshTokenResponse {
    access: string
    refresh: string
}

export interface IUser {
    id: string
    username: string
    first_name: string
    last_name: string
    bio?: string
    avatar?: string
    is_online?: boolean
}

export interface IMessage {
    id: string
    chat: string
    text?: string
    sender: IUser
    created_at: string
    files?: Array<{
        item: string
    }>
    voice?: string
    was_read_by?: IUser[]
}

export interface IChat {
    id: string
    title: string
    avatar?: string
    is_private?: boolean
    creator?: IUser
    members: IUser[]
    last_message?: IMessage
}

export interface IPagedResponse<T> {
    results: T[]
    next?: string | null
    previous?: string | null
    count?: number
}
