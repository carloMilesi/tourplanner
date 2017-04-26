import {Component, NgZone} from '@angular/core';
import {NavController, Platform, ViewController, NavParams, AlertController} from 'ionic-angular';


//import {NewItemPage} from './new-item';
import {PoiRoot} from '../poi/poi';
import {PathwaysService} from '../../services/pathways.service';


@Component({
  templateUrl: 'percorsi.html',
  providers: [PathwaysService]
})
export class PercorsiPage {
  public items = [];
  public edited : any = false;
  private adding : boolean;
  private poi_selected : any;


  constructor(
    private navController: NavController,
    public navParams: NavParams,
    private platform: Platform,
    private zone: NgZone,
    private viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public pathwaysService : PathwaysService
  ) {

    this.adding = navParams.get('add');
    this.poi_selected = navParams.get('poi');

    if(navParams.get('menu')){
      this.edited = false;
    }
  }


  ngOnInit(){
    this.platform.ready().then(() => {
        
      this.loadPathways()
      });
  }

  loadPathways(){
    console.log("loading percorsi")
    this.pathwaysService.getAll((paths) => {
      this.items = paths;
    });
  }

  addItem(){
    let prompt = this.alertCtrl.create({
      title: 'Nuovo Percorso',
      message: "Inserisci il titolo del nuovo percorso",
      inputs: [
        {
          name: 'title',
          placeholder: 'Titolo'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');

          }
        },
        {
          text: 'Salva',
          handler: data => {
             this.savePathway(data.title);
          }
        }
      ]
    });
    prompt.present();
  }

  savePathway(title) {
    console.log("new pathway")
    let pathway = {
      _id: new Date().toISOString(),
      title : title,
      points : []
    };

    console.log(JSON.stringify(pathway));
    this.items = this.pathwaysService.add(pathway);

  }


  dismiss() {
    this.viewCtrl.dismiss();
  }

  handleItem(event, pathway){
    if(this.adding){

      let poiIndex = pathway.points.filter(point => point.title === this.poi_selected.title);
      console.log("poiIndex " + JSON.stringify(poiIndex));
      if (poiIndex.length > 0) {
        console.log(" presente!!!!");
        let alert = this.alertCtrl.create({
          title: 'Point esistente',
          subTitle: 'Il POI ' + this.poi_selected.title + ' è già presente nel percorso ' + pathway.title + '! ',
          buttons: ['OK']
        });
        alert.present();

      } else {
        console.log(" non presente")
        pathway.points.unshift(this.poi_selected);
        console.log("adding a point to pathway...");
        console.log(JSON.stringify(pathway));
        // this.pathwaysService.update(pathway._id, this.poi_selected);
        this.pathwaysService.update(pathway);
        
        let alert = this.alertCtrl.create({
          title: 'Point aggiunto',
          subTitle: 'Il POI ' + this.poi_selected.title + ' è stato aggiunto correttamente al percorso ' + pathway.title + '! ',
          buttons: ['OK']
        });
        alert.present();


      }


    } else {
      console.log("apri dettaglio");
      this.navController.push(PoiRoot, {
        pathway: pathway,
        editAdd : false
      });
    }

  }

  removePathway(event, item) {
    let confirm = this.alertCtrl.create({
      title: 'Rimuovi percorso',
      message: 'Sei sicuro di voler elimare il percoso?',
      buttons: [
        {
          text: 'Cancella',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Rimuovi',
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


}
