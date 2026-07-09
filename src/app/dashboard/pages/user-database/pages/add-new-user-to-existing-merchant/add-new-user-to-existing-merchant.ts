import { Component, OnInit } from '@angular/core';
import { SharedTextInputComponent } from '../../../../shared/components/shared-text-input/shared-text-input.component';
import { SharedSelectComponent } from '../../../../shared/components/shared-select/shared-select.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';


@Component({
  selector: 'app-add-new-user-to-existing-merchant',
  imports: [SharedTextInputComponent, SharedSelectComponent, ReactiveFormsModule, ToggleSwitchModule],
  templateUrl: './add-new-user-to-existing-merchant.html',
  styleUrl: './add-new-user-to-existing-merchant.scss',
})
export class AddNewUserToExistingMerchant implements OnInit {
  userForm!: FormGroup;
  emailOptions = [
    { label: 'john.doe@example.com', value: 'john.doe@example.com' },
    { label: 'jane.smith@example.com', value: 'jane.smith@example.com' },
    { label: 'admin@example.com', value: 'admin@example.com' },
  ];
  roleOptions = [
    { label: 'مدير', value: 'manager' },
    { label: 'موظف', value: 'employee' },
    { label: 'موظف المبيعات', value: 'sales' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      branch: ['', Validators.required],
      phone: [''],
      role: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
    }
  }
}
