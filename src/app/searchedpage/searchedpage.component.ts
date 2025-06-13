import { Component, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductlistComponent } from '../productlist/productlist.component';
import { FilterComponent } from './filter/filter.component';

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
  @ViewChild(FilterComponent) filterComponent!: FilterComponent;

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

  setFilterOptions(filters: { brands?: string[], categories?: string[], dynamicFilters?: { [key: string]: string[] } }){
    if(filters.categories)
      this.filterComponent.categories = filters.categories;
    if(filters.brands)
      this.filterComponent.brands = filters.brands;
    if(filters.dynamicFilters)
      this.filterComponent.dynamicFilters = filters.dynamicFilters;
  }
}
