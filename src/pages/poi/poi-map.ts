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
    
    this.path = navParams.get('path');
    this.pathway = navParams.get('pathway');
    
    console.log(this.pathway); // map pathway points
    console.log(this.path);  // map categories 
    
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





optimizePathway(){
      console.log(this.pathway);
      this.poiService.load_optimize('http://192.167.144.196:5010/v1/requestTrip/ ', this.pathway,
      (data) => {
        
        let origin = data.Points[0];
        let destination = data.Points[data.Points.length-1];
        let waypts = data.Points;
        //console.log(data.Points);
        this.myMap.loadPois(data.Points, "pathway");
        this.myMap.calculateAndDisplayRoute(origin, destination, waypts);
        
      });
    }


  }