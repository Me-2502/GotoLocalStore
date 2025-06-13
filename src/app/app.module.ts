import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { ProductlistComponent } from './productlist/productlist.component';
import { ProductcardComponent } from './productlist/productcard/productcard.component';
import { ProductdetailComponent } from './productdetail/productdetail.component';
import { SearchedpageComponent } from './searchedpage/searchedpage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterComponent } from './searchedpage/filter/filter.component';
import { CartComponent } from './cart/cart.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { UserinfoComponent } from './userinfo/userinfo.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HttpClientModule } from '@angular/common/http';
import { OrderComponent } from './order/order.component';
import { CheckoutComponent } from './cart/checkout/checkout.component';
import { BillComponent } from './cart/bill/bill.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DailyOrderComponent } from './userinfo/daily-order/daily-order.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SearchComponent,
    ProductlistComponent,
    ProductcardComponent,
    ProductdetailComponent,
    SearchedpageComponent,
    FilterComponent,
    CartComponent,
    WishlistComponent,
    UserinfoComponent,
    LoginComponent,
    SignupComponent,
    OrderComponent,
    CheckoutComponent,
    BillComponent,
    DailyOrderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
