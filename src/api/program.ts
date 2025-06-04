import { CategoriesDB } from "../core/infrastructure/repository/data_access/categories_db";
import { UserDb } from "../core/infrastructure/repository/data_access/user_db";
import { ICategoriesLogic } from "../core/usecase/interface/logic/categories_logic";
import { ICategoriesDB } from "../core/usecase/interface/data_access/categories_db";
import { IUserDb } from "../core/usecase/interface/data_access/user_db";
import { IUserLogic } from "../core/usecase/interface/logic/user_logic";
import { CategoriesLogic } from "../core/usecase/logic/catergories_logic_implementation";
import { UserLogic } from "../core/usecase/logic/user_logic_implementation";
import AppDataSource from "./connection";
import { IProductDB } from "../core/usecase/interface/data_access/product_db";
import { ProductDB } from "../core/infrastructure/repository/data_access/product_db";
import { IInventoryDB } from "../core/usecase/interface/data_access/inventory_db";
import { InventoryDB } from "../core/infrastructure/repository/data_access/inventory_db";
import { IProductLogic } from "../core/usecase/interface/logic/product_logic";
import { ProductLogic } from "../core/usecase/logic/product_logic_implementation";
import IFileService from "../core/usecase/interface/services/file_service";
import CloudinaryService from "../core/infrastructure/file_service/file_service";
import { ICloudinaryConfig } from "../core/infrastructure/config/cloudinary_coonfig";
import { AuthMiddleware } from "./middleware/auth_role_middleware";
import { ICartLogic } from "../core/usecase/interface/logic/cart_logic";
import { CartLogic } from "../core/usecase/logic/cart_logic";
import { CartDB } from "../core/infrastructure/repository/data_access/cart_db";
import { ICartDB } from "../core/usecase/interface/data_access/cart_db";
import { ICartItemDB } from "../core/usecase/interface/data_access/cart_item_db";
import { CartItemDB } from "../core/infrastructure/repository/data_access/cart_item_db";
import { ICartItemLogic } from "../core/usecase/interface/logic/cart_item_logic";
import { CartItemLogic } from "../core/usecase/logic/cart_item_logic";
import { IOrderItemDB } from "../core/usecase/interface/data_access/order_item_db";
import { OrderItemDB } from "../core/infrastructure/repository/data_access/order_item";
import { OrderDB } from "../core/infrastructure/repository/data_access/order_db";
import { IOrderDB } from "../core/usecase/interface/data_access/order_db";
import { IOrderLogic } from "../core/usecase/interface/logic/order_logic";
import { OrderLogic } from "../core/usecase/logic/order_logic_mplementation";
import { IOrderPaymentDB } from "../core/usecase/interface/data_access/order_payment_db";
import { OrderPaymentDB } from "../core/infrastructure/repository/data_access/order_payment_db";
import { IPaymentLogic } from "../core/usecase/interface/logic/payment_logic";
import { Paymentlogic } from "../core/usecase/logic/payment_logic_implementation";
import { IApi } from "../core/usecase/interface/api/api_call";
import { Api } from "../core/infrastructure/api/apii-call";
import { IPaymentService } from "../core/usecase/interface/services/payment_service";
import { FlwPaymentService } from "../core/infrastructure/services/payment_service";
import { FlwConfig } from "../core/infrastructure/config/flw_config";
import { myBaseUrlConfig, ShipBubbleConfig, StoreAddressConfig } from "../core/infrastructure/config/shipbubble_config";
import { DeliveryDB } from "../core/infrastructure/repository/data_access/delivery";
import { IDeliveryDB } from "../core/usecase/interface/data_access/delivery_db";
import { IDeliveryLogic } from "../core/usecase/interface/logic/delivery_logic";
import { DeliveryLogic } from "../core/usecase/logic/delivery_logic";
import { IDeliveryService } from "../core/usecase/interface/services/delivery_service";
import { DeliveryService } from "../core/infrastructure/services/delivery_service";
import { IAddressDB } from "../core/usecase/interface/data_access/address_db";
import { AddressDB } from "../core/infrastructure/repository/data_access/address";
import { IAddressLogic } from "../core/usecase/interface/logic/address_logic";
import { AddressLogic } from "../core/usecase/logic/address_logic_implementation";
import dotenv from 'dotenv';
dotenv.config();

