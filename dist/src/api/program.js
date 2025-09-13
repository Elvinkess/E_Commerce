"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authmiddleware = exports.orderLogic = exports.paymentLogic = exports.deliveryLogic = exports.addressLogic = exports.deliveryService = exports.cartLogic = exports.productLogic = exports.categoriesLogic = exports.userLogic = exports.paymentService = exports.addressDb = exports.deliverytDb = exports.orderPaymentDb = exports.orderDb = exports.orderItemDb = exports.cartitemDb = exports.cartDb = exports.inventoryDb = exports.productDb = exports.userDb = exports.categoriesDb = exports.api = exports.myBaseConfig = exports.shipBubbleConfig = exports.flwConfig = exports.fileService = exports.storeAddressCode = void 0;
const categories_db_1 = require("../core/infrastructure/repository/data_access/categories_db");
const user_db_1 = require("../core/infrastructure/repository/data_access/user_db");
const catergories_logic_implementation_1 = require("../core/usecase/logic/catergories_logic_implementation");
const user_logic_implementation_1 = require("../core/usecase/logic/user_logic_implementation");
const connection_1 = __importDefault(require("./connection"));
const product_db_1 = require("../core/infrastructure/repository/data_access/product_db");
const inventory_db_1 = require("../core/infrastructure/repository/data_access/inventory_db");
const product_logic_implementation_1 = require("../core/usecase/logic/product_logic_implementation");
const file_service_1 = __importDefault(require("../core/infrastructure/file_service/file_service"));
const auth_role_middleware_1 = require("./middleware/auth_role_middleware");
const cart_logic_1 = require("../core/usecase/logic/cart_logic");
const cart_db_1 = require("../core/infrastructure/repository/data_access/cart_db");
const cart_item_db_1 = require("../core/infrastructure/repository/data_access/cart_item_db");
const order_item_1 = require("../core/infrastructure/repository/data_access/order_item");
const order_db_1 = require("../core/infrastructure/repository/data_access/order_db");
const order_logic_mplementation_1 = require("../core/usecase/logic/order_logic_mplementation");
const order_payment_db_1 = require("../core/infrastructure/repository/data_access/order_payment_db");
const payment_logic_implementation_1 = require("../core/usecase/logic/payment_logic_implementation");
const apii_call_1 = require("../core/infrastructure/api/apii-call");
const payment_service_1 = require("../core/infrastructure/services/payment_service");
const delivery_1 = require("../core/infrastructure/repository/data_access/delivery");
const delivery_logic_1 = require("../core/usecase/logic/delivery_logic");
const delivery_service_1 = require("../core/infrastructure/services/delivery_service");
const address_1 = require("../core/infrastructure/repository/data_access/address");
const address_logic_implementation_1 = require("../core/usecase/logic/address_logic_implementation");
const dotenv_1 = __importDefault(require("dotenv"));
const cache_1 = require("../core/infrastructure/services/cache");
dotenv_1.default.config();
let cloudinaryConfig = {
    CLOUD_NAME: process.env.CLOUD_NAME,
    API_KEY: process.env.API_KEY,
    API_SECRET: process.env.API_SECRET
};
exports.storeAddressCode = {
    senderAddress: 83018822
};
exports.fileService = new file_service_1.default(cloudinaryConfig);
exports.flwConfig = {
    baseUrl: process.env.BASE_URL,
    secretKey: process.env.SECRET_KEY,
    publicKey: process.env.PUBLIC_KEY,
    redirectUrl: process.env.REDIRECT_URL
};
exports.shipBubbleConfig = {
    baseUrl: 'https://api.shipbubble.com/v1',
    secretKey: process.env.SB_SECRET_KEY
};
exports.myBaseConfig = {
    myBaseurl: `${process.env.MYBASEURL}/webhook/shipbubble`
};
exports.api = new apii_call_1.Api();
exports.categoriesDb = new categories_db_1.CategoriesDB(connection_1.default);
exports.userDb = new user_db_1.UserDb(connection_1.default);
exports.productDb = new product_db_1.ProductDB(connection_1.default);
exports.inventoryDb = new inventory_db_1.InventoryDB(connection_1.default);
exports.cartDb = new cart_db_1.CartDB(connection_1.default);
exports.cartitemDb = new cart_item_db_1.CartItemDB(connection_1.default);
exports.orderItemDb = new order_item_1.OrderItemDB(connection_1.default);
exports.orderDb = new order_db_1.OrderDB(connection_1.default);
exports.orderPaymentDb = new order_payment_db_1.OrderPaymentDB(connection_1.default);
exports.deliverytDb = new delivery_1.DeliveryDB(connection_1.default);
exports.addressDb = new address_1.AddressDB(connection_1.default);
exports.paymentService = new payment_service_1.FlwPaymentService(exports.api, exports.flwConfig);
let cache = new cache_1.RedisCartCache();
exports.userLogic = new user_logic_implementation_1.UserLogic(exports.userDb);
exports.categoriesLogic = new catergories_logic_implementation_1.CategoriesLogic(exports.categoriesDb, exports.productDb);
exports.productLogic = new product_logic_implementation_1.ProductLogic(exports.categoriesDb, exports.inventoryDb, exports.productDb, exports.fileService);
exports.cartLogic = new cart_logic_1.CartLogic(exports.cartDb, exports.userDb, exports.cartitemDb, exports.productDb, exports.productLogic, cache, exports.inventoryDb);
exports.deliveryService = new delivery_service_1.DeliveryService(exports.api, exports.shipBubbleConfig, exports.myBaseConfig);
exports.addressLogic = new address_logic_implementation_1.AddressLogic(exports.addressDb, exports.deliveryService, exports.userDb);
exports.deliveryLogic = new delivery_logic_1.DeliveryLogic(exports.deliveryService, exports.userDb, exports.addressDb, exports.deliverytDb, exports.productDb);
exports.paymentLogic = new payment_logic_implementation_1.Paymentlogic(exports.orderDb, exports.userDb, exports.orderPaymentDb, exports.paymentService, exports.deliverytDb, exports.cartDb, exports.inventoryDb, exports.orderItemDb, exports.productDb, exports.deliveryLogic);
exports.orderLogic = new order_logic_mplementation_1.OrderLogic(exports.orderDb, exports.orderItemDb, exports.cartDb, exports.productDb, exports.userDb, exports.cartLogic, exports.inventoryDb, exports.deliveryLogic, exports.paymentLogic, exports.orderPaymentDb, exports.deliverytDb, cache);
exports.authmiddleware = new auth_role_middleware_1.AuthMiddleware(exports.userLogic);
