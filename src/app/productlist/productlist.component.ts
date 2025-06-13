import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
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

  currentIndex = 0;
  products!: Product[];
  filteredProducts: Product[] = [];
  http = inject(HttpClient);
  currentPage = 0;
  itemsPerPage = 4;
  pause = !this.isHorizontal;
  
  ngOnInit(){
    this.loadProducts();
  }

  loadProducts(filter: string = ''){
    if(filter)
      this.filterText = filter;
    if(this.productDetails)
      this.http.get('http://localhost:3000/products?category=' + this.productDetails.category).subscribe((data: any) => {
        this.products = data;
        this.filteredProducts = this.products;
      });
    else if(this.filterText)
      this.http.get('http://localhost:3000/products?filter=' + this.filterText).subscribe((data: any) => {
        this.products = data;
        console.log(this.products);
        this.filteredProducts = this.products;
      });
    else
      this.http.get('http://localhost:3000/products').subscribe((data: any) => {
        this.products = data;
        this.filteredProducts = this.products;
      });
  }

  onFilterChange(filters: any){
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

  // get totalPages() {
  //   return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  // }

  // displayedProducts() {
  //   const start = this.currentPage;
  //   const end = start + this.itemsPerPage < this.filteredProducts.length ? this.itemsPerPage + start : this.filteredProducts.length;
  //   const loop = this.itemsPerPage - (end - start);
  //   console.log(start, end, loop)
  //   return [
  //     ...this.filteredProducts.slice(start, end),
  //     ...this.filteredProducts.slice(0, loop)
  //   ];
  // }

  // nextPage() {
  //   setTimeout(() => {
  //     this.currentPage++;
  //     this.currentPage = this.currentPage % this.filteredProducts.length;
  //   }, 500);
  // }

  // prevPage() {
  //   setTimeout(() => {
  //     this.currentPage--;
  //     this.currentPage = this.currentPage % this.filteredProducts.length;
  //     if(this.currentPage < 0)
  //       this.currentPage += this.filteredProducts.length;
  //   }, 500);
  // }

  
  // Group products 3 per slide
  
  groupedProducts(){
    return this.filteredProducts.length > 7 ? [...this.filteredProducts, ...this.filteredProducts] : [...this.filteredProducts, ...this.filteredProducts, ...this.filteredProducts];
  }

  goToPage(page: number) {
    this.currentPage = page;
  }
}
