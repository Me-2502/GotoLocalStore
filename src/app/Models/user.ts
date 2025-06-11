import { CartItems } from "./Cart";
import { OrderItems } from "./Order";

export class User{
    constructor(name: string,
        age: number,
        gender: string,
        address: string,
        phone: number,
        email: string,
        password: string,
        premium: boolean){
            this.name = name;
            this.age = age;
            this.gender = gender;
            this.address = address;
            this.password = password;
            this.phone = phone;
            this.email = email;
            this.premium = premium;
        }

    name: string;
    age: number;
    gender: string;
    address: string;
    password: string;
    phone: number;
    email: string;
    premium: boolean;
    cart: CartItems[] = [];
    order: OrderItems[] = [];
}