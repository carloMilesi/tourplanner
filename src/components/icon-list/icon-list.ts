import { Component, Input } from '@angular/core';


@Component({
  selector: 'icon-list',
  templateUrl: 'icon-list.html'
})
export class IconListComponent {

  @Input() value:number;
  @Input() icon_name:string;
  @Input() align:string;

  constructor() {
  
  }



  createRating(rating)
  {
    
    let rate_str:string = '';
    
    if (typeof rating != 'undefined')
    {
      /*
      if (typeof icon_name != 'undefined')
          icon_name = 'heart';
      if (typeof align != 'undefined')
          align = 'item-right';
      if (typeof color != 'undefined')
          color = 'red';
      
      let icon_name: string;
      let align: string;
      let color: string;
      */
      
      //let src_1: string = '<ion-icon name="'+icon_name +'" ' + align + ' style="color: '+ color +'"></ion-icon>';

      let src_1: string = '<ion-icon name="heart" item-right style="color: red"></ion-icon>';

    switch(rating) {
                 case 1:
                   rate_str = src_1;
                 break;
                 case 2:
                   rate_str = src_1+ src_1;
                 break;
                 case 3:
                   rate_str = src_1+ src_1 + src_1;
                 break;
                 case 4:
                   rate_str = src_1+ src_1 + src_1+ src_1;
                 break;
                 case 5:
                   rate_str = src_1+ src_1 + src_1+ src_1 + src_1;
                 break;

     }
        }
        
        return '<div></div><ion-icon name="heart" item-right style="color: red"></ion-icon>' + rate_str;
  }

}
