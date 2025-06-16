import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../Models/user';
import { LoginService } from '../Services/login.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  users!: User[];
  loginForm!: FormGroup;
  loginService = inject(LoginService);
  failedLoginPopup = false;
  http: HttpClient = inject(HttpClient);

  constructor(private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null),
      phone: new FormControl(null),
      password: new FormControl(null)
    });
    // this.loadUsersFromLocalStorage();
  }

  onSubmit() {
    let user = this.loginForm.value;
    if(user == undefined) {
      this.toggleFailedLoginPopup();
      return;
    }
    this.http.post('http://localhost:3000/user/login', user).subscribe((response: any) => {
      let logger = response;
      console.log(logger);
      if(logger != undefined){
        this.loginService.logUser = logger;
        this.router.navigate(['home']);
        this.toastr.success('Successfully logged in.', 'Success', { timeOut: 2000, closeButton: true });
      }
      else{
        this.toggleFailedLoginPopup();
        this.toastr.error("Can't find user with given credentials.", 'Error', { timeOut: 2000, closeButton: true });
      }
    });
  }

  signup() {
    this.router.navigate(['signup']);
  }

  // private loadUsersFromLocalStorage() {
  //   const data = localStorage.getItem('users');
  //   if(data && data.name != '')
  //     this.users = JSON.parse(data).map((user: any) => new User(user.name, user.email, user.phone, user.password, user.number, user.email, user.password, user.premium));
  // }

  toggleFailedLoginPopup() {
    this.failedLoginPopup = !this.failedLoginPopup;
  }
}
