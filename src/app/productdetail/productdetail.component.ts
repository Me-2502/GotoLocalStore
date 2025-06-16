import { HttpClient } from '@angular/common/http';
import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartItems } from '../Models/Cart';
import { Product } from '../Models/product';
import { User } from '../Models/user';

@Component({
  selector: 'app-productdetail',
  standalone: false,
  templateUrl: './productdetail.component.html',
  styleUrl: './productdetail.component.css'
})
export class ProductdetailComponent {
  objectEntries = Object.entries;
  @Input() product!: Product;
  user: User = JSON.parse(localStorage.getItem('prevUser') as string);
  quantity: number = 1;
  dailyQuantity: number = 1;
  http = inject(HttpClient);
  activeRoute = inject(ActivatedRoute);
  
  constructor(private router: Router, private toastr: ToastrService){
    this.onLoad();
  }

  onLoad(){
    this.activeRoute.paramMap.subscribe((param: any) => {
      let id = param.get('id');
      this.http.get(`http://localhost:3000/products/${id}`).subscribe((data: any) => {this.product = data;});
    });
  }

  getDiscountedPrice(price: number, discount?: number){
    if (!discount || discount == 0) return price;
    return (price * (1 - discount / 100)).toFixed(2);
  }

  addToCart(){
    if(this.user.name == ''){
      this.toastr.warning('Please login to add product to cart.', 'Warning', {timeOut: 1500, closeButton: true});
      return;
    }
    if(this.quantity >= 0)
    {
      this.http.post(`http://localhost:3000/users/${this.user.email}/cart`, new CartItems(this.product.id, this.quantity)).subscribe(res => {
        console.log(res);
        this.toastr.success(`${this.product.name} has been added to your cart.`, 'Success', { closeButton: true, timeOut: 1500, progressBar: true, progressAnimation: 'decreasing' });
      }, error => {
        console.log(error);
        this.toastr.error(`${this.product.name} cannot be added to your cart.`, 'Error', { closeButton: true, timeOut: 1500, progressBar: true, progressAnimation: 'decreasing' });
      });
      this.quantity = 1;
    }
  }
  
  addToDailyOrders(){
    if(this.user.name == ''){
      this.toastr.warning('Please login to add product to daily orders.', 'Warning', {timeOut: 1500, closeButton: true});
      return;
    }
    if(this.dailyQuantity >= 0)
    {
      this.http.post(`http://localhost:3000/users/${this.user.email}/daily`, { productId: this.product.id, quantity: this.dailyQuantity}).subscribe(res => {
        console.log(res);
        this.toastr.success(`${this.product.name} has been added to your daily orders list.`, 'Success', { closeButton: true, timeOut: 1500, progressBar: true, progressAnimation: 'decreasing' });
      }, error => {
        console.log(error);
        this.toastr.error(`${this.product.name} cannot be added to your daily orders list.`, 'Error', { closeButton: true, timeOut: 1500, progressBar: true, progressAnimation: 'decreasing' });
      });
      this.dailyQuantity = 1;
    }
  }

  changeQuantity(s: string){
    if(s == '+')
      this.quantity++;
    else if(this.quantity > 1)
      this.quantity--;
  }

  changeDailyQuantity(s: string){
    if(s == '+')
      this.dailyQuantity++;
    else if(this.dailyQuantity > 1)
      this.dailyQuantity--;
  }

  formatKey(key: string) {
    if (!key) return '';
      const withSpaces = key.replace(/([a-z])([A-Z])/g, '$1 $2');
    return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
  }  
}