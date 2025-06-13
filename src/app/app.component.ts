import { Component, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { User } from './Models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ecommerce';
  user!: User;

  constructor(private toastr: ToastrService){
    this.user = JSON.parse(localStorage.getItem('prevUser') as string);
  }

  ngAfterViewInit(){
    if(!localStorage.getItem('firstLoad'))
      this.toastr.success('Welcome to your online store!', `Hello ${this.user ? this.user.name : 'there'}`, { timeOut: 2000 });
    localStorage.setItem('firstLoad', 'false');
  }
}
