import { Component } from '@angular/core';
import { SkeletonModule } from "primeng/skeleton";

@Component({
  selector: 'app-version-card-skeleton',
  imports: [SkeletonModule],
  templateUrl: './version-card-skeleton.html',
  styleUrl: './version-card-skeleton.scss',
})
export class VersionCardSkeleton {

}
