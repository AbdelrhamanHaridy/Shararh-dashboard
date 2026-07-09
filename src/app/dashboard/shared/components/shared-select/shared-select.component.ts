import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Optional, Output, Self } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { SelectModule } from 'primeng/select';

export interface SelectOption {
  key?: string;
  value?: any;
  enTitle?: string;
  arTitle?: string;
  id?: number;
}

@Component({
  selector: 'app-shared-select',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SelectModule],
  templateUrl: './shared-select.component.html',
  styleUrls: ['./shared-select.component.scss'],
})
export class SharedSelectComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() primeNgIcon = '';
  @Input() placeholder = '';
  @Input() inputId = '';
  @Input() options: SelectOption[] = [];
  @Input() bindLabel = 'label';
  @Input() bindValue = 'value';
  @Input() disabledPlaceholder?: string;
  @Input() isRequired = false;
  @Input() requiredErrorMessage = 'This field is required';

  /** Which title field to prefer when an option has both enTitle and arTitle */
  @Input() titleLangKey: 'enTitle' | 'arTitle' = 'enTitle';

  @Output() selectChange = new EventEmitter<any>();

  value: any = null;
  disabled = false;

  onChange: OnChangeFn<any> = () => {};
  onTouched: OnTouchFn = () => {};

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  get control(): FormControl {
    return this.ngControl?.control as FormControl;
  }

  get isInvalid(): boolean {
    return !!(
      this.control &&
      this.control.invalid &&
      (this.control.dirty || this.control.touched)
    );
  }

  get currentPlaceholder(): string {
    return this.disabled && this.disabledPlaceholder
      ? this.disabledPlaceholder
      : this.placeholder;
  }

  /** Options mapped into the {label, value} shape p-select expects */
  get normalizedOptions(): { label: string; value: any }[] {
    return (this.options || []).map((option) => ({
      label: this.getOptionLabel(option),
      value: this.getOptionValue(option),
    }));
  }

  getOptionLabel(option: SelectOption): string {
    if (option.enTitle && option.arTitle) {
      return (option[this.titleLangKey] as string) ?? option.enTitle;
    }
    return (option as any)[this.bindLabel];
  }

  getOptionValue(option: SelectOption): any {
    if (option.id !== undefined && this.bindValue === 'value') {
      return option.id;
    }
    return (option as any)[this.bindValue];
  }

  onSelectionChange(value: any): void {
    this.value = value;
    this.onChange(value);
    this.selectChange.emit(value);
    this.onTouched();
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}

type OnChangeFn<T> = (value: T) => void;
type OnTouchFn = () => void;