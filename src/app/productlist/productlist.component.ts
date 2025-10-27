import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, Input, Output, HostListener } from '@angular/core';
import { Product } from '../Models/product';

@Component({
  selector: 'app-productlist',
  standalone: false,
  templateUrl: './productlist.component.html',
  styleUrl: './productlist.component.css'
})
export class ProductlistComponent {
  @Input() productDetails!: {category: string};
  @Input() isHorizontal: boolean = true;
  @Input() filterText: string = '';

  @Output() selectedProduct = new EventEmitter<string>();
  @Output() filterOptions = new EventEmitter<{ brands?: string[], categories?: string[], dynamicFilters?: { [key: string]: string[] } }>();

  currentIndex = 0;
  products!: Product[];
  filteredProducts: Product[] = [];
  http = inject(HttpClient);
  pause = !this.isHorizontal;
  isMobile = window.innerWidth <= 767;
  currentPage = 1;
  itemsPerPage = 10;
  totalProducts = 0;
  totalPages = 0;

  @HostListener('window:resize', [])
  onResize() {
    this.isMobile = window.innerWidth <= 767;
  }
  
  ngOnInit(){
    this.loadProducts();
  }

  loadProducts(filter: string = '', page: number = 1){
    if(filter)
      this.filterText = filter;
    // if(this.productDetails)
    //   this.http.get('http://localhost:3000/products?category=' + this.productDetails.category).subscribe((data: any) => {
    //     this.products = data;
    //     this.filteredProducts = this.products;
    //   });
    // else if(this.filterText)
    //   this.http.get('http://localhost:3000/products?filter=' + this.filterText).subscribe((data: any) => {
    //     this.products = data.products;
    //     this.filteredProducts = this.products;
    //     this.filterOptions.emit({
    //       brands: data.brand,
    //       categories: data.category,
    //       dynamicFilters: data.dynamicFilters
    //     });
    //   });
    // else
    //   this.http.get('http://localhost:3000/products').subscribe((data: any) => {
    //     this.products = data;
    //     this.filteredProducts = this.products;
    //   });
    if (this.productDetails) {
      this.http
        .get(`http://localhost:3000/products?category=${this.productDetails.category}`).subscribe((data: any) => {
          this.products = data.products;
          this.filteredProducts = this.products;
        });
    }
    else if (this.filterText) {
      this.http
        .get(`http://localhost:3000/products?filter=${this.filterText}&page=${page}&limit=${this.itemsPerPage}`).subscribe((data: any) => {
          this.products = data.products;
          this.filteredProducts = this.products;
          this.totalProducts = data.totalProducts;
          this.totalPages = data.totalPages;
          this.currentPage = data.currentPage;
          this.filterOptions.emit({
            brands: data.brand,
            categories: data.category,
            dynamicFilters: data.dynamicFilters,
          });
        });
    }
    else {
      this.http
        .get(`http://localhost:3000/products?page=${page}&limit=${this.itemsPerPage}`).subscribe((data: any) => {
          this.products = data.products;
          this.filteredProducts = this.products;
          this.totalProducts = data.totalProducts;
          this.totalPages = data.totalPages;
          this.currentPage = data.currentPage;
        });
    }
  }

  onFilterChange(filters: any){
    console.log(filters);
    this.filteredProducts = this.products.filter(product => {
      const nameMatch = filters.searchText?.trim() ? product.name.toLowerCase().includes(filters.searchText.toLowerCase()) : true;
      const categoryMatch = filters.category.length > 0 ? filters.category.includes(product.category) : true;
      const brandMatch = filters.brand.length > 0 ? filters.brand.includes(product.brand) : true;
      const priceMatch = (
        (filters.minPrice == null || product.price >= filters.minPrice) &&
        (filters.maxPrice == null || product.price <= filters.maxPrice)
      );
      const available = filters.availability != undefined && (filters.availability != ''
        ? (filters.availability as string).toLowerCase() == 'true' ? product.available : !product.available : true);
      const discountMatch = filters.minDiscount ? (product.discount || 0) >= filters.minDiscount : true;

      return nameMatch && categoryMatch && brandMatch && priceMatch && available && discountMatch;
    });
  }

  productClicked(s: string){
    this.selectedProduct.emit(s);
  }
  
  groupedProducts(){
    return this.filteredProducts.length > 7 ? [...this.filteredProducts, ...this.filteredProducts] : [...this.filteredProducts, ...this.filteredProducts, ...this.filteredProducts];
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadProducts(this.filterText, page);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }
}
