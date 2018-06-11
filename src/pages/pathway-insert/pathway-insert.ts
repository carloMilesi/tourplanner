import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { NativeStorage } from '@ionic-native/native-storage';
import { TranslateService } from 'ng2-translate';

import { CategoriesListPage } from '../categories/categories-list';
import { PathwaysService } from '../../services/pathways.service';
/**
 * Generated class for the PathwayInsertPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-pathway-insert',
  templateUrl: 'pathway-insert.html',
  providers: [PathwaysService,DatePipe]
})
export class PathwayInsertPage {

formgroup: FormGroup;
name: AbstractControl;
profilo: AbstractControl;
dataInizio: AbstractControl;
durata: AbstractControl;
difficolta: AbstractControl;
puntoPartenza: AbstractControl;
difficolta_str: string = this.translate.instant('PATHWAYS.LOW');


_pathways: Array<any> = [];
profilo_arr: any;

  constructor(public navCtrl: NavController
    , public navParams: NavParams
    , public viewCtrl: ViewController
    , public formbuilder: FormBuilder
    , private nativeStorage: NativeStorage
    , public pathwaysService: PathwaysService
    , public translate: TranslateService
    , public alertCtrl: AlertController
    , private datePipe: DatePipe
    
   ) {
  
  /*
  ionViewDidLoad() {
    console.log('ionViewDidLoad PathwayInsertPage');
  */
 
 
  let today_date = new Date().toISOString();
if (this.dst(new Date())) {
  today_date = this.calculateTime('+2');
}

 this.formgroup = formbuilder.group(
         {
           name: ['', Validators.compose([Validators.required, Validators.maxLength(24)])],
           dataInizio: [today_date, Validators.required],
           profilo: ['0'],
           puntoPartenza: ['porto'],
           durata: ['60'],
           difficolta: ['1']
		  }
        );



      this.name = this.formgroup.controls['name'];
      this.profilo = this.formgroup.controls['profilo'];
      this.dataInizio = this.formgroup.controls['dataInizio'];
      this.puntoPartenza = this.formgroup.controls['puntoPartenza'];
      this.difficolta = this.formgroup.controls['difficolta'];
      this.durata = this.formgroup.controls['durata'];

      
this.nativeStorage.getItem('pathways')
.then(
data => console.log(data),
error => console.error(error)
	)


	this.nativeStorage.keys()
.then(
data => console.log(data),
error => console.error(error)
	)     

  };

ngOnInit()
{
  this.formgroup.get('difficolta').valueChanges.subscribe(
		(difficolta) => {
      console.log(difficolta);
      this.difficolta_str = this.decode_difficulty(difficolta);
      }
    )
    
    this.formgroup.get('profilo').valueChanges.subscribe(
      (profilo) => {
        
                  if (this.profilo.value == '1')
                  {
                      this.profilo_arr = {
                          difficulty: 25
                        , duration : 180
                        , monuments:3
                        , museums: 3
                        , gardens: 4
                        , archeology: 2
                        , shopping: 1};
                      
                  }
                  else if (this.profilo.value == '2')
                  {
                      this.profilo_arr = {
                        difficulty: 50
                      , duration: 240
                      , monuments: 4
                      , museums: 4
                      , gardens: 5
                      , archeology: 3
                      , shopping: 2};
                  }
                  else if (this.profilo.value == '3')
                  {
                      this.profilo_arr = {
                        difficulty: 75
                      , duration: 210
                      , monuments: 4
                      , museums: 4
                      , gardens: 5
                      , archeology: 2
                      , shopping: 2};
                  }
                  else if (this.profilo.value == '4')
                  {
                      this.profilo_arr = {
                        difficulty: 100
                      , duration: 90
                      , monuments: 2
                      , museums: 2
                      , gardens: 5
                      , archeology: 1
                      , shopping: 4};
                  }
                  else
                  {
                    this.profilo_arr = {};
                  }

                    
      
      })


}

guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  };





