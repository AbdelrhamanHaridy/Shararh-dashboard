import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeTime',
})
export class RelativeTimePipe implements PipeTransform {
  transform(dateString: string): string {
    if (!dateString) return '';

    const now = new Date();
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return dateString;
    }

    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Less than 1 minute
    if (diffMins < 1) {
      return 'الآن';
    }

    // Less than 1 hour
    if (diffHours < 1) {
      return `منذ ${diffMins} دقيقة`;
    }

    // Less than 24 hours
    if (diffDays < 1) {
      return `منذ ${diffHours} ساعة${diffHours > 1 ? 'ات' : ''}`;
    }

    // Yesterday
    if (diffDays === 1) {
      return `الأمس ${this.formatTime(date)}`;
    }

    // 2 or more days ago
    if (diffDays < 30) {
      return `منذ ${diffDays} يوم`;
    }

    // More than a month
    return this.formatDateArabic(date);
  }

  private formatTime(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Convert to 12-hour format
    const hour12 = date.getHours() % 12 || 12;
    const amPm = date.getHours() >= 12 ? 'م' : 'ص';

    return `${String(hour12).padStart(2, '0')}:${minutes} ${amPm}`;
  }

  private formatDateArabic(date: Date): string {
    const months = [
      'يناير',
      'فبراير',
      'مارس',
      'أبريل',
      'مايو',
      'يونيو',
      'يوليو',
      'أغسطس',
      'سبتمبر',
      'أكتوبر',
      'نوفمبر',
      'ديسمبر',
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const time = this.formatTime(date);

    return `${day} ${month} ${year} ${time}`;
  }
}
