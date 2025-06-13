import { HttpClient } from '@angular/common/http';
import { Component, inject, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../Models/product';
import { User } from '../../Models/user';

@Component({
  selector: 'app-daily-order',
  standalone: false,
  templateUrl: './daily-order.component.html',
  styleUrl: './daily-order.component.css'
})
export class DailyOrderComponent {
  dailyOrders: { productId: string, defaultQuantity: number, nextDeliveryQuantity: number }[] = [];
  dailyOrderProducts: Product[] = [];
  @Input() user!: User;
  shippingCharge = 20;
  dailyOrderTotal = this.shippingCharge;
  http = inject(HttpClient);

  constructor(private toastr: ToastrService) { }
  
  ngOnInit(){
    this.http.get(`http://localhost:3000/users/${this.user.email}/daily`).subscribe((data: any) => {
      this.dailyOrders = data;
      if(!this.dailyOrders)
        return;
      this.dailyOrders.forEach((order) => this.http.get('http://localhost:3000/products/' + order.productId).subscribe((res: any) => {
        this.dailyOrderProducts.push(res);
        this.dailyOrderTotal += (res.price * order.nextDeliveryQuantity * ((100 - (res.discount ?? 0)) / 100));
      }));
    });
  }

  calculateDailyTotal(){
    this.dailyOrderTotal = this.shippingCharge;
    this.dailyOrders.forEach((order, index) => {
      let product = this.dailyOrderProducts[index];
      this.dailyOrderTotal += (order.nextDeliveryQuantity * product.price * ((100 - (product.discount ?? 0)) / 100));
    });
  }

  updateQuantity(order: { productId: string, defaultQuantity: number, nextDeliveryQuantity: number }, temp: boolean){
    if(!temp)
      order.defaultQuantity = order.nextDeliveryQuantity;
    this.calculateDailyTotal();
    this.http.patch(`http://localhost:3000/users/${this.user.email}/daily`, { productId: order.productId, quantity: order.nextDeliveryQuantity, temporary: temp }).subscribe(res => {
      this.toastr.success('Quantity updated successfully.', 'Success', { timeOut: 2000, closeButton: true });
    }, error => {
      console.log(error);
      this.toastr.error('Failed to update quantity.', 'Error', { timeOut: 2000, closeButton: true });
    });
  }

  deleteOrder(productId: string, index: number){
    this.dailyOrders.splice(index, 1);
    this.dailyOrderProducts.splice(index, 1);
    this.calculateDailyTotal();
    this.http.delete(`http://localhost:3000/users/${this.user.email}/daily/${productId}`).subscribe((res: any) => {
      this.dailyOrders = res.daily;
      this.toastr.success('Order successfully deleted.', 'Success', { timeOut: 2000, closeButton: true });
    }, error => {
      console.log(error);
      this.toastr.error('Failed to delete order.', 'Error', { timeOut: 2000, closeButton: true });
    });
  }
}
