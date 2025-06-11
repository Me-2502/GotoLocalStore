import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CartItems } from '../Models/Cart';
import { Product } from '../Models/product';
import { User } from '../Models/user';

@Injectable({
  providedIn: 'root'
})
export class OrdercartService {
  cartItems: CartItems[] = [];
  cartProducts: Product[] = [];
  futureOrderItems: CartItems[] = [];
  http = inject(HttpClient);
  user: User = JSON.parse(localStorage.getItem('prevUser') as string);
  totalPrice = 0;
  checkout = false;

  constructor(private router: Router) { }

  loadCartItems(){
    this.cartItems = [];
    this.http.get(`http://localhost:3000/users/${this.user.email}/cart`).subscribe((data: any) => {
      this.cartItems = data;
      this.loadCartProductDetails();
    });
  }

  loadCartProductDetails(){
    this.cartProducts = [];
    this.cartItems.forEach((val) => {
      this.http.get('http://localhost:3000/products/' + val.productId).subscribe((product: any) => {
        this.cartProducts.push(product);
        this.totalPrice += (val.quantity * (product.price - (product.price * (product.discount == undefined ? 0 : product.discount) / 100)));
      });
    });
  }

  orderCart(address: string, deliveryDate: string, payment: boolean, method: string){
    let payload = {address: address, date: deliveryDate, payment: payment, method: method};
    this.http.post(`http://localhost:3000/users/${this.user.email}/order`, payload).subscribe((res) => {
      console.log(res);
      this.http.delete(`http://localhost:3000/users/${this.user.email}/cart/clear`).subscribe();
      this.cartItems = [];
      this.router.navigate(['order']);
    });
  }
}
