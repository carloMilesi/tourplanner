import { Component, NgZone, Renderer } from '@angular/core';
import { NavController, Platform, ViewController, NavParams, AlertController } from 'ionic-angular';

import { TranslateService } from 'ng2-translate';

//import {NewItemPage} from './new-item';
import { PoiRoot } from '../poi/poi';
import { PathwaysService } from '../../services/pathways.service';
import {stringify} from "@angular/core/src/util";

import { PathwayInsertPage} from '../pathway-insert/pathway-insert';

import { HelloIonicPage } from '../hello-ionic/hello-ionic';

@Component({
  templateUrl: 'percorsi.html',
  providers: [PathwaysService]
})
export class PercorsiPage {
  public items = [];
  public edited: any = false;
  private adding: boolean = false;
  private poi_selected: any;
 
  private path: string;

  constructor(
    private navController: NavController,
    public navParams: NavParams,
    private platform: Platform,
    private zone: NgZone,
    private viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public pathwaysService: PathwaysService,
    public renderer: Renderer,
    public translate: TranslateService
  ) {
    this.path = navParams.get('_path');
    
    this.adding = navParams.get('adding');
    
    if (this.adding)
      this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'my-popup', true);

    if (navParams.get('poi')){
      this.poi_selected = navParams.get('poi');
      this.poi_selected._id= this.guid(); ///assegna un id univoco ad ogni punto del percorso
    }


    if (navParams.get('menu')) {
      this.edited = false;
    }
  }
  
/**
refresh automatico della pagina
*/
 ionViewWillEnter() {
   console.log('go!');
      this.loadPathways()
 }


// TODO da togliere?
  ngOnInit() {
    this.platform.ready().then(() => {

      this.loadPathways()
    });
  }


/**
load dei percorsi
*/

  loadPathways() {
    console.log("loading pathways")
    this.pathwaysService.getAll((paths) => {
      this.items = paths;
      
    });
  }

  addItem() {
    let prompt = this.alertCtrl.create({
      title: this.translate.instant('PATHWAYS.NEW_TITLE'), //'Nuovo Percorso',
      message: this.translate.instant('PATHWAYS.NEW_MESSAGE'), //"Inserisci il titolo del nuovo percorso",
      inputs: [
        {
          name: 'title',
          placeholder: this.translate.instant('PATHWAYS.NEW_PLACEHOLDER')
        },
      ],
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
            this.savePathway(data.title);
          }
        }
      ]
    });
    prompt.present();
  }

/**
apertura form di inserimento
*/  
   openForm()
   {
     this.navController.push(PathwayInsertPage);
   }



  savePathway(title) {
    console.log("new pathway")
    let pathway = {
      _id: this.guid() ,
      date: new Date().toISOString(),
      title: title,
      points: []
    };

    console.log("saving: " + JSON.stringify(pathway));
    this.items = this.pathwaysService.add(pathway);

  }


  dismiss() {
    this.viewCtrl.dismiss();
  }

  handleItem(event, pathway) {
    
    if (this.adding) {

      let poiIndex = pathway.points.filter(point => point.title === this.poi_selected.title);
      console.log("poiIndex " + JSON.stringify(poiIndex));
      if (poiIndex.length > 0) {
        console.log(" presente!!!!");
        let alert = this.alertCtrl.create({
          title: this.translate.instant('POI.EXISTING_TITLE'),
          subTitle: this.translate.instant('POI.EXISTING_MESSAGE')+ pathway.title + '! ', //'Il POI ' + this.poi_selected.title + ' è già presente nel percorso ' + pathway.title + '! ',
          buttons: ['OK']
        });
        alert.present();

      } else {
        console.log(" non presente")
        pathway.points.unshift(this.poi_selected); //json del percorso
        console.log("adding a point to pathway...");
        console.log(JSON.stringify(pathway));
        // this.pathwaysService.update(pathway._id, this.poi_selected);
        this.pathwaysService.update(pathway);
        
        let alert = this.alertCtrl.create({
          title: this.translate.instant('POI.ADD_TITLE'),
          subTitle: this.translate.instant('POI.ADD_MESSAGE') + pathway.title + '! ', //'Il POI ' + this.poi_selected.title + ' è stato aggiunto correttamente al percorso ' + pathway.title + '! ',
          buttons: [
                {
                  text: this.translate.instant('ADD_NEW'),
                  handler: () => {
                     this.dismiss();
                     this.navController.remove(2,1);
                     this.navController.pop();
                  }
                },
                  {
                  text: this.translate.instant('PATHWAY'),
                  handler: () => {
                     this.dismiss();
                     this.navController.remove(2,1);
                     this.navController.push(PoiRoot, {
                          pathway: pathway,
                          editAdd: false
                        });
                  },
                }]
        });
        alert.present();
        

        
        
        //this.navController.push(HelloIonicPage);
         
         /*
         this.dismiss();
         this.navController.remove(2,1);
         this.navController.pop();
         */


         /*
         this.navController.push(PoiRoot, {
            path: this.path
          })
          .then(() => {
          const index = this.nav.getActive().index;
          this.navController.remove(0, index);
        });
        */
      





      /*
      this.navController.dismiss();
      this.appCtrl.getRootNav().push(SecondPage);
      */
      }


    } else {
      console.log("apri dettaglio");
      this.navController.push(PoiRoot, {
        pathway: pathway,
        editAdd: false
      });
    }

  }



/**
eliminazione percorso
*/
  removePathway(event, item) {
    let confirm = this.alertCtrl.create({
      title: this.translate.instant('PATHWAYS.REMOVE_TITLE'),
      message: this.translate.instant('PATHWAYS.REMOVE_MESSAGE'),
      buttons: [
        {
          text: this.translate.instant('PATHWAYS.REMOVE_CANCEL'),
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: this.translate.instant('PATHWAYS.REMOVE_SAVE'),
          handler: () => {
            console.log('Agree clicked');
            //this.db.remove(item);
            this.pathwaysService.remove(item);
          }
        }
      ]
    });
    confirm.present();
  }

/**
ceazione guid fittizia
*/
  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
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





















}




