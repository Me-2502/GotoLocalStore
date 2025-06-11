import { CartItems } from "./Cart";

export class OrderItems {
    constructor(cartItems: CartItems, address: string, delivery: Date, status: string, payment: boolean, method: string){
        this.productId = cartItems['productId'];
        this.quantity = cartItems['quantity'];
        this.address = address;
        this.delivery = delivery;
        this.status = status;
        this.payment = payment;
        this.method = method;
    }
    productId: string;
    quantity: number;
    address: string;
    delivery: Date;
    status: string;
    payment: boolean;
    method: string;
}