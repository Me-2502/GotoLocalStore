import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  recommendations = ['groceries', 'personal_care', 'household'];

  scrollToSection(item: string): void {
    const element = document.getElementById(item);
    if(element)
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
