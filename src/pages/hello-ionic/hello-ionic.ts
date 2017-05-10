import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import { Http } from '@angular/http';
import {PoiRoot} from '../poi/poi';
import { TranslateService } from 'ng2-translate';


@Component({
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {

    selectedItem: any;
    icons: string[];
    //items: Array<{title: string, note: string, icon: string}>;
    searchQuery:string= '' ;

    items: Array<{title: string}>;

  public categories : any = [
                              {title : 'PAGE_MONUMENTS', path : "monuments", imgUrl: "img/monumenti.jpg"},
                              {title : 'PAGE_MUSEUMS', path : "museums", imgUrl: "img/musei1.jpg"},
                              {title : 'PAGE_ARCHEOLOGY', path : "archeoSites", imgUrl: "img/archeologia.jpg"},
                              {title : 'PAGE_GARDENS', path : "gardens", imgUrl: "img/giardini1.jpg"} ,
                              {title : 'PAGE_EVENTS', path : "events", imgUrl: "img/eventi.jpg"},
                              {title : 'PAGE_RESTAURANTS', path : "restaurants", imgUrl: "img/ristoranti.jpg"}];

  constructor(public navCtrl: NavController, navParams: NavParams,  public translate: TranslateService, public http: Http) {

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


      alert(val);

     /* this.http.get('http://seitre.crs4.it:3009/api/v1/all')
          .subscribe(data => {
              console.log("************************+");
              console.log(JSON.stringify(data));
              console.log(keyword);
              console.log("************************+");
          });*/

  }


  cancelSearch(){

      console.log("______cancel_______")

    }
}
