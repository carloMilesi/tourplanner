import { Component, NgZone } from '@angular/core';
import { Platform } from 'ionic-angular';

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  LatLngBounds,
  CameraPosition,
  MarkerOptions,
  Marker,
} from '@ionic-native/google-maps';

@Component({
  selector: 'map-component',
  templateUrl: 'map.html',
})
export class MapComponent {
  //@Input() points: Array<any>;
  private map: GoogleMap;
  private startPosition: CameraPosition


  constructor(
    platform: Platform,
    private googleMaps: GoogleMaps,
    private zone: NgZone) {

    console.log("Map constructor")

    this.startPosition = {
      target: new LatLng(39.224946775, 9.10817130095609)
    };

  }

  // Load map only after view is initialized
  ngAfterViewInit() {
    this.loadMap();
  }

  loadMap() {
    console.log("in load map ")

    let element: HTMLElement = document.getElementById('map');
    this.map = this.googleMaps.create(element);
    // this.map.one(GoogleMapsEvent.MAP_READY).then(() => console.log('Map is ready!'));

    // console.log("position: " + JSON.stringify(this.startPosition))
    // // move the map's camera to position
    // this.map.moveCamera(this.startPosition).then(() => {
    //   console.log("Map loaded!!");
    // });

    this.map.one(GoogleMapsEvent.MAP_READY).then((data: any) => {

      this.zone.run(() => {
        //this.map.animateCamera({ target: myPosition, zoom: 14 });
        this.map.moveCamera(this.startPosition).then(() => {
          console.log("Map loaded!!");
        });
      });

    });

  }


  addPois(points) {
    console.log("Adding points")
    let bounds: LatLngBounds = this.getMapBounds(points)

    this.map.clear();
    this.startPosition.target = bounds;
    this.zone.run(() => {
      this.map.moveCamera(this.startPosition).then(() => {
        console.log("Map updatet!!");
      });
    });


    for (let i = 0; i < points.length; i++) {
      if (points[i].lat && points[i].lng) {

        this.map.addMarker({
          position: new LatLng(points[i].lat, points[i].lng),
          title: points[i].title
        })
          .then((marker: Marker) => {
            //marker.showInfoWindow();
          });
      }
    }
    
  }


  getMapBounds(points) {
    let _points = [];
    for (let i = 0; i < points.length; i++) {
      if (points[i].lat && points[i].lng)
        _points.push(new LatLng(points[i].lat, points[i].lng))
    }
    let latLngBounds = new LatLngBounds(_points);
    return latLngBounds
  }


  // getMapZoom(bound: LatLngBounds) {
  //   let pixelWidth = 328; // a constant in Google's map projection
  //   let GLOBE_WIDTH = 256; // a constant in Google's map projection
  //   let west: any = bound.northeast;
  //   let east: any = bound.southwest;

  //   console.log("west " + west.toString())
  //   console.log("east " + east.toString())
  //   let angle = east - west;
  //   console.log("angle " + angle.toString())

  //   if (angle < 0) {
  //     angle += 360;
  //   }

  //   let zoom = Math.round(Math.log(pixelWidth * 360 / angle / GLOBE_WIDTH) / Math.LN2);
  //   return zoom;
  //   //return 8;
  // }

  // addInfoWindow(item, marker, content){

  //   let infoWindow = new google.maps.InfoWindow({
  //     content: content
  //   });

  //   google.maps.event.addListener(marker, 'click', () => {
  //     //infoWindow.open(this.map, marker);
  //     this.itemTapped("click", item)
  //   });
  // }


  // itemTapped(event, item) {
  //   let modal = this.modalCtrl.create(PoiDetailsPage, { item });
  //   modal.present();
  //   // this.navCtrl.push(PoiDetailsPage, {
  //   //   item: item
  //   // });
  // }
}