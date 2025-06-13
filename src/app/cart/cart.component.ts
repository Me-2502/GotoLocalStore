import { Component, inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { OrdercartService } from '../Services/ordercart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html'
})
export class CartComponent {
  http = inject(HttpClient);
  service = inject(OrdercartService);
  
  constructor(private router: Router, private toastr: ToastrService){
    let user = JSON.parse(localStorage.getItem('prevUser') as string);
    if(!user.name)
      toastr.warning('You need to login to use cart.', 'Warning', { timeOut: 2000 });
    this.service.loadCartItems();
  }

  makePayment(){
    this.service.checkout = !this.service.checkout;
  }

  changeQuantity(operator: string, index: number){
    if(operator == '+'){
      this.service.cartItems[index].quantity++;
      this.service.updateQuantity(index);
    }
    else if(this.service.cartItems[index].quantity > 1){
      this.service.cartItems[index].quantity--;
      this.service.updateQuantity(index);
    }
  }
}