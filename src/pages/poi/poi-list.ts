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

  private path: string;
  private items: any;
  private pathway : any = null;
  public rating: string;
  private pathway_opt : any = null;

  constructor(
      public params: NavParams,
      public modalCtrl: ModalController,
      public alertCtrl: AlertController,
      public poiService: PoiService,
      private navCtrl: NavController,
      public app : App
  ) {
    console.log("Poi list constructor")

    this.path = params.get('path');
    this.pathway = params.get('pathway');
    

    if(this.pathway){
      console.log(JSON.stringify(this.pathway));
      this.items = this.pathway.points;
    }
    else if (this.pathway_opt)
    {

    }
     else {
      this.loadPoi();
    }
  }

/** 
Load list of POI
*/
  loadPoi(){
    this.poiService.load('http://seitre.crs4.it:3009/api/v1/' + this.path,
      (data) => {
        this.items = data;
        for(let i = 0; i < this.items.length; i++){
          this.items[i].bgcolor = this.getColor();
          this.items[i].timetovisit = this.items[i].time_to_visit;
          this.items[i].category = this.path;
          if (this.items[i].category == 'restaurants')
              this.items[i].description = this.items[i].address;
          
        }
      });


  }




createRating(rating)
{
  let rate_str:string = '';
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
      return rate_str;
}




/*
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
  */

  itemTapped(event, item) {
    let _path: string =  this.path;
    let modal = this.modalCtrl.create(PoiDetailsPage, {item, _path});
    modal.present();
     
    //this.app.getRootNav().push(PoiDetailsPage , {
    //    item: item
    //  })
  }




  getColor(){
    return "#" + Math.floor(Math.random()*16777215).toString(16);
  }

  optimizePathway(){
      console.log('+++++++++++++++++++++++++');
      console.log(this.pathway);
      this.poiService.load_optimize('http://192.167.144.196:5010/requestTrip/ ', this.pathway,
      (data) => {
        console.log('+++++++++++++++++++++++++');
        console.log(data);
        this.items = data;
        for(let i = 0; i < this.items.length; i++){
          this.items[i].bgcolor = this.getColor();
          this.items[i].timetovisit = this.items[i].time_to_visit;
          this.items[i].category = this.path;
          if (this.items[i].category == 'restaurants')
              this.items[i].description = this.items[i].address;
          
        }
      });




    let alert = this.alertCtrl.create({
      title: "Ottimizzazione percorso",
      subTitle: "Funzione non ancora disponibile --------------",
      buttons: ['OK']
    });
    alert.present();
  }

}
