import { Component } from '@angular/core';
import { NavController, NavParams, Platform, ModalController } from 'ionic-angular';
import { PoiDetailsPage } from './poi-details';
import { PoiService } from '../../services/poi.service';

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  LatLngBounds,
  CameraPosition,
  MarkerOptions,
  Marker
} from '@ionic-native/google-maps';

@Component({
  selector: 'map-page',
  templateUrl: 'poi-map.html',
  providers: [PoiService]
})
export class MapPage {
  private map: GoogleMap;
  private platform;
  private items;
  private pathway: any = null;
  private selectedItem: any;

  constructor(
    public navCtrl: NavController,
    platform: Platform,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public poiService: PoiService,
    private googleMaps: GoogleMaps) {

    this.platform = platform;
    this.pathway = navParams.get('pathway');
    this.selectedItem = this.navParams.get('item');

    if (this.pathway) {
      this.items = this.pathway.points;
      this.loadMap()
    } else {
      this.loadPoi();
    }



  }
  loadPoi() {
    let url = 'http://156.148.14.146:3020/api/v1/' + this.selectedItem.path
    this.poiService.load(url, data => {
      this.items = data;
      //console.log("items:     ")
      //console.log(JSON.stringify(this.items))
      //this.items = this.dataToPoi(data);
      this.loadMap();
    })

  }
  // // Load map only after view is initialized
  // ngAfterViewInit() {
  //  this.loadMap();
  // }

  loadMap() {

    let element: HTMLElement = document.getElementById('map');

    this.map = this.googleMaps.create(element);


    this.map.one(GoogleMapsEvent.MAP_READY).then(() => console.log('Map is ready!'));

    
    let bounds: LatLngBounds = this.getMapBounds()
    let centerPoint: LatLng = bounds.getCenter();
    let zoom = this.getMapZoom(bounds);

    console.log("zzoomm " + zoom);
    let position: CameraPosition = {
      target: centerPoint,
      zoom: 4,
      tilt: 30
    };

    // move the map's camera to position
    this.map.moveCamera(position);
    this.addPois();

  }


  addPois() {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].lat && this.items[i].lng) {
  
        let centerPoint: LatLng = new LatLng(this.items[i].lat, this.items[i].lng);
        // create new marker
        let markerOptions: MarkerOptions = {
          position: centerPoint,
          title: 'Ionic'
        };

        this.map.addMarker(markerOptions)
          .then((marker: Marker) => {
            //marker.showInfoWindow();
          });
      }
    }
  }


  getMapBounds() {
    let points = [];
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].lat && this.items[i].lng)
        points.push(new LatLng(this.items[i].lat, this.items[i].lng))
    }
    let latLngBounds = new LatLngBounds(points);
    return latLngBounds
  }


  getMapZoom(bound: LatLngBounds) {
    let pixelWidth = 328; // a constant in Google's map projection
    let GLOBE_WIDTH = 256; // a constant in Google's map projection
    let west: any = bound.northeast;
    let east: any = bound.southwest;
    
    console.log("west " + west.toString() )
    console.log("east " + east.toString() )
    let angle = east - west;
        console.log("angle " + angle.toString() )

      if (angle < 0) {
        angle += 360;
      }

      let zoom = Math.round(Math.log(pixelWidth * 360 / angle / GLOBE_WIDTH) / Math.LN2);
    return zoom;
    //return 8;
  }

  // addInfoWindow(item, marker, content){

  //   let infoWindow = new google.maps.InfoWindow({
  //     content: content
  //   });

  //   google.maps.event.addListener(marker, 'click', () => {
  //     //infoWindow.open(this.map, marker);
  //     this.itemTapped("click", item)
  //   });
  // }


  itemTapped(event, item) {
    let modal = this.modalCtrl.create(PoiDetailsPage, { item });
    modal.present();
    // this.navCtrl.push(PoiDetailsPage, {
    //   item: item
    // });
  }
}