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
  poiTitle: string;

  constructor(
      private navController: NavController,
      public params: NavParams
) {
    console.log("Poi root constructor")
    console.log("item param: " + JSON.stringify(params.get('path')))
    
    console.log("Pathway root constructor")
    console.log("item param: " + JSON.stringify(params.get('pathway')))
    

    if (params.get('path'))
      this.poiTitle  = params.get("path");
    else if (params.get("pathway"))
        this.poiTitle  = params.get("pathway").title;     
  
    this.poiParams = {pathway : params.get("pathway"), path : params.get("path") }; // i parametri sono passati nel template

    this.tab1 = PoiListPage;
    this.tab2 = MapPage;
  }
}
