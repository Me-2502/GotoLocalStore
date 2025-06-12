import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { OrderItems } from '../Models/Order';
import { Product } from '../Models/product';
import { User } from '../Models/user';

@Component({
  selector: 'app-order',
  standalone: false,
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {
  orders: OrderItems[] = [];
  orderedProducts: Product[] = [];
  loading = false;
  user: User = JSON.parse(localStorage.getItem('prevUser') as string);
  filteredOrders: OrderItems[] = [];
  filteredOrderedProducts: Product[] = [];
  selectedStatus = 'All';
  
  constructor(private http: HttpClient) {}
  
  ngOnInit(){
    this.fetchOrders();
  }

  applyFilter() {
    if (this.selectedStatus === 'All')
      this.filteredOrders = this.orders;
    else
      this.filteredOrders = this.orders.filter(order => order.status === this.selectedStatus);
    const filteredProductIds = this.filteredOrders.map(order => order.productId);
    this.filteredOrderedProducts = this.orderedProducts.filter(product => filteredProductIds.includes(product.id));
  }

  changeFilter(status: string) {
    this.selectedStatus = status;
    this.applyFilter();
  }  

  fetchOrders(){
    this.loading = true;
    this.http.get(`http://localhost:3000/users/${this.user.email}/order`).subscribe((data: any) => {
      this.orders = data;
      this.orders.forEach((val) => {
        this.http.get('http://localhost:3000/products/' + val.productId).subscribe((product: any) => { this.orderedProducts.push(product); });
      });
      this.loading = false;
      this.filteredOrderedProducts = this.orderedProducts;
    });
  }

  cancelOrder(productId: string){
    if(!confirm('Are you sure you want to cancel this order?'))
      return;
    this.http.delete(`http://localhost:3000/users/${this.user.email}/order/${productId}`).subscribe(() => {
      this.orders = this.orders.map(order => order.productId === productId ? { ...order, status: 'Cancelled' } : order);
    });
  }
}