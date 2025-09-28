"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const user_config_1 = require("../core/infrastructure/repository/config/user_config");
const categories_config_1 = require("../core/infrastructure/repository/config/categories_config");
const product_config_1 = require("../core/infrastructure/repository/config/product_config");
const inventory_config_1 = require("../core/infrastructure/repository/config/inventory_config");
const cart_config_1 = require("../core/infrastructure/repository/config/cart_config");
const cart_item_configs_1 = require("../core/infrastructure/repository/config/cart_item_configs");
const order_1 = require("../core/infrastructure/repository/config/order");
const order_item_config_1 = require("../core/infrastructure/repository/config/order_item_config");
const order_payment_config_1 = require("../core/infrastructure/repository/config/order_payment_config");
const address_config_1 = require("../core/infrastructure/repository/config/address_config");
const delivery_config_1 = require("../core/infrastructure/repository/config/delivery_config");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log(`DATABASE_URL_EX at runtime: '${process.env.DATABASE_URL_EX}'`);
const AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL_EX, //connection string for hosted DBs
    //  port: parseInt(process.env.PGPORT || "5432", 10),
    // username: process.env.USERNAME || "postgres",
    // password:process.env.PASSWORD_DB,
    // database: process.env.DATABASE,
    entities: [user_config_1.UserConfig, categories_config_1.CategoriesConfig, product_config_1.ProductConfig, inventory_config_1.InventoryConfig, cart_config_1.CartConfig, cart_item_configs_1.CartItemConfig, order_1.OrderConfig, order_item_config_1.OrderItemConfig, order_payment_config_1.OrderPaymentConfig, address_config_1.AddressConfig, delivery_config_1.DeliveryConfig],
    synchronize: false,
    logging: false,
    extra: {
        ssl: { rejectUnauthorized: false }, // required for Render Postgres
    }
});
AppDataSource.initialize()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    // here you can start to work with your database
    console.log("connected to DB boss");
}))
    .catch((error) => console.log(error));
exports.default = AppDataSource;
