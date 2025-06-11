import { Component, inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartItems } from '../Models/Cart';
import { Router } from '@angular/router';
import { OrdercartService } from '../Services/ordercart.service';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html'
})
export class CartComponent {
  futureOrderItems: CartItems[] = [];
  http = inject(HttpClient);
  service = inject(OrdercartService);
  
  constructor(private router: Router){
    this.service.loadCartItems();
  }

  makePayment(){
    this.service.checkout = !this.service.checkout;
  }

  moveToFutureOrder(item: CartItems){
    this.futureOrderItems.push(item);
    this.service.cartItems = this.service.cartItems.filter(ci => ci !== item);
  }
  removeItem(i: any){}

  updateQuantity(i: any, e: any){}
}