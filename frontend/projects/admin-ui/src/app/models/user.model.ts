export interface User {
    id: string,
    firstName: string,
    userName: string,
    password: string,
    role: string,
    creator: string,
    settings: string,
    loginAttempts: Number,
}

export enum UserRoleItem {
    admin = 'admin',
    regular = 'regular',
}