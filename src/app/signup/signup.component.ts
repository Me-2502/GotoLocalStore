import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../Models/user';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupForm!: FormGroup;
  newUser!: User;
  users!: User[];
  failedSignupPopup = false;
  http: HttpClient = inject(HttpClient);

  constructor(private router: Router, private toastr: ToastrService){}

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      name: new FormControl(null),
      email: new FormControl(null),
      phone: new FormControl(null),
      password: new FormControl(null)
    });
    this.loadUsersFromLocalStorage();
  }

  onSubmit(){
    this.newUser = this.signupForm.value;
    if(this.users == undefined)
      this.users = [this.newUser];
    this.http.post('http://localhost:3000/user/create', this.newUser).subscribe((response: any) => {
      console.log(response);
      this.toastr.success('Successfully created account.', 'Success', { timeOut: 2000, closeButton: true });
    }, error => {
      console.log(error);
      let errorMessage = error.error?.message || 'Failed to create account.';
      this.toastr.error(errorMessage  , 'Error', { timeOut: 2000 , closeButton: true });
    });
    this.resetForm();
  }

  storeToLocale(){
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  resetForm(){
    this.signupForm.reset();
  }

  login(){
    this.router.navigate(['login']);
  }

  private loadUsersFromLocalStorage(){
    const data = localStorage.getItem('users');
    if(data)
      this.users = JSON.parse(data).map((user: any) => new User(user.name, user.email, user.phone, user.password, user.number, user.email, user.password, user.premium));
  }

  toggleFailedSignupPopup(){
    this.failedSignupPopup = !this.failedSignupPopup;
  }
}
