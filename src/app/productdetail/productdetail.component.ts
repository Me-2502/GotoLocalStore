import { HttpClient } from '@angular/common/http';
import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  @Input() product!: Product;
  user: User = JSON.parse(localStorage.getItem('prevUser') as string);
  quantity: number = 1;
  dailyQuantity: number = 1;
  http = inject(HttpClient);
  activeRoute = inject(ActivatedRoute);
  
  constructor(private router: Router){
    this.onLoad();
  }

  onLoad(){
    this.activeRoute.paramMap.subscribe((param: any) => {
      let id = param.get('id');
      this.http.get(`http://localhost:3000/products/${id}`).subscribe((data: any) => {this.product = data;});
    });
  }

  getDiscountedPrice(price: number, discount?: number): number {
    if (!discount || discount == 0) return price;
    return Math.round(price - (price * discount / 100));
  }

  addToCart(){
    if(this.quantity >= 0)
    {
      this.http.post(`http://localhost:3000/users/${this.user.email}/cart`, new CartItems(this.product.id, this.quantity)).subscribe(res => console.log(res));
      this.quantity = 1;
    }
  }

  addToDailyOrders(){
    if(this.dailyQuantity >= 0)
    {
      this.http.post(`http://localhost:3000/users/${this.user.email}/daily`, { productId: this.product.id, quantity: this.dailyQuantity}).subscribe(res => console.log(res));
      this.dailyQuantity = 1;
    }
  }

  changeQuantity(s: string){
    if(s == '+')
      this.quantity++;
    else if(this.quantity > 1){
      this.quantity--;
    }
  }

  changeDailyQuantity(s: string){
    if(s == '+')
      this.dailyQuantity++;
    else if(this.dailyQuantity > 1){
      this.dailyQuantity--;
    }
  }
}