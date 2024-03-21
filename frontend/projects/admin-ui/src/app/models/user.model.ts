export interface User {
    id: string,
    firstName: string,
    userName: string,
    role: string,
    creator: string,
    settings: string,
    loginAttempts: Number,
}

export enum UserRoleItem {
    admin = 'admin',
    regular = 'regular',
}