saveItem(fields) {
	
    let date_start: string;
    let difficulty = this.difficolta.value;
    let duration = this.durata.value;
    
    console.log(this.dataInizio.value);
    // gestione elemento datetime ionic se non selezionato rende una stringa
   
   try
    {
      //let date_p = JSON.parse(this.dataInizio.value);
      date_start =  this.dataInizio.value.year + '-'+this.dataInizio.value.month + '-'+this.dataInizio.value.day + ' '+this.dataInizio.value.hour + ':'+this.dataInizio.value.minute;
      date_start = this.datePipe.transform(date_start,  'yyyy-MM-dd HH:mm');
      
      }
    catch (ex)
    {
      //console.log(ex);
       
      date_start = this.datePipe.transform(Date().toString(),  'yyyy-MM-dd HH:mm');
      }
    
console.log(date_start);


    let monuments: number = 1;
    let gardens: number = 1;
    let museums: number = 1;
    let archeology: number = 1;
    let shopping: number = 1;

    if (this.profilo.value != 0)
    {
      difficulty = this.profilo_arr.difficulty;
      duration = this.profilo_arr.duration;
      monuments = this.profilo_arr.monuments;
      museums = this.profilo_arr.museums;
      shopping = this.profilo_arr.shopping;
    }
    
    let _guid: string = this.guid();
  
     let pathway  = {
      _id: _guid ,
      dataIns: new Date().toISOString(),
      
      title: this.name.value,
      date: date_start,
      puntoPartenza: this.puntoPartenza.value,
      profile: this.profilo.value,
      difficolta: difficulty,
      duration: duration,
      mode: 0,
      start: {},
      stop: {},
      category_rating: {Monuments: monuments, Gardens: gardens, Museums: museums, Archeology: archeology, Shopping:shopping},
      points: []
    };

 

if (this.puntoPartenza.value)
{
 pathway.start = {
         lat:39.213644,
         lng:9.111093
     };

 pathway.stop = {
         lat:39.213644,
         lng:9.111093
     };

     
 } 
    

    //this._pathways.unshift(pathway);


//console.log("unshift: " + this._pathways);
//console.log("saving: " + JSON.stringify(pathway));

     


    
      //this.pathwaysService.insertPathway(pathway, this.alertConfirm);

      this.pathwaysService.insertPathway(pathway, type => {
        console.log(type);
        console.log(this.alertCtrl);
        let alert = this.alertCtrl.create({
                          title: this.translate.instant('PATHWAYS.CONFIRM_ADD'),
                          buttons: [
                                {
                                  text: this.translate.instant('PATHWAYS.ADD_POINT'),
                                  handler: () => {
                                     //this.navCtrl.remove(2,1);
                                     this.viewCtrl.dismiss();
                                     if (type == 1) // first insert
                                       this.navCtrl.push(CategoriesListPage, {_id: _guid});
                                     else if (type == 2)
                                       this.navCtrl.pop();
                                     
                                  }
                                }]
                        });
                        alert.present();
      
      
      });

  }

  
 
 decode_difficulty(difficolta)
 {
  
  let diff : string;

  switch(difficolta) {
    case 0:
      diff =  this.translate.instant('PATHWAYS.LOW');
    break;
    case 25:
      diff =  this.translate.instant('PATHWAYS.MEDIUM');
    break;
    case 50:
      diff =  this.translate.instant('PATHWAYS.GOOD');
    break;
    case 75:
      diff =  this.translate.instant('PATHWAYS.HIGH');
    break;
    case 100:
      diff =  this.translate.instant('PATHWAYS.VERYHIGH');
    break;
  }
    
  return diff;

 } 


// gestione della data  --------------------------------------------------------------------- //

 calculateTime(offset: any) {
  // create Date object for current location
  let d = new Date();

  // create new Date object for different city
  // using supplied offset
  let nd = new Date(d.getTime() + (3600000 * offset));

  return nd.toISOString();
}

// Determine if the client uses DST
stdTimezoneOffset(today: any) {
  let jan = new Date(today.getFullYear(), 0, 1);
  let jul = new Date(today.getFullYear(), 6, 1);
  return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

dst(today: any) {
  return today.getTimezoneOffset() < this.stdTimezoneOffset(today);
}

// ------------------------------------------------------------------------------------- //


}
