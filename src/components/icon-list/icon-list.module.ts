import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IconListComponent } from './icon-list';


@NgModule({
  declarations: [
    IconListComponent,
  ],
  imports: [
    IonicPageModule.forChild(IconListComponent),
  ],
  exports: [
    IconListComponent
  ]
})
export class IconListComponentModule {}
