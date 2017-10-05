import { Component, ViewChild } from '@angular/core';
import { NavController, Platform, NavParams, ModalController } from 'ionic-angular';
import { PoiDetailsPage } from './poi-details';
import { PoiService } from '../../services/poi.service';
import {MapComponent} from "./map";


@Component({
  selector: 'map-page',
  templateUrl: 'poi-map.html',
  providers: [PoiService]

})
export class MapPage {
  @ViewChild('myMap') myMap;

  private points: Array<any> = [];
  private pathway: any = null;
  private path: string;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public poiService: PoiService,
    public platform: Platform
  ) {

    console.log("Poi map constructor")

    this.pathway = navParams.get('pathway');
    this.path = navParams.get('path');
    
    console.log(this.pathway);
    console.log(this.path);
    
    this.platform.ready().then(() => {

      if (this.pathway) {
        let origin = this.pathway.points[0];
        let destination = this.pathway.points[this.pathway.points.length-1];
        let waypts = this.pathway.points;
        this.myMap.loadPois(this.pathway.points, "pathway");
        this.myMap.calculateAndDisplayRoute(origin, destination, waypts);
      } else {
        console.log("loading pois form url")
        this.loadPoi();
      }
    })
  }


  loadPoi(){
    let url = 'http://seitre.crs4.it:3009/api/v1/' + this.path;
    this.poiService.load(url, pois => {
      this.points = pois;
      //console.log("points in load pois: " + JSON.stringify(this.points))
      this.myMap.loadPois(pois, "pois");
    })

  }

  itemTapped(event, item) {
    let modal = this.modalCtrl.create(PoiDetailsPage, { item });
    modal.present();
    // this.navCtrl.push(PoiDetailsPage, {
    //   item: item
    // });
  }
}