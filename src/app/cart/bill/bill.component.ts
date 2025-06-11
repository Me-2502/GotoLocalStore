import { Component, inject } from '@angular/core';
import { OrdercartService } from '../../Services/ordercart.service';

@Component({
  selector: 'app-bill',
  standalone: false,
  templateUrl: './bill.component.html',
  styleUrl: './bill.component.css'
})
export class BillComponent {
  service = inject(OrdercartService);

  makePayment(){
    this.service.checkout = !this.service.checkout;
  }
}
