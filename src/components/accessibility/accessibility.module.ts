import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccessibilityComponent } from './accessibility';

@NgModule({
  declarations: [
    AccessibilityComponent,
  ],
  imports: [
    IonicPageModule.forChild(AccessibilityComponent),
  ],
  exports: [
    AccessibilityComponent
  ]
})
export class AccessibilityComponentModule {}
