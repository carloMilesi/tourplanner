import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

declare var google;

@Component({
  selector: 'map-component',
  templateUrl: 'map.html',
})
export class MapComponent {
  @ViewChild('map') mapElement: ElementRef;

  //@Input() points: Array<any>;

  private startPosition: any;
  private map: any;
  private items: any;

  constructor(public platform: Platform, public zone: NgZone) {
    console.log("Map constructor")

  }


  loadMap(item?) {
    let mapOptions = {
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };
    if (item !== undefined) {
      mapOptions['center'] = new google.maps.LatLng(item.lat, item.lng);
      mapOptions['zoom'] = 12
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    if (item !== undefined) {
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(item.lat, item.lng),
      });

      this.addInfoWindow(item, marker, item.title);
    }
  }


  loadPois(pois) {
    this.items = pois;
    this.getPointsBounds((bounds) => {
      this.loadMap()
      this.map.fitBounds(bounds);
      console.log("items count " + this.items.length);
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].lat && this.items[i].lng) {
          //console.log(this.items[i].title + ": " + this.items[i].lat + " - " + this.items[i].lng)

          let marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(this.items[i].lat, this.items[i].lng),
          });

          this.addInfoWindow(this.items[i], marker, this.items[i].title);
        }
      }

    })


  }

  setMapHeight(height){
    this.mapElement.nativeElement.style.height = height;
  }

  getPointsBounds(_cb) {
    var bound = new google.maps.LatLngBounds();

    for (let i = 0; i < this.items.length; i++)
      if (this.items[i].lat && this.items[i].lng)
        bound.extend(new google.maps.LatLng(this.items[i].lat, this.items[i].lng));

    console.log("center of the map: " + bound.getCenter().toString());
    // let zoom = this.getMapZoom(bound);
    _cb(bound);
  }

  getMapZoom(bound) {
    let pixelWidth = 328; // a constant in Google's map projection
    let GLOBE_WIDTH = 256; // a constant in Google's map projection
    let west = bound.northeast;
    let east = bound.southwest;

    console.log(west + " - " + east);

    let angle = east - west;
    if (angle < 0) {
      angle += 360;
    }

    console.log(Math.LN2);

    let zoom = Math.round(Math.log(pixelWidth * 360 / angle / GLOBE_WIDTH) / Math.LN2);
    console.log(zoom);
    return zoom;
  }

  addInfoWindow(item, marker, content) {

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
      //this.itemTapped("click", item)
    });
  }


  // itemTapped(event, item) {
  //   let modal = this.modalCtrl.create(PoiDetailsPage, { item });
  //   modal.present();
  //   // this.navCtrl.push(PoiDetailsPage, {
  //   //   item: item
  //   // });
  // }

}