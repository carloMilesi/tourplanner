import { Component, Input } from '@angular/core';

/**
 * Generated class for the StarRatingComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'star-rating',
  templateUrl: 'star-rating.html'
})
export class StarRatingComponent {
  
  @Input() value:string;
  
  
  constructor() {
    console.log(this.value);
  }



  createRating(rating)
  {
    let rate_str:string = '';
    
    if (typeof rating != 'undefined')
    {
    let src_1: string = '<img src="img/if_star.png" height="20">';
    let src_2: string = '<img src="img/if_star-e.png" height="20">';
    
    switch(rating) {
                 case 1:
                   rate_str = src_1+ src_2 + src_2+ src_2 + src_2;
                 break;
                 case 2:
                   rate_str = src_1+ src_1 + src_2+ src_2 + src_2;
                 break;
                 case 3:
                   rate_str = src_1+ src_1 + src_1+ src_2 + src_2;
                 break;
                 case 4:
                   rate_str = src_1+ src_1 + src_1+ src_1 + src_2;
                 break;
                 case 5:
                   rate_str = src_1+ src_1 + src_1+ src_1 + src_1;
                 break;

     }
        }
        return rate_str;
  }


}
