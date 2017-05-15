import { Component } from '@angular/core';
import { ModalController, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { PoiRoot } from '../poi/poi';
import { TranslateService } from 'ng2-translate';

import { PoiService } from '../../services/poi.service';
//import { PoiDetailsPage } from '../poi/poi-details';
import {PoiListPage} from "../poi/poi-list";


@Component({
  templateUrl: 'hello-ionic.html',
    providers: [PoiService]
})
export class HelloIonicPage {

    selectedItem: any;
    icons: string[];
    //items: Array<{title: string, note: string, icon: string}>;
    searchQuery:string= '' ;

    items: Array<{title: string}>;
    private itemsSearched: any;

  public categories : any = [
                              {title : 'PAGE_MONUMENTS', path : "monuments", imgUrl: "img/monumenti.jpg"},
                              {title : 'PAGE_MUSEUMS', path : "museums", imgUrl: "img/musei1.jpg"},
                              {title : 'PAGE_ARCHEOLOGY', path : "archeoSites", imgUrl: "img/archeologia.jpg"},
                              {title : 'PAGE_GARDENS', path : "gardens", imgUrl: "img/giardini1.jpg"} ,
                              {title : 'PAGE_EVENTS', path : "events", imgUrl: "img/eventi.jpg"},
                              {title : 'PAGE_RESTAURANTS', path : "restaurants", imgUrl: "img/ristoranti.jpg"}];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public translate: TranslateService,
              public http: Http,
              public poiService: PoiService,
              public modalCtrl: ModalController) {

      this.selectedItem = navParams.get('item');
      this.items = [];


      for(let i = 0; i < this.categories.length; i++){
          this.items.push(this.categories[i]);
      }

  }

  cardTapped(item) {
    this.navCtrl.push(PoiRoot, {
      item: item
    });
  }

  searchThis(ev: any){


      let val = ev.target.value;
      console.log("ciao ************************" + val);




      //alert(val);

      //let searchQuery : any = [{title : 'SEARCH', path : "all"}];

      this.poiService.load('http://seitre.crs4.it:3009/api/v1/all?search=' + val,
          (data) => {
              console.log("************************+");
              console.log(JSON.stringify(data));
              console.log("************************+");

              this.itemsSearched = data;
              this.itemTapped(this.itemsSearched);
              /*console.log(this.itemsSearched.length);
              for(let i = 0; i < this.itemsSearched.length; i++){
                  this.itemsSearched[i].bgcolor = this.getColor();
                  console.log(JSON.stringify(this.itemsSearched[i]));
              }*/
          });
     // this.itemTapped(this.itemsSearched);


  }


  cancelSearch(){

      console.log("______cancel_______")

    }

    getColor(){
        return "#" + Math.floor(Math.random()*16777215).toString(16);
    }

    itemTapped(item) {
        let modal = this.modalCtrl.create(PoiListPage, {item});
        modal.present();
    }
}