let cloudinaryConfig: ICloudinaryConfig = {
    CLOUD_NAME: process.env.CLOUD_NAME,
    API_KEY: process.env.API_KEY,
    API_SECRET: process.env.API_SECRET
}

export let storeAddressCode: StoreAddressConfig ={
  senderAddress :83018822
}

export var fileService: IFileService = new CloudinaryService(cloudinaryConfig)

export let flwConfig:FlwConfig   = {
    baseUrl: process.env.BASE_URL!,
    secretKey: process.env.SECRET_KEY!,
    publicKey:process.env.PUBLIC_KEY! ,
    redirectUrl: process.env.REDIRECT_URL!
}
console.log(flwConfig)
export let shipBubbleConfig:ShipBubbleConfig ={
  baseUrl:'https://api.shipbubble.com/v1',
  secretKey:process.env.SB_SECRET_KEY!
}

export let myBaseConfig:myBaseUrlConfig ={
  myBaseurl:"http://localhost:8000/webhook/shipbubble"
}

export let api:IApi = new Api()






export let categoriesDb: ICategoriesDB = new CategoriesDB(AppDataSource);
export let userDb: IUserDb = new UserDb(AppDataSource);
export let productDb: IProductDB = new ProductDB(AppDataSource)
export let inventoryDb: IInventoryDB = new InventoryDB(AppDataSource)
export let cartDb: ICartDB  = new CartDB(AppDataSource)
export let cartitemDb:ICartItemDB = new CartItemDB(AppDataSource)
export let orderItemDb:IOrderItemDB = new OrderItemDB(AppDataSource)
export let orderDb:IOrderDB = new OrderDB(AppDataSource)
export let orderPaymentDb:IOrderPaymentDB = new OrderPaymentDB(AppDataSource)
export let deliverytDb:IDeliveryDB = new DeliveryDB(AppDataSource)
export let addressDb:IAddressDB = new AddressDB(AppDataSource)

export  let paymentService:IPaymentService = new  FlwPaymentService(api,flwConfig)

export  let userLogic: IUserLogic = new UserLogic(userDb);
export let categoriesLogic: ICategoriesLogic = new CategoriesLogic(categoriesDb,productDb)
export  let cartitemLogic:ICartItemLogic  = new  CartItemLogic(cartitemDb,cartDb,productDb)
export var  productLogic: IProductLogic = new ProductLogic(categoriesDb, inventoryDb, productDb, fileService)
export let cartLogic:ICartLogic = new CartLogic(cartDb,userDb,cartitemDb,productDb,productLogic);
export let deliveryService:IDeliveryService = new DeliveryService(api,shipBubbleConfig,myBaseConfig)
export let  addressLogic:IAddressLogic = new AddressLogic(addressDb,deliveryService,userDb)
export let deliveryLogic:IDeliveryLogic = new DeliveryLogic(deliveryService,userDb,addressDb,deliverytDb,productDb);
export let paymentLogic:IPaymentLogic = new Paymentlogic(orderDb,userDb,orderPaymentDb,paymentService,deliverytDb,cartDb,inventoryDb,orderItemDb,productDb,deliveryLogic)
export let orderLogic:IOrderLogic = new OrderLogic(orderDb,orderItemDb,cartDb,productDb,userDb,cartLogic,inventoryDb,deliveryLogic,paymentLogic,orderPaymentDb,deliverytDb);



export var authmiddleware:AuthMiddleware =  new AuthMiddleware(userLogic)