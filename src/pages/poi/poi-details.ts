import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, ModalController } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';

import { CategoriesListPage } from '../categories/categories-list';
import { PoiRoot } from '../poi/poi';
import { PercorsiPage } from "../percorsi/percorsi";
import { PathwaysService } from '../../services/pathways.service';


@Component({
  selector: "poi-details",
  templateUrl: 'poi-details.html',
  providers: [PathwaysService]
})
export class PoiDetailsPage {
  @ViewChild('details') map_details;
  
  private selectedItem: any;
  
  private path: string;
  
  private _id: string;

  constructor(
    private navController: NavController,
    private navParams: NavParams,
    private viewCtrl: ViewController,  
    private alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public translate: TranslateService,
    public pathwaysService: PathwaysService

  ) {
    this.selectedItem = navParams.get('item');
    this.path = navParams.get('_path');

    this._id = navParams.get('_id');;
  }

  ionViewDidLoad() {
    this.map_details.setMapHeight("50%");
    this.map_details.loadMap(this.selectedItem);
    
    console.log('-------------------------');
    console.log(this.path);
    console.log(this.selectedItem);
    if (this.selectedItem.category)
      this.selectedItem.category = this.translate.instant('PAGE_' + this.selectedItem.category.toUpperCase());
    
  }

  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }


  openPathways($event, selectedItem){
    console.log("=================");
    console.log(this._id);

/*
    this.pathwaysService.getPathwayById(this._id)
    .then(data => {
      let a: any;
      a = data;

      console.log(typeof data);
      console.log(a.points);
      console.log(data['title']);
      console.log(data['points']);
      console.log(data);
          
    },
    (error) => {
      console.error('Errore')
      console.log(JSON.stringify(error))
    });
*/



if (this._id)
{ 
  
  selectedItem._id = this.guid();  // aggiunge un guid al punto all'interno del percorso, analogo in percorsi.ts
  this.pathwaysService.insertPoi(this._id, selectedItem)
  .then(data => {
    console.log('=>risultato finale');
    console.log(data);
    if (data['length'] == 0)
    {
      let alert = this.alertCtrl.create({
        title: this.translate.instant('POI.EXISTING_TITLE'),
        subTitle: this.translate.instant('POI.EXISTING_MESSAGE') + '! ', //'Il POI ' + this.poi_selected.title + ' è già presente nel percorso ' + pathway.title + '! ',
        buttons: ['OK']
      });
      alert.present();
    }
    else
    {
      let alert = this.alertCtrl.create({
        title: this.translate.instant('POI.ADD_TITLE'),
        subTitle: this.translate.instant('POI.ADD_MESSAGE') + '! ', //'Il POI ' + this.poi_selected.title + ' è stato aggiunto correttamente al percorso ' + pathway.title + '! ',
        buttons: [
              {
                text: this.translate.instant('ADD_NEW'),
                handler: () => {
                  this.viewCtrl.dismiss();
                   //this.navController.remove(2,1);
                   //this.navController.push(CategoriesListPage, {_id: this._id});
                   
                   this.navController.popTo(CategoriesListPage, {_id: this._id})
                   .then((det) => {console.log(det);},
                   (error) => {
                    console.log(this.navController.length()); 
                    console.log(JSON.stringify(error))
                   });
                }
              },
                {
                text: this.translate.instant('PATHWAY'), // button pathway
                handler: () => {
                  //this.viewCtrl.dismiss(); ----------------------------------------
                   
                  //this.navController.remove(2,1);
                  
                  console.log(this.navController.length());
                  /*
                  this.navController.setRoot(PoiRoot, {
                    pathway: data,
                    editAdd: false
                  });
                  */ 
                  
                  this.navController.push(PoiRoot, {
                        pathway: data,
                        editAdd: false
                      }).then(() => {
                        //const index = this.navController.getActive().index;
                        console.log('push ' + this.navController.length());
                        this.navController.remove(2,1)
                        .then(() => {
                         console.log('push push ' + this.navController.length());
                        }
                        , (err) => {console.log(err);}
                        );
                        //this.viewCtrl.dismiss();
                        //this.navController.remove(0, index);
                      }, (err) => {console.log('error push ' + err)}
                    );
                      
                },
              }]
      });
      alert.present();
    }
        
  },
  (error) => {
    console.error('Errore')
    console.log(JSON.stringify(error))
  });
}

else
{    
    let profileModal = this.modalCtrl.create(PercorsiPage, { adding: true, poi: selectedItem, _path: this.path });
    profileModal.present();
}


  }



  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  
}
