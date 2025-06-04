export interface IBaseDb<TEntity> {
    get (query: Partial<{[key in keyof TEntity]: any}>): Promise<TEntity[]>;
    getAll(): Promise<TEntity[]>;
    getOne (query: Partial<{ [key in keyof TEntity]: any; }>): Promise<TEntity | null>
    save(entity: TEntity): Promise<TEntity>
    remove (query: Partial<{[key in keyof TEntity]: any}>): Promise<TEntity>;
    update  (query:Partial<{[key in keyof TEntity]:any}>,keyToUpdate:Partial<{[key in keyof TEntity]:any}>) : Promise<TEntity | null>
    comparisonSearch(options: {query?: Partial<{ [key in keyof TEntity]: any; }>, contains?: Partial<{[key in keyof TEntity]: string}>, numberComparison?: Partial<{[key in keyof TEntity]: {gt?: number, lt?: number, gte?: number, lte: number}}>, _in?: Partial<{[key in keyof TEntity]: any[]}>}): Promise<TEntity[]>

}