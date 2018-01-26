import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StarRatingComponent } from './star-rating';

@NgModule({
  declarations: [
    StarRatingComponent,
  ],
  imports: [
    IonicPageModule.forChild(StarRatingComponent),
  ],
  exports: [
    StarRatingComponent
  ]
})
export class StarRatingComponentModule {}
