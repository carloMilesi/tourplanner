import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { NativeStorage } from '@ionic-native/native-storage';
import {stringify} from "@angular/core/src/util";
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
dataInizio: AbstractControl;
durata: AbstractControl;
difficolta: AbstractControl;
puntoPartenza: AbstractControl;
difficolta_str: string = this.translate.instant('PATHWAYS.LOW');

_pathways: Array<any> = [];

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

  this.formgroup = formbuilder.group(
         {
           name: ['', Validators.compose([Validators.required, Validators.maxLength(24)])],
           dataInizio: [new Date().toISOString(), Validators.required],
           puntoPartenza: ['porto'],
           durata: ['60'],
           difficolta: ['1']
		  }
        );



      this.name = this.formgroup.controls['name'];
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
			switch(difficolta) {
               case 0:
                 this.difficolta_str = this.translate.instant('PATHWAYS.LOW');
               break;
               case 25:
               	this.difficolta_str = this.translate.instant('PATHWAYS.MEDIUM');
               break;
               case 50:
               	this.difficolta_str = this.translate.instant('PATHWAYS.GOOD');
               break;
               case 75:
                 this.difficolta_str = this.translate.instant('PATHWAYS.HIGH');
               break;
               case 100:
                 this.difficolta_str = this.translate.instant('PATHWAYS.VERYHIGH');
               break;

			}
			

		}
		)
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
	
    let date_start = this.datePipe.transform(new Date().toISOString(), 'yyyy-MM-dd');
    

  

     let pathway  = {
      _id: this.guid() ,
      dataIns: new Date().toISOString(),
      title: this.name.value,
      date: date_start,
      puntoPartenza: this.puntoPartenza.value,
      difficolta: this.difficolta.value,
      duration: this.durata.value,
      mode: 0,
      start: {},
      stop: {},
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


console.log("unshift: " + this._pathways);
console.log("saving: " + JSON.stringify(pathway));

     //this.pathwaysService.add(pathway);
    

 this.nativeStorage.getItem('pathways')
	.then(
	data => {
		console.log(data);
		if (Array.isArray(data))
		{
					data.push(pathway);
					this.nativeStorage.setItem('pathways', data)
				      .then(
				        () => {console.log('Updated pathway add value!'); 
                  this.alertConfirm(1);

              },
				        error => console.error('Error storing item', error)
				      );
	     }
	    else
	    {	
	    		    	this._pathways.unshift(pathway);

					this.nativeStorage.setItem('pathways', this._pathways)
				      .then(
				        () => {console.log('Updated pathway! create value'); 
                  this.alertConfirm(2);
              },
				        error => console.error('Error storing item', error)
				      );
	    }	
	},
	error => console.error(error)
		);


}


alertConfirm(type)
{
   let alert = this.alertCtrl.create({
                    title: this.translate.instant('PATHWAYS.CONFIRM_ADD'),
                    buttons: [
                          {
                            text: this.translate.instant('PATHWAYS.ADD_POINT'),
                            handler: () => {
                               //this.navCtrl.remove(2,1);
                               this.viewCtrl.dismiss();
                               if (type == 1) // first insert
                                 this.navCtrl.push(CategoriesListPage);
                               else
                                 this.navCtrl.pop();
                            }
                          }]
                  });
                  alert.present();

}


}
