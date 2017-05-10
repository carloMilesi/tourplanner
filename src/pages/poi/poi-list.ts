import { Component, ViewChild} from '@angular/core';
import { Nav, ModalController, App, NavController, NavParams } from 'ionic-angular';

import {PoiDetailsPage} from './poi-details';
import {PoiService} from '../../services/poi.service'


@Component({
  templateUrl: 'poi-list.html',
  providers: [PoiService]

})
export class PoiListPage {
   @ViewChild(Nav) nav: Nav;

  private selectedItem: any;
  private items: any;
  private pathway : any = null;

  constructor(
      public params: NavParams,
      public modalCtrl: ModalController
      , public poiService: PoiService
      , private navCtrl: NavController
      , public app : App
  ) {
    console.log("Poi list constructor")

    this.selectedItem = this.params.get('item');
    this.pathway = params.get('pathway');

    if(this.pathway){
      this.items = this.pathway.points;
    } else {
      this.loadPoi();
    }

  }
  loadPoi(){
    this.poiService.load('http://seitre.crs4.it:3009/api/v1/' + this.selectedItem.path,
      (data) => {
        this.items = data;
        console.log(this.selectedItem.path);
        console.log(JSON.stringify(data));
        for(let i = 0; i < this.items.length; i++){
          this.items[i].bgcolor = this.getColor();
        }
      });

  }


  itemTapped(event, item) {
    let modal = this.modalCtrl.create(PoiDetailsPage, {item});
    modal.present();
     
    //this.app.getRootNav().push(PoiDetailsPage , {
    //    item: item
    //  })
  }




  getColor(){
    return "#" + Math.floor(Math.random()*16777215).toString(16);
  }

}
