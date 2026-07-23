import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appRoleBadge]',
})
export class RoleBadgeDirective implements OnChanges {
  @Input('appRoleBadge') role!: string;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnChanges(): void {
    if (!this.role) return;

    const value = this.role.trim().toLowerCase();

    let color = '';
    let bgColor = '';
    let label = this.role;

    console.log(value);
    switch (value) {
      case 'admin':
        color = '#7C3AED'; // Purple
        bgColor = '#7C3AED1A'; // Purple with opacity
        label = 'مشرف'; // Admin in Arabic
        break;
      case 'تاجر':
        color = '#10A922';
        bgColor = '#10A92233';
        label = 'تاجر';
        break;
      case 'مندوب':
        color = '#3B82F6';
        bgColor = '#3B82F61A';
        label = 'مندوب';
        break;
      case 'كاشير':
        color = '#F59E0B';
        bgColor = '#F59E0B1A';
        label = 'كاشير';
        break;
      default:
        color = '#9E9E9E';
        bgColor = '#9E9E9E33';
        label = 'آخر';
        break;
    }

    this.el.nativeElement.innerHTML = '';

    // Badge container styling
    this.renderer.setStyle(this.el.nativeElement, 'display', 'inline-flex');
    this.renderer.setStyle(this.el.nativeElement, 'align-items', 'center');
    this.renderer.setStyle(this.el.nativeElement, 'justify-content', 'center');
    this.renderer.setStyle(this.el.nativeElement, 'padding', '4px 12px');
    this.renderer.setStyle(this.el.nativeElement, 'border-radius', '9999px');
    this.renderer.setStyle(this.el.nativeElement, 'background-color', bgColor);
    this.renderer.setStyle(this.el.nativeElement, 'font-family', 'Tajawal');
    this.renderer.setStyle(this.el.nativeElement, 'font-size', '12px');
    this.renderer.setStyle(this.el.nativeElement, 'font-weight', '500');
    this.renderer.setStyle(this.el.nativeElement, 'line-height', '100%');
    this.renderer.setStyle(this.el.nativeElement, 'letter-spacing', '0px');
    this.renderer.setStyle(this.el.nativeElement, 'text-align', 'right');
    this.renderer.setStyle(this.el.nativeElement, 'vertical-align', 'middle');
    this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
    this.renderer.setStyle(this.el.nativeElement, 'color', color);
    this.renderer.setStyle(this.el.nativeElement, 'height', '22px');
    this.renderer.setStyle(this.el.nativeElement, 'width', 'fit-content');

    // Create the label text
    const text = this.renderer.createText(label);
    this.renderer.appendChild(this.el.nativeElement, text);
  }
}