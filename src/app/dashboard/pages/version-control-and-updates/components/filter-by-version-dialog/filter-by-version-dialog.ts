import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

interface VersionOption {
  id: string;
  version: string;
  usersLabel: string;
}

interface VersionGroup {
  id: string;
  title: string;
  selectedId: string;
  options: VersionOption[];
}

@Component({
  selector: 'app-filter-by-version-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-by-version-dialog.html',
  styleUrl: './filter-by-version-dialog.scss',
})
export class FilterByVersionDialog {
  constructor(private readonly ref: DynamicDialogRef) {}

  groups: VersionGroup[] = [
    {
      id: 'admin',
      title: 'إصدارات تطبيق الأدمن',
      selectedId: 'admin-v1.0.7',
      options: [
        { id: 'admin-v1.0.7', version: 'v1.0.7', usersLabel: '١٢ مستخدم' },
        { id: 'admin-v1.0.6', version: 'v1.0.6', usersLabel: '٨ مستخدم' },
        { id: 'admin-v1.0.5', version: 'v1.0.5', usersLabel: '٤ مستخدم' },
      ],
    },
    {
      id: 'employee',
      title: 'إصدارات تطبيق الموظفين',
      selectedId: 'employee-v2.1.1',
      options: [
        { id: 'employee-v2.1.2', version: 'v2.1.2', usersLabel: '٤٥ مستخدم' },
        { id: 'employee-v2.1.1', version: 'v2.1.1', usersLabel: '٢٢ مستخدم' },
        { id: 'employee-v2.1.0', version: 'v2.1.0', usersLabel: '١٧ مستخدم' },
      ],
    },
  ];

  selectVersion(group: VersionGroup, optionId: string): void {
    group.selectedId = optionId;
  }

  onClearAll(): void {
    this.groups.forEach((group) => (group.selectedId = ''));
  }

  onClose(): void {
    this.ref.close();
  }

  onApplyFilter(): void {
    const selections = this.groups.map((group) => ({
      groupId: group.id,
      selectedId: group.selectedId,
    }));
    console.log('Applying filter', selections);
    // TODO: emit selections / call API with the chosen versions
  }
}
