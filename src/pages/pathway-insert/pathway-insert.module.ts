import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PathwayInsertPage } from './pathway-insert';

@NgModule({
  declarations: [
    PathwayInsertPage,
  ],
  imports: [
    IonicPageModule.forChild(PathwayInsertPage),
  ],
  exports: [
    PathwayInsertPage
  ]
})
export class PathwayInsertPageModule {}
