import { Component } from '@angular/core';
import { SkeletonModule } from "primeng/skeleton";

@Component({
  selector: 'app-subscription-card-skeleton',
  imports: [SkeletonModule],
  templateUrl: './subscription-card-skeleton.html',
  styleUrl: './subscription-card-skeleton.scss',
})
export class SubscriptionCardSkeleton {

}
