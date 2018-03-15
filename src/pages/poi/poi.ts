import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, AlertController, LoadingController} from 'ionic-angular';
import { PoiListPage } from './poi-list';
import { MapPage } from './poi-map';

import { TranslateService } from 'ng2-translate';
import { PathwaysService } from '../../services/pathways.service';
import {PercorsiPage} from '../percorsi/percorsi';

@Component({
  templateUrl: 'poi.html',
  providers: [PathwaysService]

})
export class PoiRoot {
  //poiListPage = PoiListPage
  //poiMapPage = MapPage

  //poiParams :  Array<{title: string, description: string, thumbnail: string, images: string, lat: string, lng: string}>;

  tab1: any;
  tab2: any;

  poiParams : any;
  item : any;
  poiTitle: string;

  constructor(
      private navController: NavController,
      private viewController: ViewController,
      public params: NavParams,
      public pathwaysService: PathwaysService,
      public alertCtrl: AlertController,
      public loadingCtrl: LoadingController,
      public translate: TranslateService
) {
    console.log("Poi root constructor")
    console.log("item param: " + JSON.stringify(params.get('path')))
    
    console.log("Pathway root constructor")
    console.log("item param: " + JSON.stringify(params.get('pathway')))
    

    if (params.get('path'))
      this.poiTitle  = params.get("path");
    else if (params.get("pathway"))
        this.poiTitle  = params.get("pathway").title;     
    
        
    this.poiParams = {pathway : params.get("pathway"), path : params.get("path"),  _id: params.get("_id")}; // i parametri sono passati nel template
    
    
    this.tab1 = PoiListPage;
    this.tab2 = MapPage;
  }



  insertOpenData()
  {
    
    let confirm = this.alertCtrl.create({
      title: this.translate.instant('PATHWAYS.POINT_OP_TITLE'), 
      message: this.translate.instant('PATHWAYS.POINT_OP_DESCRIPTION'), 
      buttons: [
        {
          text: this.translate.instant('PATHWAYS.NEW_CANCEL'),
          handler: data => {
            console.log('Cancel clicked');
  
          }
        },
        {
          text: this.translate.instant('PATHWAYS.NEW_SAVE'),
          handler: data => {
            
            this.pathwaysService.insert_OpenData(this.params.get('pathway'))
            .then( arr => {
              
              if (arr == 1)  //ok
              {
                let loading = this.loadingCtrl.create({
                  spinner: 'circles'
                });
                
                  loading.present();
                  setTimeout(() => {
                    loading.dismiss();
                  }, 1000);
              }
              else if (arr == 0) // record is present
              {
                let confirm2 = this.alertCtrl.create({
                  title: this.translate.instant('PATHWAYS.POINT_OP_PRESENT'), 
                  buttons: [
                    {
                      text: this.translate.instant('PATHWAYS.NEW_CANCEL'),
                      handler: data => {
                        console.log('Cancel clicked');
                      }
                      }]
                    
                  })
                  confirm2.present();
              }
              else // ko
              {

              } 
              
              console.log(arr);
              
            })
            
          }
        }
      ]
    });
    confirm.present();
    
    
  }

  backPathwayPage()
  {
    //this.viewController.dismiss();
         //popToRoot()
    
         console.log(this.navController.first());
         console.log(this.navController.last());
         console.log(this.navController.getViews());
         console.log('lenght: ' + this.navController.length());
         console.log('back ' + this.viewController.enableBack());
         console.log('first ' + this.viewController.isFirst());
         console.log('last ' + this.viewController.isLast());

         this.navController.popToRoot()
                                    .then(() => {
                                      //const index = this.navController.getActive().index;
                                      console.log('popRoot ' + this.navController.length());
                                      //this.navController.remove(0, index);
                                    }, (err) => {console.log('error pop ' + err)}
                                  );


                      //this.navController.remove(0, index);
                    //}, (err) => {console.log('error remove ' + err)}
         
         /*
         if (this.navController.length() > 2)
          {
                    this.navController.remove(this.navController.length(),1)
                    .then(() => {
                      const index = this.navController.getActive().index;
                      
                      this.navController.pop()
                                    .then(() => {
                                      //const index = this.navController.getActive().index;
                                      
                                      //this.navController.remove(0, index);
                                    }, (err) => {console.log('error pop ' + err)}
                                  );


                      //this.navController.remove(0, index);
                    }, (err) => {console.log('error remove ' + err)}
                  );
         }
         */
        /* 
         this.navController.pop()
         .then(() => {
          const index = this.navController.getActive().index;
          
          //this.navController.remove(0, index);
        }, (err) => {console.log(err)}
      );
      */   


    //this.navController.push(PercorsiPage);
    //this.navController.setRoot(PercorsiPage);
    
    
  }

}
