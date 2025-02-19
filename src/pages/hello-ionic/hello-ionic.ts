import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PoiRoot } from '../poi/poi';
import { TranslateService } from 'ng2-translate';
import { PoiService } from '../../services/poi.service';
import { LoadingController } from 'ionic-angular';

@Component({
  templateUrl: 'hello-ionic.html',
    providers: [PoiService]
})
export class HelloIonicPage {

    selectedItem: any;
    icons: string[];
    //items: Array<{title: string, note: string, icon: string}>;
    searchQuery:string= '' ;
    
    countItems : any = [];
    items: any = [];
    
    
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public translate: TranslateService,
              public poiService: PoiService,
              public loadingCtrl: LoadingController) {

      this.selectedItem = navParams.get('item');
      this.items = [];
      this.getCountItem();

      
      

  }



  
  
/**
create category list and count items 
*
*/
  getCountItem()
  {
    this.poiService.coutItem()
    .subscribe(data => {
          console.log(data[0]);
          //this.countItems = data[0];

          this.items = [
                              {title : 'PAGE_MONUMENTS', subTitleNum: data[0].monument, subTitle: 'NUM_ITEMS', path : "monuments", imgUrl: "img/monumenti.jpg"},
                              {title : 'PAGE_MUSEUMS', subTitleNum: data[0].museum, subTitle: 'NUM_ITEMS', path : "museums", imgUrl: "img/musei1.jpg"},
                              {title : 'PAGE_ARCHEOLOGY', subTitleNum: data[0].archeo_site, subTitle: 'NUM_ITEMS', path : "archeology", imgUrl: "img/archeologia.jpg"},
                              {title : 'PAGE_GARDENS', subTitleNum: data[0].garden, subTitle: 'NUM_ITEMS', path : "gardens", imgUrl: "img/giardini1.jpg"} ,
                              {title : 'PAGE_EVENTS', subTitleNum: data[0].event, subTitle: 'NUM_ITEMS', path : "events", imgUrl: "img/eventi.jpg"},
                              {title : 'PAGE_RESTAURANTS', subTitleNum: data[0].restaurant, subTitle: 'NUM_ITEMS', path : "restaurants", imgUrl: "img/ristoranti.jpg"},
                              {title : 'PAGE_SHOPPING', subTitleNum: data[0].shopping, subTitle: 'NUM_ITEMS', path : "shopping", imgUrl: "img/shopping.jpg"},
                              {title : 'PAGE_DEALS', subTitleNum: data[0].deal, subTitle: 'NUM_ITEMS', path : "deals", imgUrl: "img/offerte.jpg"}];

   
        }

          )
  }


  cardTapped(item) {
   
    let loading = this.loadingCtrl.create({
      spinner: 'circles'
      //content: 'This will navigate to the next page and then dismiss after 3 seconds.'
    });

    loading.present();
    
    this.navCtrl.push(PoiRoot, {
      path: item.path
    })
    .then(() => {
      loading.dismiss();
    })



    /*
    setTimeout(() => {
      this.navCtrl.push(PoiRoot, {
        path: item.path
      });
    }, 1000);

    setTimeout(() => {
      loading.dismiss();
    }, 4000);
    */
    
    
    

  }





  
}
