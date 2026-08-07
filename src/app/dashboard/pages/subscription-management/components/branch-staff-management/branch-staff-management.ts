import { Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-branch-staff-management',
  imports: [],
  templateUrl: './branch-staff-management.html',
  styleUrl: './branch-staff-management.scss',
})
export class BranchStaffManagement implements OnInit {
  // Data properties
  branches: any[] = [];
  selectedBranch: any = null;
  staffMembers: any[] = [];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
  ) {}

  ngOnInit() {
    // Initialize your data here
    this.loadBranches();
    this.loadStaff();

    // You can access data passed from the parent component
    if (this.config.data) {
      console.log('Data received:', this.config.data);
      // Use the data as needed
    }
  }

  loadBranches() {
    // Example data - replace with your actual data
    this.branches = [
      { id: 1, name: 'Main Branch' },
      { id: 2, name: 'Secondary Branch' },
      { id: 3, name: 'Third Branch' },
    ];
  }

  loadStaff() {
    // Example data
    this.staffMembers = [
      { id: 1, name: 'John Doe', role: 'Manager' },
      { id: 2, name: 'Jane Smith', role: 'Staff' },
    ];
  }

  // Method to close dialog with data
  closeDialog(data?: any) {
    this.ref.close(data);
  }

  // Method to save and close
  saveAndClose() {
    // Do your save logic here
    const result = {
      success: true,
      data: {
        branch: this.selectedBranch,
        staff: this.staffMembers,
      },
    };
    this.closeDialog(result);
  }
}
