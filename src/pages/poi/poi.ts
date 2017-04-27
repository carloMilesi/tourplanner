import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { PoiListPage } from './poi-list';
import { MapPage } from './poi-map';

@Component({
  templateUrl: 'poi.html'
})
export class PoiRoot {
  //poiListPage = PoiListPage
  //poiMapPage = MapPage

  //poiParams :  Array<{title: string, description: string, thumbnail: string, images: string, lat: string, lng: string}>;

  tab1: any;
  tab2: any;
  poiParams : any;
  item : any;

  constructor(
      private navController: NavController,
      public params: NavParams
) {
    console.log("Poi root constructor")
    console.log("item param: " + JSON.stringify(params.get('item')))

    this.poiParams = {pathway : params.get("pathway"), item : params.get("item") }; // i parametri sono passati nel template

    this.tab1 = PoiListPage;
    this.tab2 = MapPage;
  }
}
