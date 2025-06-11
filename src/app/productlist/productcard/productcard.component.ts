import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../Models/product';

@Component({
  selector: 'app-productcard',
  standalone: false,
  templateUrl: './productcard.component.html',
  styleUrl: './productcard.component.css'
})
export class ProductcardComponent {
  @Input() product!: Product;
  @Output() selected = new EventEmitter<string>();

  constructor(private router: Router){}

  showDetails(){
    this.selected.emit(this.product.id);
    this.router.navigate(['productdetails/' + this.product.id]);
  }

  hasDiscount(){
    return this.product?.discount !== undefined && this.product.discount > 0;
  }
}
