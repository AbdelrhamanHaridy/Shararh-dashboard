import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedTextInputComponent } from '../../shared/components/shared-text-input/shared-text-input.component';

@Component({
  selector: 'app-subscription-management',
  imports: [SharedTextInputComponent, ReactiveFormsModule],
  templateUrl: './subscription-management.html',
  styleUrl: './subscription-management.scss',
})
export class SubscriptionManagement implements OnInit {
  userForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
    }
  }
}
