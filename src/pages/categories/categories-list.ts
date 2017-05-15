import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
//import {ItemDetailsPage} from '../item-details/item-details';
//import {PoiListPage} from '../poi/poi-list';
import {PoiRoot} from '../poi/poi';
import { TranslateService } from 'ng2-translate';


@Component({
  templateUrl: 'categories-list.html'
})
export class CategoriesListPage {
  selectedItem: any;
  icons: string[];
  //items: Array<{title: string, note: string, icon: string}>;
  items: Array<{title: string}>;

public categories : any = [ {title : this.translate.instant('PAGE_MONUMENTS'), path : "monuments"},
                            {title : this.translate.instant('PAGE_MUSEUMS'), path : "museums"},
                            {title : this.translate.instant('PAGE_ARCHEOLOGY'), path : "archeoSites"},
                            {title : this.translate.instant('PAGE_GARDENS'), path : "gardens"},
                            {title : this.translate.instant('PAGE_EVENTS'), path : "events"},
                            {title : this.translate.instant('PAGE_RESTAURANTS'), path : "restaurants"}];

  constructor(public navCtrl: NavController, navParams: NavParams,  public translate: TranslateService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.items = [];

    for(let i = 0; i < this.categories.length; i++){
      this.items.push(this.categories[i]);
    }


    /*
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    'american-football', 'boat', 'bluetooth', 'build'];


    for(let i = 1; i < 11; i++) {
      this.items.push({
        title: 'Item ' + i,
        note: 'This is item #' + i,
        icon: this.icons[Math.floor(Math.random() * this.icons.length)]
      });
    }

     */
  }

  itemTapped(event, item) {
    // this.navCtrl.push(PoiListPage, {
    //   item: item
    // });
    this.navCtrl.push(PoiRoot, {
      item: item
    });
  }
}
