import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Platform, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { PoiDetailsPage } from './poi-details';

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
  private directionsService: any;
  private directionsDisplay: any;
  private routeResponse: any;


  constructor(public platform: Platform, public zone: NgZone, public modalCtrl: ModalController) {
    console.log("Map constructor")

  }


  loadMap(item?) {
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    let mapOptions = {
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };
    if (item !== undefined) {
      mapOptions['center'] = new google.maps.LatLng(item.lat, item.lng);
      mapOptions['zoom'] = 12
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.directionsDisplay.setMap(this.map);

    if (item !== undefined) {
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(item.lat, item.lng),
      });

      this.addInfoWindow(item, marker, item.title);
    }
  }


  loadPois(pois, kindoflist) {
    this.items = pois;
    this.getPointsBounds((bounds) => {
      this.loadMap();
      this.map.fitBounds(bounds);
      console.log("items count " + this.items.length);

      if(kindoflist == "pois"){


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


   itemTapped(event, item) {
     let modal = this.modalCtrl.create(PoiDetailsPage, { item });
     modal.present();
   }

  calculateAndDisplayRoute(origin, destination ,waypts){
    console.log("FUNCTION calculateAndDisplayRoute ");
    let stepDisplay = new google.maps.InfoWindow;
    let waypoints = [];
    for (let i in waypts){
      if(waypts[i].lat && waypts[i].lng){
        //waypoints.push(new google.maps.LatLng(waypts[i].lat, waypts[i].lng));
        waypoints.push({ location : new google.maps.LatLng(waypts[i].lat, waypts[i].lng), stopover: true});
        console.log(waypoints[i]);
      }

    }
//non va
   /* for (let i in waypoints) {
      waypoints[i].setMap(null);
      console.log(JSON.stringify(waypoints[i]));
    }

    let origin_address = "";
    let dest_address = "";

    let geocoder = new google.maps.Geocoder;*/
    let latlng_origin = { location : new google.maps.LatLng(origin.lat, origin.lng)};
    let latlng_destination = { location : new google.maps.LatLng(destination.lat, destination.lng)};

    console.log("origin: " + JSON.stringify(latlng_origin));
    console.log("destination: " + JSON.stringify(latlng_destination));

    //console.log("waypoints[0]: " + waypoints[0]);

    /*var request_origin = {
      latLng: latlng_origin
    };

    geocoder.geocode(request_origin, function(data, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (data[0] != null) {
          origin_address = data[0].formatted_address;
          console.log("address is: " + origin_address);
        } else {
          alert("No address available");
        }
      }
    });


    var request_dest = {
      latLng: latlng_destination
    };

    geocoder.geocode(request_dest, function(data, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (data[0] != null) {
          dest_address = data[0].formatted_address;
          console.log("address is: " + dest_address);
        } else {
          alert("No address available");
        }
      }
    });*/

    this.routeResponse = null;
    //console.log('this.routeResponse: ' + this.routeResponse);
    if (typeof google !== "undefined") {
      //console.log("typeof google: " + typeof google);
      let routeRequest = {
        origin: latlng_origin,
        destination: latlng_destination,
        waypoints: waypoints,
        optimizeWaypoints: true,
        travelMode: 'WALKING'
      };
      //console.log("routeRequest: " + JSON.stringify(routeRequest));
      this.directionsService.route(routeRequest, (response, status) => {
        //console.log('status directionservice.route: ' + status);
        if (status == 'OK') {
          //console.log('directionservice.route response: ' + JSON.stringify(response));
          this.directionsDisplay.setDirections(response);
          this.showSteps(response, waypoints, stepDisplay, this.map);
          //google.maps.event.trigger(this.map, 'resize');
          // Save the response so we access it from controller
          this.routeResponse = response;
          //console.log("-----" + JSON.stringify(this.routeResponse));
          // Broadcast event so controller can process the route response
          //$rootScope.$broadcast('googleRouteCallbackComplete');
        }else{
          console.log('status directionservice.route: ' + status);
          //console.log(status);
          //console.log("////////////////////////")
        }

      });
      //console.log("route response: " + this.routeResponse);
    }
  }


  showSteps(directionResult, markerArray, stepDisplay, map) {
    // For each step, place a marker, and add the text to the marker's infowindow.
    // Also attach the marker to an array so we can keep track of it and remove it
    // when calculating new routes.
    var myRoute = directionResult.routes[0].legs[0];
    for (var i = 0; i < myRoute.steps.length; i++) {
      var marker = markerArray[i] = markerArray[i] || new google.maps.Marker;
      marker.setMap(map);
      marker.setPosition(myRoute.steps[i].start_location);
      this.attachInstructionText(
          stepDisplay, marker, myRoute.steps[i].instructions, map);
    }
  }

  attachInstructionText(stepDisplay, marker, text, map) {
    google.maps.event.addListener(marker, 'click', function() {
      // Open an info window when the marker is clicked on, containing the text
      // of the step.
      stepDisplay.setContent(text);
      stepDisplay.open(map, marker);
    });
  }
}