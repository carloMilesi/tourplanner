import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PathwayInsertPage } from './pathway-insert';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PathwayInsertPage,
  ],
  imports: [
    IonicPageModule.forChild(PathwayInsertPage),
    TranslateModule.forChild(),
  ],
  exports: [
    PathwayInsertPage
  ]
})
export class PathwayInsertPageModule {}
