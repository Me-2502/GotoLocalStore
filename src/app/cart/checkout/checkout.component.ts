import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrdercartService } from '../../Services/ordercart.service';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  step = 1;
  paymentMethods = ['Credit Card', 'Debit Card', 'UPI', 'Cash on Delivery'];
  selectedMethod: string | null = null;
  checkoutForm: FormGroup;
  paymentForm: FormGroup;
  http = inject(HttpClient);
  service = inject(OrdercartService);
  totalPrice: number = 0;
  date = new Date();
  user = JSON.parse(localStorage.getItem('prevUser') as string);

  constructor(private fb: FormBuilder) {
    this.checkoutForm = this.fb.group({
      fullName: [this.user.name, Validators.required],
      phone: [this.user.phone, [Validators.required, Validators.pattern(/^\d{10}$/)]],
      address: ['', Validators.required],
      deliveryDate: ['']
    });

    this.paymentForm = this.fb.group({
      cardNumber: [''],
      expiry: [''],
      cvv: [''],
      upiId: [''],
    });
  }

  ngOnInit(): void {
    this.date.setDate(this.date.getDate() + 2);
    this.checkoutForm.get('deliveryDate')?.setValue(this.date.toISOString().substring(0, 10));
    this.totalPrice = this.service.totalPrice;
  }

  setAddress(){
    this.checkoutForm.get('address')?.setValue(this.user.address);
  }

  goToStep2() {
    if (this.checkoutForm.valid)
      this.step = 2;
    else
      this.checkoutForm.markAllAsTouched();
  }

  selectPaymentMethod(method: string) {
    this.selectedMethod = method;
    this.resetPaymentForm();
    this.setPaymentValidators();
  }

  resetPaymentForm() {
    this.paymentForm.reset();
  }

  resetPayment() {
    this.selectedMethod = null;
    this.resetPaymentForm();
  }

  setPaymentValidators() {
    this.paymentForm.get('cardNumber')?.clearValidators();
    this.paymentForm.get('expiry')?.clearValidators();
    this.paymentForm.get('cvv')?.clearValidators();
    this.paymentForm.get('upiId')?.clearValidators();

    if (this.selectedMethod === 'Credit Card' || this.selectedMethod === 'Debit Card') {
      this.paymentForm.get('cardNumber')?.setValidators([Validators.required, Validators.pattern(/^\d{16}$/)]);
      this.paymentForm.get('expiry')?.setValidators([Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]);
      this.paymentForm.get('cvv')?.setValidators([Validators.required, Validators.pattern(/^\d{3,4}$/)]);
    }
    else if (this.selectedMethod === 'UPI')
      this.paymentForm.get('upiId')?.setValidators([Validators.required]);
    // No validators for Cash on Delivery

    // Update validity after setting validators
    this.paymentForm.get('cardNumber')?.updateValueAndValidity();
    this.paymentForm.get('expiry')?.updateValueAndValidity();
    this.paymentForm.get('cvv')?.updateValueAndValidity();
    this.paymentForm.get('upiId')?.updateValueAndValidity();
  }

  submitPayment() {
    if (this.selectedMethod === 'Cash on Delivery') {
      this.confirmCOD();
      return;
    }

    if (this.paymentForm.valid){
      console.log('Payment submitted:', {
        delivery: this.checkoutForm.value,
        payment: this.paymentForm.value,
        method: this.selectedMethod,
      });
      this.service.orderCart(this.checkoutForm.get('address')?.value, this.date.toISOString(), true, this.selectedMethod as string);
      this.step = 1;
      this.checkoutForm.reset();
      this.paymentForm.reset();
      this.selectedMethod = null;
    }
    else
      this.paymentForm.markAllAsTouched();
  }

  confirmCOD() {
    this.service.orderCart(this.checkoutForm.get('address')?.value, this.date.toISOString(), false, this.selectedMethod as string);
    this.step = 1;
    this.checkoutForm.reset();
    this.selectedMethod = null;
  }

  cancelPayment(){
    this.service.checkout = !this.service.checkout;
  }

  ngOnDestroy(){
    this.service.checkout = false;
  }
}