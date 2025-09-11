import { Repository } from "typeorm/repository/Repository";
import {  BaseEntity, DataSource, EntityTarget, ILike, In, LessThan, LessThanOrEqual, Like, MoreThan, MoreThanOrEqual, Not, ObjectLiteral } from "typeorm";
import { IBaseDb } from "../../../usecase/interface/data_access/base_db";


export class BaseDb<TEntity extends BaseEntity> implements IBaseDb<TEntity>{
    private model: Repository<TEntity>
    
    constructor( myDataSource: DataSource, entity: EntityTarget<TEntity>){
        this.model = myDataSource.getRepository(entity)
    }
   
    async getAll(): Promise<TEntity[]> {
        return await this.model.find()
    }
    get = async (query: Partial<{ [key in keyof TEntity]: any; }>): Promise<TEntity[]> => {
        return await this.model.findBy(query);
    }

    getOne = async (query: Partial<{ [key in keyof TEntity]: any; }>): Promise<TEntity | null> => {
        return await this.model.findOneBy(query);
    }
    save = async (entity: TEntity): Promise<TEntity> => {
        const savedentity = await this.model.save(entity);
        return savedentity;
    }
    
    remove = async (query: Partial<{ [key in keyof TEntity]: any; }>): Promise<TEntity> => {
        const removeEnt = await this.model.findBy(query);
        await this.model.delete(query);
        return removeEnt[0]
    }
    removeMany = async (query: Partial<{ [key in keyof TEntity]: any; }>): Promise<TEntity[]> => {
        const entitiesToRemove = await this.model.findBy(query);
        if (entitiesToRemove.length === 0) return [];
        await this.model.delete(query);
        return entitiesToRemove;
    }
    
    update = async (query:Partial<{[key in keyof TEntity]:any}>,keyToUpdate:Partial<{[key in keyof TEntity]:any}>) : Promise<TEntity | null>=>{
       
          await this.model.update(query,keyToUpdate)
          return await this.model.findOneBy(query);
    }

    findPaginated =async(page: number, limit: number): Promise<[TEntity[], number]>=> {
        const [entities, total] = await this.model.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
          });
        
          return [entities, total];
        
    }
    
    _comparisonSearch = async (query: Partial<{ [key in keyof TEntity]: any; }> = {}, contains: Partial<{[key in keyof TEntity]: string}> = {}, numberComparison: Partial<{[key in keyof TEntity]: {gt?: number, lt?: number, gte?: number, lte: number}}> = {}, _in: Partial<{[key in keyof TEntity]: any[]}> = {}): Promise<TEntity[]> =>{
        let searchQuery: Partial<{ [key in keyof TEntity]: any; }>= {}

        for(let [key, value]  of Object.entries(query)){
            searchQuery[key as unknown as keyof TEntity] = value
        }

        for(let [key, value]  of Object.entries(contains)){
            searchQuery[key as unknown as keyof TEntity] = Like(`%${value}%`)
        }

        for(let [key, value]  of Object.entries(numberComparison)){
            if(key === "gt"){
                searchQuery[key as unknown as keyof TEntity] = MoreThan(value)
            }
            if(key === "lt"){
                searchQuery[key as unknown as keyof TEntity] = LessThan(value)
            }
            if(key === "lte"){
                searchQuery[key as unknown as keyof TEntity] = LessThanOrEqual(value)
            }
            if(key === "gte"){
                searchQuery[key as unknown as keyof TEntity] = MoreThanOrEqual(value)
            }
        }

        for(let [key, value]  of Object.entries(_in)){
            searchQuery[key as unknown as keyof TEntity] = In(value)
        }


        return await this.model.findBy(searchQuery);
    }

    comparisonSearch = async (options: {query?: Partial<{ [key in keyof TEntity]: any; }>, contains?: Partial<{[key in keyof TEntity]: string}>, numberComparison?: Partial<{[key in keyof TEntity]: {gt?: number, lt?: number, gte?: number, lte: number}}>, _in?: Partial<{[key in keyof TEntity]: any[]}>,_not?: Partial<{[key in keyof TEntity]: any}> }): Promise<TEntity[]> =>{
        let searchQuery: Partial<{ [key in keyof TEntity]: any; }>= {}

        for(let [key, value]  of Object.entries(options.query ?? {})){
            searchQuery[key as unknown as keyof TEntity] = value
        }

        for(let [key, value]  of Object.entries(options.contains ?? {})){
            searchQuery[key as unknown as keyof TEntity] = ILike(`%${value}%`)
        }

        for(let [key, value]  of Object.entries(options.numberComparison ?? {})){
            if(key === "gt"){
                searchQuery[key as unknown as keyof TEntity] = MoreThan(value)
            }
            if(key === "lt"){
                searchQuery[key as unknown as keyof TEntity] = LessThan(value)
            }
            if(key === "lte"){
                searchQuery[key as unknown as keyof TEntity] = LessThanOrEqual(value)
            }
            if(key === "gte"){
                searchQuery[key as unknown as keyof TEntity] = MoreThanOrEqual(value)
            }
        }

        for(let [key, value]  of Object.entries(options._in ?? {})){
            searchQuery[key as unknown as keyof TEntity] = In(value)
        }
        for(let[key, value] of Object.entries(options._not ?? {})){
            searchQuery[key as unknown as keyof TEntity] = Not(value)
        }


        return await this.model.findBy(searchQuery);
    }

    
    
}