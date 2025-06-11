import { Injectable } from '@angular/core';
import { User } from '../Models/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private user!: User;

  constructor(){
    this.user = JSON.parse(<string>localStorage.getItem('prevUser'));
    if(this.user == null)
      this.user = new User('', -1, '', '', -1, '', '', false);
      localStorage.setItem('prevUser', JSON.stringify(this.user));
    }
    
    set logUser(logger: User){
      this.user = logger;
      localStorage.setItem('prevUser', JSON.stringify(this.user));
    }
    
    get userLoggedIn(){
      let prevUser = localStorage.getItem('prevUser');
      if(prevUser)
      return JSON.parse(prevUser);
      else
      return null;
    }
    
    clearUser(){
    this.user = new User('', -1, '', '', -1, '', '', false);
    localStorage.removeItem('prevUser');
  }
}