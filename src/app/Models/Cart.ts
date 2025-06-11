export class CartItems {
    constructor(productId: string, quantity: number){
        this.productId = productId;
        this.quantity = quantity;
    }
    productId!: string;
    quantity!: number;
    // address!: string;
    // delivery!: Date;
}