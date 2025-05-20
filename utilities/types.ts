export type PaginationParams = {page?:number,limit?:number}

export type WithPagination<T> = T & PaginationParams

export type GenericObject = Record<string,any>

export enum Actions {
    NEW_MESSAGE="new-message",
    JOIN_ROOM="join-room",
    USER_ONLINE="user-online",
    USER_OFFLINE="user-offline",
}

