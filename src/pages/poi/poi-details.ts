import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, ModalController } from 'ionic-angular';
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

 
  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController,  
    private alertCtrl: AlertController,
    public modalCtrl: ModalController

  ) {
    this.selectedItem = navParams.get('item');
    
  }

  ionViewDidLoad() {
    this.map_details.setMapHeight("50%");
    this.map_details.loadMap(this.selectedItem);

  }

  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }


  openPathways($event, selectedItem){
    let profileModal = this.modalCtrl.create(PercorsiPage, { adding: true, poi: selectedItem });
    profileModal.present();
  }


}
