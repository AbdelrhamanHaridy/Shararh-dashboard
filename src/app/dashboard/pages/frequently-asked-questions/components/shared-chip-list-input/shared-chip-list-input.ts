import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChipModule } from 'primeng/chip';

@Component({
  selector: 'app-shared-chip-list-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ChipModule],
  templateUrl: './shared-chip-list-input.html',
  styleUrl: './shared-chip-list-input.scss',
})
export class SharedChipListInput {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() inputId = '';
  @Input() isRequired = false;
  @Input() inputType: 'text' | 'url' = 'text';
  /** Optional PrimeIcons class for each chip, e.g. 'pi pi-tag' */
  @Input() icon = '';
  @Input() values: string[] = [];
  @Output() valuesChange = new EventEmitter<string[]>();

  newValue = '';

  add(event?: Event) {
    event?.preventDefault();
    const value = this.newValue.trim();
    if (!value) return;

    if (this.values.includes(value)) {
      this.newValue = '';
      return;
    }

    this.valuesChange.emit([...this.values, value]);
    this.newValue = '';
  }

  remove(index: number) {
    this.valuesChange.emit(this.values.filter((_, i) => i !== index));
  }

  trackByIndex(index: number): number {
    return index;
  }
}
