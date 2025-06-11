import { DataSource } from "typeorm"
import { UserConfig } from "../core/infrastructure/repository/config/user_config"
import { CategoriesConfig } from "../core/infrastructure/repository/config/categories_config"
import { InventoryDB } from "../core/infrastructure/repository/data_access/inventory_db"
import { ProductDB } from "../core/infrastructure/repository/data_access/product_db"
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

const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    //host: "localhost",
    //port: 5432,
    //username: "postgres",
    password:process.env.PASSWORD,
    database: "E_commerce",
    entities: [UserConfig,CategoriesConfig, ProductConfig, InventoryConfig,CartConfig,CartItemConfig,OrderConfig,OrderItemConfig,OrderPaymentConfig,AddressConfig,DeliveryConfig],
    synchronize: false,
    logging: false,
    ssl: {
        rejectUnauthorized: false, // Required for hosted DBs like Render or Supabase
      }
})

AppDataSource.initialize()
    .then(() => {
        // here you can start to work with your database
        console.log("connected boss")
    })
    .catch((error) => console.log(error))

export default AppDataSource;