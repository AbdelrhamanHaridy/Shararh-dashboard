import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-customer-card-skeleton',
  imports: [SkeletonModule],
  templateUrl: './customer-card-skeleton.html',
})
export class CustomerCardSkeleton {}
