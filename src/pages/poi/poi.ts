import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, AlertController, LoadingController} from 'ionic-angular';
import { PoiListPage } from './poi-list';
import { MapPage } from './poi-map';

import { TranslateService } from 'ng2-translate';
import { PathwaysService } from '../../services/pathways.service';

import { SocialSharing } from '@ionic-native/social-sharing';

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
      public translate: TranslateService,
      private socialSharing: SocialSharing
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
         
         this.navController.pop()
         //this.navController.popToRoot()
                                    .then(() => {
                                      //const index = this.navController.getActive().index;
                                      this.viewController.dismiss();
                                      console.log('popRoot ' + this.navController.length());
                                      /*
                                      this.navController.remove(2, 1)
                                      .then(() => {console.log('ok pop');}
                                      , (err) => {console.log('ko pop');});
                                      */
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

  smsShare() {
    this.socialSharing.shareViaSMS("shareViaSMS", "cagliari2020").then(() => {
      console.log("shareViaSMS: Success");
    }).catch(() => {
      console.error("shareViaSMS: failed");
    });
  }
  whatsappShare() {
    this.socialSharing.shareViaWhatsApp("shareViaWhatsApp", 'img/ristoranti.jpg', null).then(() => {
      console.log("shareViaWhatsApp: Success");
    }).catch(() => {
      console.error("shareViaWhatsApp: failed");
    });
  }

  facebookShare() {
    
    let data_path  = this.params.get('pathway');
    
    for (let i=0; i<data_path.points.length; i++){ 
     
      data_path.points[i].description = '';
      data_path.points[i].thumbnail = '';
      data_path.points[i].bgcolor = '';
      data_path.points[i]._id = '';
      console.log(data_path.points[i]);
       }
       console.log("*****************************************************");
       console.log(data_path);
       let link = "http://smartapi.crs4.it/tourplanner/pathway.html?path="+encodeURIComponent( JSON.stringify(data_path));
       console.log(link);
    
       //link = "https://www.getyourguide.it/-l4357/?dev=a&cmp=bing&campaign_id=326332106&adgroup_id=1256742007121053&target_id=kwd-78546522531437:loc-93&match_type=p%20&ad_id=78546418511985&msclkid=9cdf40dc4757110923ad1bca1af9ebff&loc_physical_ms=1861&feed_item_id=&keyword=parlamento&partner_id=CD951&utm_medium=paid_search&utm_source=bing&utm_campaign=united%20kingdom%3A35%7Ccore%7Cit%7Call&utm_term=parlamento";

       //this.socialSharing.shareViaFacebook("Hai inserito un nuovo percorso con l'app di Cagliari port 2020!",null, "https://www.google.com/search?safe=active&client=firefox-b-ab&ei=t18OW5DGLsbTgAbL_7TgDQ&q=googlemaps+create+pathway&oq=googlemaps+create+pathway&gs_l=psy-ab.12...0.0.0.1116288.0.0.0.0.0.0.0.0..0.0....0...1c..64.psy-ab..0.0.0....0.1et3WGKzw8c").then(() => {
    
      this.socialSharing.shareViaFacebook("Hai inserito un nuovo percorso con l'app di Cagliari port 2020!" ,null, link).then(() => {
    
   
    console.log("shareViaFacebook: Success");
      //JSON.stringify(this.params.get('pathway'):

    }).catch((err) => {
      console.error("shareViaFacebook: failed");
      console.log(err);
    });
  }



}
