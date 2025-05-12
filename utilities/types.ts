export type PaginationParams = {page?:number,limit?:number}

export type WithPagination<T> = T & PaginationParams

export type GenericObject = Record<string,any>

