import { Component, ViewChild} from '@angular/core';
import { Nav, ModalController, App, NavController, NavParams, AlertController } from 'ionic-angular';

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
      public modalCtrl: ModalController,
      public alertCtrl: AlertController,
      public poiService: PoiService,
      private navCtrl: NavController,
      public app : App
  ) {
    console.log("Poi list constructor")

    this.selectedItem = this.params.get('item');
    this.pathway = params.get('pathway');

    if(this.pathway){
      //console.log("***************")
      //console.log(JSON.stringify(this.pathway));
      //console.log("***************")
      this.items = this.pathway.points;
    } else {
      this.loadPoi();
    }
  }


  loadPoi(){
    this.poiService.load('http://seitre.crs4.it:3009/api/v1/' + this.selectedItem.path,
      (data) => {
        this.items = data;
        //console.log(this.selectedItem.path);
        //console.log(JSON.stringify(data));
        for(let i = 0; i < this.items.length; i++){
          this.items[i].bgcolor = this.getColor();
          this.items[i].rating = this.getRankingCategory(this.selectedItem.path);
          this.items[i].timetovisit = this.getTimeToVisit(this.selectedItem.path);
          this.items[i].category = this.selectedItem.path;
        }
      });

  }

  getRankingCategory(category){

    //assegna un valore di rating in base alla categoria
    let rating;

    if (category == "monuments")
      rating = 6;
    if (category == "museums")
      rating = 5;
    if (category == "archeoSites")
      rating = 4;
    if (category == "gardens")
      rating = 3;
    if (category == "restaurants")
      rating = 2;
    if (category == "events")
      rating = 1;


    return rating;
  }

  getTimeToVisit(category){

    //assegna un tempo medio di visita in base alla categoria
    let timeToVisit;

    if (category == "monuments")
      timeToVisit = 30;
    if (category == "museums")
      timeToVisit = 60;
    if (category == "archeoSites")
      timeToVisit = 30;
    if (category == "gardens")
      timeToVisit = 20;
    if (category == "restaurants")
      timeToVisit = 120;
    if (category == "events")
      timeToVisit = 0;  // durata dell'evento?


    return timeToVisit;
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

  optimizePathway(){
    let alert = this.alertCtrl.create({
      title: "Ottimizzazione percorso",
      subTitle: "Funzione non ancora disponibile",
      buttons: ['OK']
    });
    alert.present();
  }

}
