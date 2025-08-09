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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderLogic = void 0;
const product_cart_response_1 = require("../../domain/dto/responses/product_cart_response");
const delivery_1 = require("../../domain/entity/delivery");
const order_1 = require("../../domain/entity/order");
const order_item_1 = require("../../domain/entity/order_item");
const order_payment_1 = require("../../domain/entity/order_payment");
const cart_status_enum_1 = require("../../domain/enums/cart_status_enum");
const order_items_1 = require("../../domain/enums/order_items");
const payment_status_enums_1 = require("../../domain/enums/payment_status_enums");
const random_utility_1 = require("../utilities/random_utility");
class OrderLogic {
    constructor(orderDB, orderItemDB, cartDB, productDB, userDB, cartLogic, inventoryDB, deliveryLogic, paymentLogic, orderPaymentDB, deliveryDB, cartCache) {
        this.orderDB = orderDB;
        this.orderItemDB = orderItemDB;
        this.cartDB = cartDB;
        this.productDB = productDB;
        this.userDB = userDB;
        this.cartLogic = cartLogic;
        this.inventoryDB = inventoryDB;
        this.deliveryLogic = deliveryLogic;
        this.paymentLogic = paymentLogic;
        this.orderPaymentDB = orderPaymentDB;
        this.deliveryDB = deliveryDB;
        this.cartCache = cartCache;
        this.get = (userId) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            let totalAmount = 0;
            let orderedItems = [];
            let cart = yield this.cartLogic.get(userId);
            // return existing order if any is available esle  create a new one
            let existingOrder = yield this.orderDB.getOne({ user_id: userId, status: order_items_1.OrderStatus.PENDING });
            let savedOrder = existingOrder !== null && existingOrder !== void 0 ? existingOrder : yield this.orderDB.save(new order_1.Order(userId, totalAmount, order_items_1.OrderStatus.PENDING));
            let OrderItems = yield this.orderItemDB.get({ order_id: savedOrder.id });
            if (OrderItems.length !== 0) {
                totalAmount = OrderItems.reduce((acc, item) => acc + item.price, 0);
                orderedItems = OrderItems;
            }
            else {
                for (let cartItem of (_a = cart === null || cart === void 0 ? void 0 : cart.cart_items) !== null && _a !== void 0 ? _a : []) {
                    let product = cartItem.product;
                    let prodStatus = cartItem.status;
                    let date = new Date().toISOString();
                    if (prodStatus === product_cart_response_1.CartItemStatus.Okay && product) {
                        let savedOrderedItem = (yield this.orderItemDB.save(new order_item_1.OrderItem(savedOrder.id, product.id, cartItem.quantity, cartItem.quantity * product.price, `${date}`)));
                        //get  all ordereditems with orderId 
                        savedOrderedItem.product = cartItem.product;
                        orderedItems.push(savedOrderedItem);
                        totalAmount += savedOrderedItem.price;
                    }
                    else if (prodStatus === product_cart_response_1.CartItemStatus.LessQuantity && product) {
                        let message = "Quantity desired not available hence we gave you all we got hurray!";
                        let quantityAvailable = Math.max(((_d = (_c = (_b = cartItem.product) === null || _b === void 0 ? void 0 : _b.inventory) === null || _c === void 0 ? void 0 : _c.quantity_available) !== null && _d !== void 0 ? _d : 0), 0);
                        let orderItem = new order_item_1.OrderItem(savedOrder.id, product.id, quantityAvailable, quantityAvailable * product.price, `${date}`, message);
                        let savedOrderedItem = yield this.orderItemDB.save(orderItem);
                        savedOrderedItem.product = cartItem.product;
                        orderedItems.push(savedOrderedItem);
                        totalAmount += orderItem.price;
                    }
                }
            }
            let updatedOrder = yield this.orderDB.update({ id: savedOrder.id }, { total_price: totalAmount });
            let orderResponse = savedOrder;
            orderResponse.Order_items = orderedItems;
            orderResponse.total_price = totalAmount;
            return orderResponse;
        });
        this.remove = (orderId, userId) => __awaiter(this, void 0, void 0, function* () {
            let user = yield this.userDB.get({ id: userId });
            if (!user.length)
                throw new Error("User does not exist");
            let order = yield this.orderDB.getOne({ id: orderId, user_id: userId });
            if (!order)
                throw new Error("Order does not exist or does not belong to user");
            if (order.status !== order_items_1.OrderStatus.PENDING) {
                throw new Error("Only pending orders can be removed");
            }
            yield this.orderItemDB.removeMany({ order_id: orderId });
            yield this.orderPaymentDB.removeMany({ orderId: orderId });
            yield this.deliveryDB.removeMany({ orderid: orderId });
            yield this.orderDB.remove({ id: orderId });
            return "Order successfully removed";
        });
        this.payForOrder = (orderId) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            let order = yield this.orderDB.getOne({ id: orderId });
            if (!order) {
                throw new Error("ORDER not found!!");
            }
            if (order.status === order_items_1.OrderStatus.PAID) {
                throw new Error("User already paid");
            }
            let user = yield this.userDB.getOne({ id: order === null || order === void 0 ? void 0 : order.user_id });
            if (!user) {
                throw new Error("USER  not found!!");
            }
            ;
            let date = new Date();
            let transactionReference = random_utility_1.RandomUtility.generateRandomString(15);
            let deliveryDate = (yield this.deliveryLogic.getDeliveryDate(order));
            let deliveryreq = {
                orderId: order.id,
                pickUpDate: deliveryDate,
                deliveryInstructions: "Please deliiver on time",
                orderDetails: yield this.get(user.id)
            };
            //Creating Shippment
            let shipment = yield this.deliveryLogic.getDeliveryFee(deliveryreq);
            let deliveryFee = Math.round(parseFloat(`${shipment.data.fastest_courier.total + (shipment.data.fastest_courier.total * 0.2)}`));
            let payment = new order_payment_1.OrderPayment({ amount: order.total_price, status: payment_status_enums_1.paymentStatus.PENDING, orderId: order.id, userEmail: user.email, date: date, transactionReference: transactionReference, deliveryamount: deliveryFee });
            let savedOrderpayment = (_a = yield this.orderPaymentDB.getOne({ transactionReference: transactionReference })) !== null && _a !== void 0 ? _a : yield this.orderPaymentDB.save(payment);
            let Orderpayment = yield this.paymentLogic.initiatePayforOrder(savedOrderpayment);
            return Orderpayment;
        });
        this.processCompletedPaymentForOrder = (transactionRef) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            let payment = yield this.orderPaymentDB.getOne({ transactionReference: transactionRef });
            if (payment === null) {
                throw new Error("There is no initiated payment for this order");
            }
            let order = yield this.orderDB.getOne({ id: payment === null || payment === void 0 ? void 0 : payment.orderId });
            if ((payment === null || payment === void 0 ? void 0 : payment.status) == payment_status_enums_1.paymentStatus.PAID) {
                throw Error(`This payment with transactionRef: ${transactionRef} has been paid and completed`);
            }
            let totalAmount = payment.amount + payment.deliveryamount;
            let confirmPayment = yield this.paymentLogic.confirmPayment(transactionRef, totalAmount);
            let updatedOrderPayment = yield this.orderPaymentDB.update({ id: payment === null || payment === void 0 ? void 0 : payment.id }, { processorReference: confirmPayment.processor_response, status: payment_status_enums_1.paymentStatus.PAID, remarks: confirmPayment.status });
            if (!order) {
                throw new Error("ORDER not found!!");
            }
            if (order.status === order_items_1.OrderStatus.PAID) {
                throw new Error("User already paid");
            }
            let deliveryDate = yield this.deliveryLogic.getDeliveryDate(order);
            let user = yield this.userDB.getOne({ id: order === null || order === void 0 ? void 0 : order.user_id });
            if (!user) {
                throw new Error("USER  not found!!");
            }
            ;
            let deliveryreq = {
                orderId: order.id,
                pickUpDate: deliveryDate,
                deliveryInstructions: "Please deliiver on time",
                orderDetails: yield this.get(user.id)
            };
            let shipment = yield this.deliveryLogic.createDelivery(deliveryreq);
            // INVENTORY UPDATE DATA
            let orderedItems = yield this.orderItemDB.get({ order_id: order === null || order === void 0 ? void 0 : order.id });
            for (let i = 0; i < orderedItems.length; i++) {
                let product = yield this.productDB.getOne({ id: orderedItems[i].product_id });
                let inventory = yield this.inventoryDB.getOne({ id: product === null || product === void 0 ? void 0 : product.inventory_id });
                let qAvailable = ((_a = inventory === null || inventory === void 0 ? void 0 : inventory.quantity_available) !== null && _a !== void 0 ? _a : 0) - orderedItems[i].quantity;
                let qSold = ((_b = inventory === null || inventory === void 0 ? void 0 : inventory.quantity_sold) !== null && _b !== void 0 ? _b : 0) + orderedItems[i].quantity;
                yield this.inventoryDB.update({ id: product === null || product === void 0 ? void 0 : product.inventory_id }, { quantity_available: qAvailable, quantity_sold: qSold });
            }
            yield this.cartCache.clearCart(order.user_id);
            yield this.cartDB.update({ user_id: order === null || order === void 0 ? void 0 : order.user_id, user_status: cart_status_enum_1.cart_status.ACTIVE }, { user_status: cart_status_enum_1.cart_status.INACTIVE });
            yield this.orderDB.update({ id: order === null || order === void 0 ? void 0 : order.id }, { status: order_items_1.OrderStatus.PAID });
            yield this.deliveryDB.update({ orderid: order === null || order === void 0 ? void 0 : order.id }, { status: delivery_1.delivery_status.PAID });
            return updatedOrderPayment;
        });
    }
}
exports.OrderLogic = OrderLogic;
