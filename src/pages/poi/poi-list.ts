import { Component, ViewChild} from '@angular/core';
import { Nav, ModalController, App, NavController, ViewController, NavParams, AlertController, MenuController } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';


import {PoiDetailsPage} from './poi-details';
import {PoiService} from '../../services/poi.service';
import { LoadingController } from 'ionic-angular';
import { PathwaysService } from '../../services/pathways.service';
import { PoiRoot } from '../poi/poi';

@Component({
  templateUrl: 'poi-list.html',
  providers: [PoiService, PathwaysService]
})
export class PoiListPage {
   @ViewChild(Nav) nav: Nav;

  private path: string;
  private items: any;
  private pathway : any = null;
  public rating: string;
  public difficolta_str: string;
  public timeToVisit_str_pw: string;
  public difficolta_str_pw: string;

  public checkOptimize: number = 1; // [0: enable optimization, 1 disable optimization]
  public optimizeContent: string;
  private itemsExtra: any;

  constructor(
      private viewCtrl: ViewController,
      public params: NavParams,
      public modalCtrl: ModalController,
      public alertCtrl: AlertController,
      public poiService: PoiService,
      private navCtrl: NavController,
      public app : App,
      public translate: TranslateService,
      public pathwaysService: PathwaysService,
      public loadingCtrl: LoadingController,
      public menuController: MenuController
  ) {
    console.log("Poi list constructor  4")
    
    console.log(params.get('_id'));

    this.path = params.get('path');
    this.pathway = params.get('pathway');
    

    if(this.pathway){
      this.optimizePathway(1);
      
    }
    else {
      this.loadPoi();
    }
  }

 


/** 
Load list of categories POI
*/
  loadPoi(){
    
    this.poiService.load(this.path,
    (data) => {
        
      console.log(data);
      // aggiunta metadata per l'optimizer
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
    console.log('itemTapped');
    console.log(item);
    
    let _id: string = this.params.get('_id');
    
    console.log(_id);
    let modal = this.modalCtrl.create(PoiDetailsPage, {item, _path, _id});
    modal.present();
     
    //this.app.getRootNav().push(PoiDetailsPage , {
    //    item: item
    //  })
  }
  
 
  

  deletePoint(event, item)
  {
    let confirm = this.alertCtrl.create({
      title: this.translate.instant('PATHWAYS.POINT_ERASE_TITLE'), //'Nuovo Percorso',
      message: this.translate.instant('PATHWAYS.POINT_ERASE_DESCRIPTION'), //"Inserisci il titolo del nuovo percorso",
      buttons: [
        {
          text: this.translate.instant('PATHWAYS.NEW_CANCEL'),
          handler: data => {
            console.log('Cancel clicked');

          }
        },
        {
          text: this.translate.instant('PATHWAYS.REMOVE_SAVE'),
          handler: data => {
            //this.pathwaysService.deleteP(item, this.pathway);
            
            this.pathwaysService.deletePoint(item, this.pathway, arr => {
              this.navCtrl.push(PoiRoot, {
                pathway: arr,
                editAdd: false
              });
              
              //this.navCtrl.setRoot(this.navCtrl.getActive().component);
            })
            
          }
        }
      ]
    });
    confirm.present();
    
    
    
  }




  getColor(){
    return "#" + Math.floor(Math.random()*16777215).toString(16);
  }
  
/**
 * outputs the pois of the pathway, optimized or not (parameter checkOptimize)
 */

  optimizePathway(_type){
      
      let timeOut_value: number = 2000;
      let optimize: number;
      let optimizeLabel: string;
      
      
      let loading = this.loadingCtrl.create({
        spinner: 'circles'
        //content: 'This will navigate to the next page and then dismiss after 3 seconds.'
      });
  
      loading.present();
      
      if (this.checkOptimize == 0)
      {  
        optimize = 1;
        optimizeLabel = this.translate.instant('PATHWAYS.NO_OPTIMIZE_BUTTON');
      
      this.poiService.load_optimize(_type,this.pathway,
      (data) => {
        
        if (data.Points.length < this.pathway.points.length + 2)
        { 
          let alert = this.alertCtrl.create({
            title: this.translate.instant('PATHWAYS.WARNING'),
            subTitle: this.translate.instant('PATHWAYS.EXCLUDE_POINT'),
            buttons: ['OK']
          });
          alert.present();
        }

        this.items = data.Points;
        
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
        

        // extra point
        this.itemsExtra = this.pathwaysService.countExtraPoint(this.pathway.points, data.Points);
         
         this.difficolta_str_pw = this.createDifficulty((Math.round(diff_tot/count)).toString());
         this.timeToVisit_str_pw = Math.round(timeToVisit).toString();
          

         setTimeout(() => {
          this.checkOptimize = optimize;
          //console.log(this.checkOptimize);
          this.optimizeContent =  optimizeLabel;
          loading.dismiss();
        }, 1000);


      })
  }
  else
  {
    optimize = 0;
    optimizeLabel = this.translate.instant('PATHWAYS.OPTIMIZE_BUTTON');
    this.items = this.pathway.points;
    this.difficolta_str = this.createDifficulty(this.pathway.difficolta);

    setTimeout(() => {
      this.checkOptimize = optimize;
      //console.log(this.checkOptimize);
      this.optimizeContent =  optimizeLabel;
      loading.dismiss();
    }, timeOut_value);
    
  }

  /*
  setTimeout(() => {
    this.checkOptimize = optimize;
    //console.log(this.checkOptimize);
    this.optimizeContent =  optimizeLabel;
    loading.dismiss();
  }, timeOut_value);
 */
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
