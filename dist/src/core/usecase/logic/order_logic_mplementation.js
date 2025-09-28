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
const bad_request_1 = require("../utilities/Errors/bad_request");
const not_found_request_1 = require("../utilities/Errors/not_found_request");
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
        this.getOrderHistory = (userId) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            // get all orders for the user
            const orders = yield this.orderDB.comparisonSearch({ query: { user_id: userId }, _not: { status: order_items_1.OrderStatus.PENDING } });
            const orderResponses = [];
            for (const order of orders) {
                const orderItems = yield this.orderItemDB.get({ order_id: order.id });
                // attach product info if
                const enrichedItems = yield Promise.all(orderItems.map((item) => __awaiter(this, void 0, void 0, function* () {
                    const product = yield this.productDB.getOne({ id: item.product_id });
                    return Object.assign(Object.assign({}, item), { product: product !== null && product !== void 0 ? product : undefined });
                })));
                // fetch payment info for this order
                const payment = yield this.orderPaymentDB.getOne({ orderId: order.id });
                // build OrderHistoryResponse
                const historyResponse = Object.assign(Object.assign({}, order), { status: (_a = payment === null || payment === void 0 ? void 0 : payment.status) !== null && _a !== void 0 ? _a : order.status, date: (_c = (_b = (payment === null || payment === void 0 ? void 0 : payment.date)) === null || _b === void 0 ? void 0 : _b.toString()) !== null && _c !== void 0 ? _c : "", totalAmountPaid: (payment === null || payment === void 0 ? void 0 : payment.amount) + (payment === null || payment === void 0 ? void 0 : payment.deliveryamount), transactionRef: (_d = payment === null || payment === void 0 ? void 0 : payment.transactionReference) !== null && _d !== void 0 ? _d : "", Order_items: enrichedItems });
                orderResponses.push(historyResponse);
            }
            return orderResponses.reverse();
        });
        this.get = (userId, guestId) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            if (!userId && !guestId) {
                throw new bad_request_1.BadRequestError("Either of userId or guestId must be available");
            }
            let totalAmount = 0;
            let orderedItems = [];
            let cart = yield this.cartLogic.get(userId, guestId);
            // Get existing order
            const existingOrder = userId ? yield this.orderDB.getOne({ user_id: userId, status: order_items_1.OrderStatus.PENDING }) : yield this.orderDB.getOne({ guest_id: guestId, status: order_items_1.OrderStatus.PENDING });
            //create new order if either of useId or guestId is available
            const savedOrder = existingOrder !== null && existingOrder !== void 0 ? existingOrder : yield this.orderDB.save(new order_1.Order(userId, guestId, totalAmount, order_items_1.OrderStatus.PENDING));
            // Get existing order items
            const existingOrderItems = yield this.orderItemDB.get({ order_id: savedOrder.id });
            // Map existing items by product id for quick lookup
            const existingItemsMap = new Map();
            for (let item of existingOrderItems) {
                existingItemsMap.set(item.product_id, item);
            }
            // Go through cart items and add missing items to order
            for (let cartItem of (_a = cart === null || cart === void 0 ? void 0 : cart.cart_items) !== null && _a !== void 0 ? _a : []) {
                const product = cartItem.product;
                const prodStatus = cartItem.status;
                const date = new Date().toISOString();
                if (!product)
                    continue;
                // If item already in order, just use it
                if (existingItemsMap.has(product.id)) {
                    const existingItem = existingItemsMap.get(product.id);
                    orderedItems.push(existingItem);
                    totalAmount += existingItem.price;
                    continue;
                }
                // Add new order item based on cart
                let savedOrderedItem;
                if (prodStatus === product_cart_response_1.CartItemStatus.Okay) {
                    savedOrderedItem = (yield this.orderItemDB.save(new order_item_1.OrderItem(savedOrder.id, product.id, product.name, cartItem.quantity, cartItem.quantity * product.price, date)));
                }
                else if (prodStatus === product_cart_response_1.CartItemStatus.LessQuantity) {
                    const quantityAvailable = Math.max((_c = (_b = product.inventory) === null || _b === void 0 ? void 0 : _b.quantity_available) !== null && _c !== void 0 ? _c : 0, 0);
                    const message = "Quantity desired not available, we gave you all we got!";
                    savedOrderedItem = (yield this.orderItemDB.save(new order_item_1.OrderItem(savedOrder.id, product.id, product.name, quantityAvailable, quantityAvailable * product.price, date, message)));
                }
                else {
                    continue;
                }
                savedOrderedItem.product = product;
                orderedItems.push(savedOrderedItem);
                totalAmount += savedOrderedItem.price;
            }
            // Update total price
            yield this.orderDB.update({ id: savedOrder.id }, { total_price: totalAmount });
            // Return order response
            const orderResponse = savedOrder;
            orderResponse.Order_items = orderedItems;
            orderResponse.total_price = totalAmount;
            return orderResponse;
        });
        this.remove = (orderId, userId, guestId) => __awaiter(this, void 0, void 0, function* () {
            // validate userId and guestId
            if (!userId && !guestId) {
                throw new bad_request_1.BadRequestError("Either userId or guestId must be available");
            }
            let order;
            if (userId) {
                // check user exists
                const user = yield this.userDB.getOne({ id: userId });
                if (!user)
                    throw new not_found_request_1.NotFoundError("User does not exist");
                // fetch order belonging to user
                order = yield this.orderDB.getOne({ id: orderId, user_id: userId });
            }
            else if (guestId) {
                // fetch order belonging to guest
                order = yield this.orderDB.getOne({ id: orderId, guest_id: guestId });
            }
            if (!order) {
                throw new not_found_request_1.NotFoundError("Order does not exist or does not belong to this account");
            }
            if (order.status !== order_items_1.OrderStatus.PENDING) {
                throw new bad_request_1.BadRequestError("Only pending orders can be removed");
            }
            // remove associated records
            yield this.orderItemDB.removeMany({ order_id: orderId });
            yield this.orderPaymentDB.removeMany({ orderId: orderId });
            yield this.deliveryDB.removeMany({ orderid: orderId });
            yield this.orderDB.remove({ id: orderId });
            return "Order successfully removed";
        });
        this.payForOrder = (orderId, guestEmail) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            let order = yield this.orderDB.getOne({ id: orderId });
            if (!order) {
                throw new not_found_request_1.NotFoundError("ORDER not found!!");
            }
            if (order.status === order_items_1.OrderStatus.PAID) {
                throw new bad_request_1.BadRequestError("User already paid");
            }
            let user = order.user_id ? yield this.userDB.getOne({ id: order.user_id }) : null;
            // Validate that either user exists OR guestId+guestEmail is provided
            if (!user) {
                if (!order.guest_id || !guestEmail) {
                    throw new bad_request_1.BadRequestError("Order must belong to a registered user or have a valid guest with email");
                }
            }
            let date = new Date();
            let transactionReference = random_utility_1.RandomUtility.generateRandomString(15);
            let deliveryDate = (yield this.deliveryLogic.getDeliveryDate(order));
            let deliveryreq = {
                orderId: order.id,
                pickUpDate: deliveryDate,
                deliveryInstructions: "Please deliver on time",
                orderDetails: yield this.get(order.user_id, order.guest_id)
            };
            //Creating Shippment
            let shipment = yield this.deliveryLogic.getDeliveryFee(deliveryreq);
            let deliveryFee = Math.round(parseFloat(`${shipment.data.fastest_courier.total + (shipment.data.fastest_courier.total * 0.2)}`));
            const Email = user ? user.email : guestEmail;
            let payment = new order_payment_1.OrderPayment({ amount: order.total_price, status: payment_status_enums_1.paymentStatus.PENDING, orderId: order.id, userEmail: Email, date: date, transactionReference: transactionReference, deliveryamount: deliveryFee });
            let savedOrderpayment = (_a = yield this.orderPaymentDB.getOne({ transactionReference: transactionReference })) !== null && _a !== void 0 ? _a : yield this.orderPaymentDB.save(payment);
            let Orderpayment = yield this.paymentLogic.initiatePayforOrder(savedOrderpayment);
            return Orderpayment;
        });
        this.processCompletedPaymentForOrder = (transactionRef) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            let payment = yield this.orderPaymentDB.getOne({ transactionReference: transactionRef });
            if (payment === null) {
                throw new bad_request_1.BadRequestError("There is no initiated payment for this order");
            }
            let order = yield this.orderDB.getOne({ id: payment === null || payment === void 0 ? void 0 : payment.orderId });
            console.log(payment);
            if ((payment === null || payment === void 0 ? void 0 : payment.status) == payment_status_enums_1.paymentStatus.PAID) {
                throw new bad_request_1.BadRequestError(`This payment with transactionRef: ${transactionRef} has been ${payment.status}`);
            }
            let totalAmount = payment.amount + payment.deliveryamount;
            let confirmPayment = yield this.paymentLogic.confirmPayment(transactionRef, totalAmount);
            let updatedOrderPayment = yield this.orderPaymentDB.update({ id: payment === null || payment === void 0 ? void 0 : payment.id }, { processorReference: confirmPayment.processor_response, status: payment_status_enums_1.paymentStatus.PAID, remarks: confirmPayment.status });
            if (!order) {
                throw new not_found_request_1.NotFoundError("ORDER not found!!");
            }
            if (order.status === order_items_1.OrderStatus.PAID) {
                throw new bad_request_1.BadRequestError("User already paid");
            }
            let deliveryDate = yield this.deliveryLogic.getDeliveryDate(order);
            let deliveryreq = {
                orderId: order.id,
                pickUpDate: deliveryDate,
                deliveryInstructions: "Please deliiver on time",
                orderDetails: yield this.get(order.user_id, order.guest_id)
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
            yield this.cartCache.clearCart(order.user_id, order.guest_id);
            const where = { user_status: cart_status_enum_1.cart_status.ACTIVE };
            if (order.user_id) {
                where.user_id = order.user_id;
            }
            if (order.guest_id) {
                where.guest_id = order.guest_id;
            }
            yield this.cartDB.update(where, { user_status: cart_status_enum_1.cart_status.INACTIVE });
            yield this.orderDB.update({ id: order === null || order === void 0 ? void 0 : order.id }, { status: order_items_1.OrderStatus.PAID });
            yield this.deliveryDB.update({ orderid: order === null || order === void 0 ? void 0 : order.id }, { status: delivery_1.delivery_status.PAID });
            return updatedOrderPayment;
        });
    }
}
exports.OrderLogic = OrderLogic;
