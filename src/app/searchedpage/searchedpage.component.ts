import { Component, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductlistComponent } from '../productlist/productlist.component';

@Component({
  selector: 'app-searchedpage',
  standalone: false,
  templateUrl: './searchedpage.component.html',
  styleUrl: './searchedpage.component.css'
})
export class SearchedpageComponent {
  searchFor: string = '';
  activeRoute = inject(ActivatedRoute);

  @ViewChild(ProductlistComponent) productListComponent!: ProductlistComponent;

  constructor(private router: Router) {}

  ngOnInit(){
    this.activeRoute.paramMap.subscribe((data: any) => {this.searchFor = data.get('text') || ''});
  }

  changeList(filters: any){
    this.productListComponent.onFilterChange(filters);
  }

  changeSearchText(s: string){
    this.searchFor = s;
    this.productListComponent.loadProducts(s);
  }
}
