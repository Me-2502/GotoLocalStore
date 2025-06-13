import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  shippingCost = 20;
  dailyOrderTotal = 0;
  wishList: Product[] = [];
  
  logoutConfirmationPopup = false;
  switchAccountPopup = false;

  constructor(private toastr: ToastrService){
    this.user = JSON.parse(localStorage.getItem('prevUser') as string);
    if(!this.user || !this.user.name){
      this.router.navigate(['login']);
      toastr.warning('You need to login first.', 'Warning', { timeOut: 2000 });
    }
  }

  ngOnInit(): void {
    this.http.get(`http://localhost:3000/user/${this.user.email}/${this.user.phone}`).subscribe((data: any) => {
      this.user = data;
      this.loading = false;
    });
    this.http.get(`http://localhost:3000/users/${this.user.email}/daily`).subscribe((data: any) => {
      this.dailyOrders = data;
      if(!this.dailyOrders)
        return;
      this.dailyOrders.forEach((order) => this.http.get('http://localhost:3000/products/' + order.productId).subscribe((res: any) => {
        this.dailyOrderProducts.push(res);
        this.dailyOrderTotal += (res.price * order.nextDeliveryQuantity * ((100 - (res.discount ?? 0)) / 100));
      }));
    });
    this.getWishList();
  }

  getWishList(){
    if(this.wishList.length == 0){
      this.http.get(`http://localhost:3000/users/${this.user.email}/wishlist`).subscribe((data : any) => {
        data.forEach((item: any) => this.http.get('http://localhost:3000/products/' + item).subscribe((res: any) => { this.wishList.push(res); }));
      });
    }
  }

  calculateDailyTotal(){
    this.dailyOrderTotal = this.shippingCost;
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

  deleteWishListItem(product: Product){
    this.http.delete(`http://localhost:3000/users/${this.user.email}/wishlist/${product.id}`).subscribe((res) => {
      this.wishList = this.wishList.filter(item => item.id != product.id);
      this.toastr.success('Item successfully deleted from wishlist.', 'Success', { timeOut: 2000, closeButton: true });
    }, error => {
      console.log(error);
      this.toastr.error('Failed to delete item from wishlist.', 'Error', { timeOut: 2000, closeButton: true });
    });
  }

  moveToCart(product: Product){
    this.wishList = this.wishList.filter(item => item.id != product.id);
    this.http.post(`http://localhost:3000/users/${this.user.email}/cart`, { productId: product.id, quantity: 1 }).subscribe(res => {
      this.http.delete(`http://localhost:3000/users/${this.user.email}/wishlist/${product.id}`).subscribe();
      this.toastr.success('Item successfully moved to cart.', 'Success', { timeOut: 2000, closeButton: true });
    }, error => {
      console.log(error);
      this.toastr.error('Failed to move item to cart.', 'Error', { timeOut: 2000, closeButton: true });
    });
  }

  toggleLogoutPopup(){
    this.logoutConfirmationPopup = !this.logoutConfirmationPopup;
  }

  toggleSwitchPopup(){
    this.switchAccountPopup = !this.switchAccountPopup;
  }

  logOut(){
    localStorage.removeItem('prevUser');
    this.router.navigate(['/login']);
  }

  confirmSwitch(){
    this.router.navigate(['/switch-account']);
  }

  toggleSection(section: string){
    this.showPersonalInfo = section === 'personalinfo';
    this.showCoupons = section === 'coupons';
    this.showHelp = section === 'help';
    this.showWishList = section === 'wishlist';
    this.showDailyOrders = section === 'daily';
    this.selectedSection = section;
    if(section == 'personalinfo')
      this.selectedSection = 'personal information';
  }

  navigateTo(path: string){
    this.router.navigate([path]);
  }
}
