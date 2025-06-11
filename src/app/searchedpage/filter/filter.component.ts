import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filter',
  standalone: false,
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
  @Input() categories: string[] = [];
  @Input() brands: string[] = ['Apple', 'Dell', 'HP', 'Lenovo', 'Samsung'];
  @Input() dynamicFilters: { [key: string]: string[] } = {};

  @Output() filtersChanged = new EventEmitter<any>();

  filters: any = {
    searchText: '',
    category: [],
    brand: [],
    availability: '',
    minPrice: 0,
    maxPrice: null,
    dynamic: {},
  };

  applyFilters() {
    this.filtersChanged.emit(this.filters);
  }

  resetFilters() {
    this.filters = {
      searchText: '',
      category: [],
      brand: [],
      availability: '',
      minPrice: 0,
      maxPrice: null,
      dynamic: {},
    };
    this.applyFilters();
  }

  toggleCategory(category: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if(isChecked && !this.filters.category.includes(category))
      this.filters.category.push(category);
    else
      this.filters.category = this.filters.category.filter((c: any) => c !== category);
  }
  
  toggleBrand(brand: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if(isChecked && !this.filters.brand.includes(brand))
      this.filters.brand.push(brand);
    else
      this.filters.brand = this.filters.brand.filter((b: any) => b !== brand);
  }  

  toggleDynamicValue(key: string, value: string) {
    if(!this.filters.dynamic[key])
      this.filters.dynamic[key] = new Set<string>();
    const set = this.filters.dynamic[key];
    if(set.has(value))
      set.delete(value);
    else
      set.add(value);
  }

  isDynamicValueChecked(key: string, value: string): boolean {
    return this.filters.dynamic[key]?.has(value);
  }
}
