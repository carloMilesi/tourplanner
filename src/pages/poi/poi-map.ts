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



    addItems(category)
    {
      let center_point: any = this.getCenter(this.pathway);
      //console.log(center_point);

      let url = 'http://seitre.crs4.it:3009/api/v1/'+ category +'?lat=' + center_point.lat + '&lng=' + center_point.lng;
    this.poiService.load(url, pois => {
      this.points = pois;
      //console.log(pois);
      //console.log("points in load pois: " + JSON.stringify(this.points))
      if (pois)
        this.myMap.loadPois2(pois);
    })
    }



    getCenter(pathway)
    {
          //console.log(this.pathway.points);
          

          let max_lat: number = 0.0;
          let max_lng: number = 0.0;
          let min_lat: number = 1000.0;
          let min_lng: number = 1000.0;

          for (let i = 0; i < this.pathway.points.length; i++) {
            

            if  (parseFloat(this.pathway.points[i].lat) > max_lat)
                max_lat = parseFloat(this.pathway.points[i].lat);
            if  (parseFloat(this.pathway.points[i].lng) > max_lng)
                max_lng = parseFloat(this.pathway.points[i].lng);

            if  (parseFloat(this.pathway.points[i].lat) < min_lat)
                min_lat = parseFloat(this.pathway.points[i].lat);
            if  (parseFloat(this.pathway.points[i].lng) < min_lng)
                min_lng = parseFloat(this.pathway.points[i].lng);
                


        }

        let c_lat = (max_lat - min_lat)/2 + min_lat;
        let c_lng = (max_lng - min_lng)/2 + min_lng;

        return {"lat": c_lat, "lng": c_lng};
    }


  }