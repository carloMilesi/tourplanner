import {Component, NgZone} from '@angular/core';
import {NavController, NavParams, App, AlertController, Platform} from 'ionic-angular';
import {PoiDetailsPage} from './poi-details';
//import {PercorsiPage} from '../percorsi/percorsi';

import { ModalController } from 'ionic-angular';
import {PoiService} from '../../services/poi.service'


@Component({
  templateUrl: 'poi-list.html',
  providers: [PoiService]

})
export class PoiListPage {
  private selectedItem: any;
  private icons: string[];
  private items: any;
  private pathway : any = null;

  constructor(
      public params: NavParams,
      public modalCtrl: ModalController
      , public poiService: PoiService
  ) {
    console.log("poi root constructor")


    this.selectedItem = this.params.get('item');
    this.pathway = params.get('pathway');

    if(this.pathway){
      this.items = this.pathway.points;
    } else {
      this.loadPoi();
    }

  }
  loadPoi(){
    let self = this;

    this.poiService.load('http://156.148.14.146:3020/api/v1/' + this.selectedItem.path,

      (data) => {
        this.items = data;
        for(let i = 0; i < this.items.length; i++){
          this.items[i].bgcolor = this.getColor();
        }
      });

  }


  itemTapped(event, item) {
    let modal = this.modalCtrl.create(PoiDetailsPage, {item});
    modal.present();

    // this.navCtrl.push(PoiDetailsPage, {
    //   item: item
    // });
  }




  getColor(){
    return "#" + Math.floor(Math.random()*16777215).toString(16);
  }

}
