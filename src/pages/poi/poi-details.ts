import { Component, ViewChild } from '@angular/core';
import { NavParams, ViewController, AlertController, ModalController } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';

import { PercorsiPage } from "../percorsi/percorsi";



@Component({
  selector: "poi-details",
  templateUrl: 'poi-details.html'
})
export class PoiDetailsPage {
  @ViewChild('details') map_details;
  
  private selectedItem: any;
  
  private path: string;
 
  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController,  
    private alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public translate: TranslateService

  ) {
    this.selectedItem = navParams.get('item');
    this.path = navParams.get('_path');
    
  }

  ionViewDidLoad() {
    this.map_details.setMapHeight("50%");
    this.map_details.loadMap(this.selectedItem);
    
    console.log(this.path);
    console.log(this.selectedItem);
    this.selectedItem.category = this.translate.instant('PAGE_' + this.selectedItem.category.toUpperCase());
    
  }

  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }


  openPathways($event, selectedItem){
    
    let profileModal = this.modalCtrl.create(PercorsiPage, { adding: true, poi: selectedItem, _path: this.path });
    profileModal.present();
  }


}
