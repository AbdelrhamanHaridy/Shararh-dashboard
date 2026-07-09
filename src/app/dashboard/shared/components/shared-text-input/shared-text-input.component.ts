import { CommonModule } from '@angular/common';
import { Component, Input, Optional, Self } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-shared-text-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextModule],
  templateUrl: './shared-text-input.component.html',
  styleUrls: ['./shared-text-input.component.scss'],
})
export class SharedTextInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() primeNgIcon = '';
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() inputId = '';
  @Input() isRequired = false;

  value = '';
  disabled = false;

  onChange: OnChangeFn<string> = () => {};
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
    return !!(this.control && this.control.invalid && (this.control.dirty || this.control.touched));
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
  }

  writeValue(value: any): void {
    this.value = value ?? '';
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
