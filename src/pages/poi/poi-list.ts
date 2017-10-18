import { Component, ViewChild} from '@angular/core';
import { Nav, ModalController, App, NavController, NavParams, AlertController } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';

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
  public difficolta_str: string;
  public timeToVisit_str_pw: string;
  public difficolta_str_pw: string;

  constructor(
      public params: NavParams,
      public modalCtrl: ModalController,
      public alertCtrl: AlertController,
      public poiService: PoiService,
      private navCtrl: NavController,
      public app : App,
      public translate: TranslateService
  ) {
    console.log("Poi list constructor")

    this.path = params.get('path');
    this.pathway = params.get('pathway');
    

    if(this.pathway){
      console.log(JSON.stringify(this.pathway));
      this.items = this.pathway.points;
    
      console.log('-----------' + this.pathway.difficolta);
      this.difficolta_str = this.createDifficulty(this.pathway.difficolta);
       





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


createDifficulty(difficolta)
{
    
    let diff : string = '';

    if (difficolta < 25){
      diff = this.translate.instant('PATHWAYS.LOW');
    }
     else if ((difficolta < 50)) {
       diff = this.translate.instant('PATHWAYS.MEDIUM');
     } 
     else if ((difficolta < 75)) {
       diff = this.translate.instant('PATHWAYS.GOOD');
     }
     else if ((difficolta < 100)) {
       diff = this.translate.instant('PATHWAYS.HIGH');
     }
     else if ((difficolta = 100)) {
       diff = this.translate.instant('PATHWAYS.VERYHIGH');
     }

     return diff;

}


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
      //console.log(this.pathway);
      this.poiService.load_optimize('http://192.167.144.196:5010/v1/requestTrip/ ', this.pathway,
      (data) => {
        
        
        this.items = data.Points;
        
        //console.log(this.items);
        //console.log("++++++++++++++++++++++++++++");
        
        
        let diff_tot: number = 0;
        let timeToVisit: number = 0;
        let count: number = 0;

        for(let i = 0; i < this.items.length; i++){
          
          count = count + 1;
          if (this.items[i].difficulty)
            diff_tot = diff_tot + parseInt(this.items[i].difficulty);
          if (this.items[i].DistanceTime)
            timeToVisit = timeToVisit + parseInt(this.items[i].DistanceTime) / 60;
          

          this.items[i].bgcolor = this.getColor();
          this.items[i].timetovisit = this.items[i].time_to_visit;
          this.items[i].category = this.path;
          
          //console.log(this.items[i].title);
          //console.log(this.items[i].rating);
          //console.log('Start_' + data.id_request);
          

          if ( this.items[i].title == 'Start_' + data.id_request)
          {
             this.items[i].title = this.translate.instant('PORT_POINT');
             this.items[i].description = this.translate.instant('PATHWAYS.START_POINT');
          }
          else if (this.items[i].title == 'Stop_'+ data.id_request)
          {
             this.items[i].title = this.translate.instant('PORT_POINT');
             this.items[i].description = this.translate.instant('PATHWAYS.END_POINT');
          }
          
          if (this.items[i].category == 'restaurants')
              this.items[i].description = this.items[i].address;
          
        }
        
         
         this.difficolta_str_pw = this.createDifficulty((Math.round(diff_tot/count)).toString());
         this.timeToVisit_str_pw = Math.round(timeToVisit).toString();
          

      });

}

/*
    let alert = this.alertCtrl.create({
      title: "Ottimizzazione percorso",
      subTitle: "Funzione non ancora disponibile --------------",
      buttons: ['OK']
    });
    alert.present();
  }

*/

}
