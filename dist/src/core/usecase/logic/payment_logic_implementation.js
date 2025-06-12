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
exports.Paymentlogic = void 0;
class Paymentlogic {
    constructor(orderDB, userDB, orderPaymentDB, paymentService, deliveryDB, cardDB, inventoryDB, orderItemDB, productDB, deliveryLogic) {
        this.orderDB = orderDB;
        this.userDB = userDB;
        this.orderPaymentDB = orderPaymentDB;
        this.paymentService = paymentService;
        this.deliveryDB = deliveryDB;
        this.cardDB = cardDB;
        this.inventoryDB = inventoryDB;
        this.orderItemDB = orderItemDB;
        this.productDB = productDB;
        this.deliveryLogic = deliveryLogic;
        this.initiatePayforOrder = (payment) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            let savedPaymentOrder = (_a = yield this.orderPaymentDB.getOne({ id: payment.id })) !== null && _a !== void 0 ? _a : yield this.orderPaymentDB.save(payment);
            let initiatedPayment = yield this.paymentService.initiatePayment(savedPaymentOrder);
            return initiatedPayment;
        });
        this.confirmPayment = (transactionRef, totalAmount) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            let confirmPayment = yield this.paymentService.confirmPayment(transactionRef);
            console.log(confirmPayment, "this is the confirmpayment");
            if (confirmPayment === null) {
                throw new Error();
            }
            else if (confirmPayment.status !== "success") {
                throw new Error(confirmPayment.message);
            }
            else if (totalAmount !== ((_a = confirmPayment.data) === null || _a === void 0 ? void 0 : _a.amount)) {
                throw new Error("you paid: " + ((_b = confirmPayment.data) === null || _b === void 0 ? void 0 : _b.amount) + " instead of :" + totalAmount);
            }
            else if (((_c = confirmPayment.data) === null || _c === void 0 ? void 0 : _c.currency) !== "NGN") {
                throw new Error("The currency you paid with isn't NGN");
            }
            else if (confirmPayment.data.status === "successful") {
                return confirmPayment.data;
            }
            else
                throw new Error("Payment not successful");
        });
    }
}
exports.Paymentlogic = Paymentlogic;
// processCompletedPaymentForOrder = async(transactionRef:string):Promise<any> =>{
//     let payment = await this.orderPaymentDB.getOne({transactionReference:transactionRef});
//     if(payment === null){throw new Error("There is no initiated payment for this order")}
//     let order = await this.orderDB.getOne({id:payment?.orderId});
//     if(payment?.status == paymentStatus.PAID ){  throw Error(`This payment with transactionRef: ${transactionRef} has been paid and completed`)}
//     let totalAmount = payment.amount + payment.deliveryamount
//     let confirmPayment = await this.paymentService.confirmPayment(transactionRef);
//     console.log(confirmPayment,"this is the confirmpayment")
//     if (confirmPayment === null){throw new Error()}
//     else if(confirmPayment.status !== "success"){    throw new Error(confirmPayment.message)}
//     else if(totalAmount  !== confirmPayment.data?.amount){throw new Error("you paid: " +confirmPayment.data?.amount + " instead of :" + totalAmount)}
//     else if(confirmPayment.data?.currency !=="NGN"){throw new Error("The currency you paid with isn't NGN")}
//     else if(confirmPayment.data.status === "successful"){
//         let updatedOrderPayment = await this.orderPaymentDB.update({id:payment?.id},{processorReference:confirmPayment.data.processor_response,status:paymentStatus.PAID,remarks:confirmPayment.data.status})
//         await this.cardDB.update({user_id:order?.user_id,user_status:cart_status.ACTIVE},{user_status:cart_status.INACTIVE});  
//         await this.orderDB.update({id:order?.id},{status:OrderStatus.PAID});
//           await this.deliveryDB.update({orderid:order?.id},{status:delivery_status.PAID})
//           await this.deliveryLogic.createDelivery()
//           let orderedItems  = await this.orderItemDB.get({order_id:order?.id})
//           for(let i=0; i < orderedItems.length ; i++){
//             let product =  await this.productDB.getOne({id:orderedItems[i].product_id})
//             let inventory =  await this.inventoryDB.getOne({id:product?.inventory_id})
//             let qAvailable = (inventory?.quantity_available ?? 0) - orderedItems[i].quantity
//             let qSold = (inventory?.quantity_sold ?? 0) +  orderedItems[i].quantity
//             let updatedInventory =  await this.inventoryDB.update({id:product?.inventory_id},{quantity_available:qAvailable,quantity_sold:qSold})  
//             console.log(updatedInventory)  
//           }
//            //update inventory do this when the payment is successful
//            // let qSold = (product.inventory?.quantity_sold ?? 0) + quantityAvailable
//            // let updatedInventory = await this.inventoryDB.update({id:product.inventory_id},{quantity_available:quantityAvailable,quantity_sold:qSold});
//            // cartItem.product!.inventory = updatedInventory
//            //console.log(updatedInventory)
//           return updatedOrderPayment
//     }
// }
//get payment with transreference from orderPaymentDB
//check if the orderPayment  status is paid or reverse throw an error or stop saying "this has been compled"
//if not successful end
//go to payment service to comfirm the status of this payment on the payment gateway or service
//validate the amount and currency of the payment made to the payment service against Orderpayment saved on my DB
//if everything is valid :
//a. update this my orderPaymentDB with processorRef,status from gateway,remark and update my orderPayment status as well
//b. get your Order and update the status to match the outcome of the transaction
// return a response with the order and payment
