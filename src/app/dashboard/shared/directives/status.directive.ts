import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appStatusBadge]',
})
export class StatusBadgeDirective implements OnChanges {
  @Input('appStatusBadge') status!: string;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnChanges(): void {
    if (!this.status) return;

    const value = this.status.trim().toLowerCase();

    let color = '';
    let label = this.status;

    switch (value) {
      case 'نشط':
        color = '#46EC13';
        label = 'نشط';
        break;
      case 'غير نشط':
        color = '#F44336';
        label = 'غير نشط';
        break;
      case 'offline':
        color = '#F44336';
        label = 'غير نشط';
        break;
      default:
        color = '#9E9E9E';
        label = 'آخر';
        break;
    }

    this.el.nativeElement.innerHTML = '';

    this.renderer.setStyle(this.el.nativeElement, 'display', 'inline-flex');
    this.renderer.setStyle(this.el.nativeElement, 'align-items', 'center');
    this.renderer.setStyle(this.el.nativeElement, 'gap', '4px');
    this.renderer.setStyle(this.el.nativeElement, 'font-size', '12px');
    this.renderer.setStyle(this.el.nativeElement, 'font-weight', '500');
    // this.renderer.setStyle(this.el.nativeElement, 'color', 'color');
    this.renderer.setStyle(this.el.nativeElement, 'color', '#6B7280');

    const circle = this.renderer.createElement('span');
    this.renderer.setStyle(circle, 'width', '8px');
    this.renderer.setStyle(circle, 'height', '8px');
    this.renderer.setStyle(circle, 'border-radius', '50%');
    this.renderer.setStyle(circle, 'background-color', color);
    this.renderer.appendChild(this.el.nativeElement, circle);

    // Create the label text
    const text = this.renderer.createText(label);
    this.renderer.appendChild(this.el.nativeElement, text);
  }
}
