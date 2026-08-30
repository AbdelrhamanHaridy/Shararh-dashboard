import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-faqs-loading-skeletons',
  imports: [SkeletonModule, CommonModule],
  templateUrl: './faqs-loading-skeletons.html',
})
export class FaqsLoadingSkeletons {}
