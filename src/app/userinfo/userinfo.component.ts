import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../Models/product';
import { User } from '../Models/user';

@Component({
  selector: 'app-userinfo',
  standalone: false,
  templateUrl: './userinfo.component.html',
  styleUrl: './userinfo.component.css'
})
export class UserinfoComponent {
  user!: User;
  loading = true;
  error = '';
  http = inject(HttpClient);
  router = inject(Router);
  selectedSection = 'personal information';

  showPersonalInfo = true;
  showCoupons = false;
  showHelp = false;
  showWishList = false;
  showDailyOrders = false;

  dailyOrders: { productId: string, defaultQuantity: number, nextDeliveryQuantity: number }[] = [];
  dailyOrderProducts: Product[] = [];
  wishList: Product[] = [];
  
  logoutConfirmationPopup = false;
  switchAccountPopup = false;

  constructor(){
    this.user = JSON.parse(localStorage.getItem('prevUser') as string);
    if(!this.user || this.user.name == '')
      this.router.navigate(['login']);
  }

  ngOnInit(): void {
    this.http.get(`http://localhost:3000/user/${this.user.email}/${this.user.phone}`).subscribe((data: any) => {
      this.user = data;
      this.loading = false;
    });
    this.http.get(`http://localhost:3000/users/${this.user.email}/daily`).subscribe((data: any) => {
      this.dailyOrders = data;
      this.dailyOrders.forEach((order) => this.http.get('http://localhost:3000/products/' + order.productId).subscribe((res: any) => {
        this.dailyOrderProducts.push(res);
      }));
    });
    this.getWishList();
  }

  getWishList(){
    if(this.wishList.length == 0){
      this.http.get(`http://localhost:3000/users/${this.user.email}/wishlist`).subscribe((data : any) => {
        data.forEach((item: any) => this.http.get('http://localhost:3000/products/' + item).subscribe((res: any) => {
          this.wishList.push(res);
        }));
      });
    }
  }

  updateQuantity(order: { productId: string, defaultQuantity: number, nextDeliveryQuantity: number }, temp: boolean){
    if(!temp)
      order.defaultQuantity = order.nextDeliveryQuantity;
    this.http.patch(`http://localhost:3000/users/${this.user.email}/daily`, { productId: order.productId, quantity: order.nextDeliveryQuantity, temporary: temp }).subscribe(res => console.log(res));
  }

  deleteOrder(productId: string, index: number){
    this.http.delete(`http://localhost:3000/users/${this.user.email}/daily/${productId}`).subscribe((res: any) => { this.dailyOrders = res.daily; });
  }

  deleteWishListItem(product: Product){
    this.http.delete(`http://localhost:3000/users/${this.user.email}/wishlist/${product.id}`).subscribe((res) => {
      console.log(res);
      this.wishList = this.wishList.filter(item => item.id != product.id);
    });
  }

  moveToCart(product: Product){
    this.wishList = this.wishList.filter(item => item.id != product.id);
    this.http.post(`http://localhost:3000/users/${this.user.email}/cart`, { productId: product.id, quantity: 1 }).subscribe(res => console.log(res));
  }

  toggleLogoutPopup() {
    this.logoutConfirmationPopup = !this.logoutConfirmationPopup;
  }

  toggleSwitchPopup() {
    this.switchAccountPopup = !this.switchAccountPopup;
  }

  logOut() {
    localStorage.removeItem('prevUser');
    this.router.navigate(['/login']);
  }

  confirmSwitch() {
    this.router.navigate(['/switch-account']);
  }

  toggleSection(section: string) {
    this.showPersonalInfo = section === 'personalinfo';
    this.showCoupons = section === 'coupons';
    this.showHelp = section === 'help';
    this.showWishList = section === 'wishlist';
    this.showDailyOrders = section === 'daily';
    this.selectedSection = section;
    if(section == 'personalinfo')
      this.selectedSection = 'personal information';
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
