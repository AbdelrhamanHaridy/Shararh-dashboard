import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-add-new-user-layout',
  imports: [CommonModule, FormsModule, RadioButtonModule, RouterOutlet, PageHeaderComponent],
  templateUrl: './add-new-user-layout.html',
  styleUrl: './add-new-user-layout.scss',
})
export class AddNewUserLayout {
  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/' };

  breadcrumbItems: MenuItem[] = [{ label: 'قاعدة بيانات المستخدمين', routerLink: '/users' }];

  selectedUserType: string = 'existing'; // Default selection

  userTypes = [
    {
      id: 'new',
      title: 'تاجر لأول مرة في النظام',
      icon: 'pi pi-plus-circle',
      route: 'add-merchant-for-first-time',
    },
    {
      id: 'existing',
      title: 'مستخدم جديد لدى تاجر موجود',
      icon: 'pi pi-user-plus',
      route: 'add-new-user-to-existing-merchant',
    },
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    // Navigate to default route on init
    this.navigateToRoute(this.selectedUserType);
  }

  // Navigate when selection changes
  onUserTypeChange() {
    this.navigateToRoute(this.selectedUserType);
  }

  private navigateToRoute(userTypeId: string) {
    const selectedType = this.userTypes.find((type) => type.id === userTypeId);
    if (selectedType) {
      this.router.navigate([`/user-database/add-new-user/${selectedType.route}`]);
    }
  }
  // user-database/add-new-user/add-new-user-to-existing-merchant
}
