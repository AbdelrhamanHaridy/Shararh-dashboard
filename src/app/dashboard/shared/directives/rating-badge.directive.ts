import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appRatingBadge]',
})
export class RatingBadgeDirective implements OnChanges {
  @Input('appRatingBadge') rating!: string;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnChanges(): void {
    if (!this.rating) return;

    const value = this.rating.trim().toLowerCase();

    let color = '';
    let bgColor = '';
    let label = this.rating;

    console.log(value);
    switch (value) {
      case 'ممتازة':
        color = '#166500';
        bgColor = '#B8F397';
        label = 'ممتازة';
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
