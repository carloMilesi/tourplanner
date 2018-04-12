import { Component, Input } from '@angular/core';

/**
 * Generated class for the AccessibilityComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'accessibility',
  templateUrl: 'accessibility.html'
})
export class AccessibilityComponent {

  @Input() value:string;

  text: string;

  constructor() {
    
  }



  createAccessibility(val)
  {
    let val_str:string = '';
    
    if (typeof val != 'undefined')
    {
      if (val == 1)
      {
        val_str = '<img src="img/accessibility.png" height="18">';
      }
        else if (val == 0)
      {
        val_str = '<img src="img/no_accessibility.jpg" height="24">';
      }
      
    }
       
    return val_str;
  }

}
