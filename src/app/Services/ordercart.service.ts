import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  shippingCharge = 20;
  totalPrice = this.shippingCharge;
  checkout = false;

  constructor(private router: Router, private toastr: ToastrService) { }

  loadCartItems(){
    this.cartItems = [];
    this.http.get(`http://localhost:3000/users/${this.user.email}/cart`).subscribe((data: any) => {
      this.cartItems = data;
      this.loadCartProductDetails();
    });
  }

  loadCartProductDetails(){
    this.cartProducts = [];
    this.totalPrice = this.shippingCharge;
    this.cartItems.forEach((val) => {
      this.http.get('http://localhost:3000/products/' + val.productId).subscribe((product: any) => {
        this.cartProducts.push(product);
        this.totalPrice += (val.quantity * (product.price - (product.price * (product.discount ?? 0) / 100)));
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
      this.toastr.success('Order placed successfully.', 'Success', { timeOut: 2000 });
    }, error => {
      console.log(error);
      this.toastr.error('Failed to place order.', 'Error', { timeOut: 2000});
    });
  }

  calculateTotal(){
    this.totalPrice = this.shippingCharge;
    this.cartItems.forEach((val, index) =>{
      this.totalPrice += this.cartProducts[index].price * ((100 - (this.cartProducts[index].discount ?? 0)) / 100) * val.quantity;
    });
  }

  deleteAnItem(id: string){
    this.http.delete(`http://localhost:3000/users/${this.user.email}/cartItem/${id}`).subscribe(() => {
      this.loadCartItems();
      this.toastr.success('Deleted cart item successfully.', 'Success', { timeOut: 2000, closeButton: true });
    }, error => {
      this.toastr.error('Failed to delete cart item.', 'Error', { timeOut: 2000, closeButton: true });
    });
  }

  moveToWishList(index: number){
    let productId = this.cartItems[index].productId;
    this.cartItems.splice(index, 1);
    this.cartProducts.splice(index, 1);
    this.http.post(`http://localhost:3000/users/${this.user.email}/wishList`, {id: productId}).subscribe(res => {
      this.http.delete(`http://localhost:3000/users/${this.user.email}/cartItem/${productId}`).subscribe(data => console.log(data));
      this.toastr.success('Product moved to your wishlist.', 'Cart updated', { timeOut: 2000, closeButton: true });
    }, error => {
      console.log(error);
      this.toastr.error('Failed to move to your wishlist.', 'Error', { timeOut: 2000, closeButton: true });
    });
  }

  updateQuantity(i: number){
    this.calculateTotal();
    this.http.patch(`http://localhost:3000/users/${this.user.email}/cartItem/`, this.cartItems[i]).subscribe(res => {
      this.toastr.success('Cart item quantity updated successfully.', 'Success', { timeOut: 2000, closeButton: true });
    }, error => {
      console.log(error);
      this.toastr.error('Failed to update cart item quantity.', 'Error', { timeOut: 2000, closeButton: true });
    });
  }
}
