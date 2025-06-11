import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../Models/user';
import { LoginService } from '../Services/login.service';

@Component({
  selector: 'app-search',
  standalone: false,
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  @Input() searchedText: string = '';
  login = inject(LoginService);
  user: User = JSON.parse(localStorage.getItem('prevUser') as string);

  @Output() search = new EventEmitter<string>();

  constructor(private router: Router){}

  searchProduct(){
    this.search.emit(this.searchedText.trim());
    this.router.navigate(['searched/' + this.searchedText.trim()]);
  }
}
