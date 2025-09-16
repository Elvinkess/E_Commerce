import { DataSource } from "typeorm"
import { UserConfig } from "../core/infrastructure/repository/config/user_config"
import { CategoriesConfig } from "../core/infrastructure/repository/config/categories_config"
import { ProductConfig } from "../core/infrastructure/repository/config/product_config"
import { InventoryConfig } from "../core/infrastructure/repository/config/inventory_config"
import { CartConfig } from "../core/infrastructure/repository/config/cart_config"
import { CartItemConfig } from "../core/infrastructure/repository/config/cart_item_configs"
import { OrderConfig } from "../core/infrastructure/repository/config/order"
import { OrderItemConfig } from "../core/infrastructure/repository/config/order_item_config"
import { OrderPaymentConfig } from "../core/infrastructure/repository/config/order_payment_config"
import { AddressConfig } from "../core/infrastructure/repository/config/address_config"
import { DeliveryConfig } from "../core/infrastructure/repository/config/delivery_config"
import dotenv from 'dotenv';
dotenv.config();
console.log(`DATABASE_URL at runtime: '${process.env.DATABASE_URL}'`);


const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL_EX, //connection string for hosted DBs
    //  port: parseInt(process.env.PGPORT || "5432", 10),
    // username: process.env.USERNAME || "postgres",
    // password:process.env.PASSWORD_DB,
    // database: process.env.DATABASE,
    entities: [UserConfig,CategoriesConfig, ProductConfig, InventoryConfig,CartConfig,CartItemConfig,OrderConfig,OrderItemConfig,OrderPaymentConfig,AddressConfig,DeliveryConfig],
    synchronize: false,
    logging: false,
    ssl: { rejectUnauthorized: false }, // required for Render Postgres
      
})

AppDataSource.initialize()
    .then(async() => {
        // here you can start to work with your database
        console.log("connected to DB boss")

    })
    .catch((error) => console.log(error))

export default AppDataSource;