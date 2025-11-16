export interface UserInfo {
    user_id?: number;
    email?: string;
    first_name?: string;
    last_name?: string;
}

export interface AuthState {
    accessToken?: string;
    role?: number | number[];
    user?: UserInfo | null;
}

export interface RefreshResponse {
    accessToken: string;
    role: number | number[];
    user: UserInfo;
}
