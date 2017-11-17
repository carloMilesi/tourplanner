import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, ModalController } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';

// import { Slides } from 'ionic-angular';
import { Platform } from 'ionic-angular';

import { PercorsiPage } from "../percorsi/percorsi";



@Component({
  selector: "poi-details",
  templateUrl: 'poi-details.html'
})
export class PoiDetailsPage {
  @ViewChild('details') map_details;
  
  private edited: boolean = true;
  private selectedItem: any;
  private paths: any;
  
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
    
    
    this.selectedItem.category = this.translate.instant('PAGE_' + this.selectedItem.category.toUpperCase());
    
  }

  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }


  openPathways($event, selectedItem){
    let _path: string = this.path;
    let profileModal = this.modalCtrl.create(PercorsiPage, { adding: true, poi: selectedItem, _path: this.path });
    profileModal.present();
  }


}
