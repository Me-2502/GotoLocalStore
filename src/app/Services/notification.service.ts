import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NotificationComponent } from '../notification/notification.component';

export interface NotificationOptions {
  type: 'success' | 'danger' | 'info' | 'warning' | 'secondary';
  message: string;
  duration?: number;
  position?: 'top' | 'bottom';
  gravity?: 'left' | 'right' | 'center';
  stopOnFocus?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notification!: NotificationComponent;

  register(component: NotificationComponent) {
    this.notification = component;
  }

  showNotification(
    type: NotificationOptions['type'],
    duration: number = 3000,
    message: string,
    position: NotificationOptions['position'] = 'top',
    gravity: NotificationOptions['gravity'] = 'center',
    stopOnFocus: boolean = true
  ){
    if (this.notification)
      this.notification.show({
        type,
        duration,
        message,
        position,
        gravity,
        stopOnFocus,
      });
  }
}
