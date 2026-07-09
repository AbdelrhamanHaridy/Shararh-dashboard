import { Component, input } from '@angular/core';

@Component({
  selector: 'app-notification',
  imports: [],
  templateUrl: './notification.html',
  styleUrl: './notification.scss',
})
export class NotificationComponent {
  message = input<string>('');
  description = input<string>('');
  messageColor = input<string>('text-text-primary');
  bgColor = input<string>('bg-white');
  time = input<string>('');
  linkText = input<string>('');
  linkUrl = input<string>('');
}
