import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Platform, ModalController, NavController } from 'ionic-angular';
import { PoiDetailsPage } from './poi-details';
import { TranslateService } from 'ng2-translate';

declare var google;
declare var MarkerClusterer;

@Component({
  selector: 'map-component',
  templateUrl: 'map.html',
})
export class MapComponent {
  @ViewChild('map') mapElement: ElementRef;


  //@Input() points: Array<any>;

 // private startPosition: any;
  private map: any;
  private items: any;
  private directionsService: any;
  private directionsDisplay: any;
  private routeResponse: any;
  private pathway = false;
  private markerArray = [];
  

  constructor(public nav: NavController
    , public platform: Platform
    , public zone: NgZone
    , public modalCtrl: ModalController
    ,  public translate: TranslateService,) 
    {
    console.log("Map constructor")
    this.nav = nav;
  }

  ngAfterViewInit() {
    this.loadMap();
  }


  loadMap(item?) {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});

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
      
      this.addInfoWindow(marker, item.title, null);
    }
  }


// generate map and set multi point in the map -> clustering

  loadPois(pois, kindoflist, category) {
  
  if (kindoflist== "pathway"){
    this.pathway= true;
    }

    this.items = pois;
    this.getPointsBounds((bounds) => {
      this.loadMap();
      this.map.fitBounds(bounds);
      
      if(kindoflist == "pois"){
        console.log("poi points count " + this.items.length);

let locations: any = [];

        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].lat && this.items[i].lng) {
         
            let marker = new google.maps.Marker({
              map: this.map,
              animation: google.maps.Animation.DROP,
              position: new google.maps.LatLng(this.items[i].lat, this.items[i].lng),
            });
            this.addInfoWindow(marker, this.items[i], category);
          
            locations.push(marker);
            
          }
        }

        new MarkerClusterer(this.map, locations,
          {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});


    
      }

    })
  }


// set one single point in the map

loadSinglePoi(pois)
{
  /*
  let marker = new google.maps.Marker({
    map: this.map,
    animation: google.maps.Animation.DROP,
    position: new google.maps.LatLng(pois.lat, pois.lng),
  });
  */

}

// set multi poit in the map

loadMultiPois(pois, category, type)
{
  let customIcon: string;
  
  if (type = 'ex')
    customIcon = 'img/marker_black.png';
  
  for (let i = 0; i < pois.length; i++) {
    if (pois[i].lat && pois[i].lng) {
      //console.log(this.items[i].title + ": " + this.items[i].lat + " - " + this.items[i].lng)

      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(pois[i].lat, pois[i].lng),
        label: 'X',
        zIndex: -10000,
        icon: customIcon
      });
      this.addInfoWindow(marker, pois[i], category);

    }
  }
}


// set multi point in the map -> clustering

loadPois2(pois, category) {
  
  this.items = pois;
  
        let locations: any = [];
        
                for (let i = 0; i < this.items.length; i++) {
                  if (this.items[i].lat && this.items[i].lng) {
                  
                    let marker = new google.maps.Marker({
                      map: this.map,
                      animation: google.maps.Animation.DROP,
                      position: new google.maps.LatLng(this.items[i].lat, this.items[i].lng),
                    });
                    console.log(this.items[i]);
                    this.addInfoWindow(marker, this.items[i], category);
                  
                    locations.push(marker);
                    
                  }
                }
          
              
                new MarkerClusterer(this.map, locations,
                  {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
     

    
  }



  setMapHeight(height){
    this.mapElement.nativeElement.style.height = height;
  }

  getPointsBounds(_cb) {
    var bound = new google.maps.LatLngBounds();

    for (let i = 0; i < this.items.length; i++)
      if (this.items[i].lat && this.items[i].lng)
        bound.extend(new google.maps.LatLng(this.items[i].lat, this.items[i].lng));

    //console.log("center of the map: " + bound.getCenter().toString());
    // let zoom = this.getMapZoom(bound);
    _cb(bound);
  }

  getMapZoom(bound) {
    let pixelWidth = 328; // a constant in Google's map projection
    let GLOBE_WIDTH = 256; // a constant in Google's map projection
    let west = bound.northeast;
    let east = bound.southwest;

    //console.log(west + " - " + east);

    let angle = east - west;
    if (angle < 0) {
      angle += 360;
    }

    //console.log(Math.LN2);

    let zoom = Math.round(Math.log(pixelWidth * 360 / angle / GLOBE_WIDTH) / Math.LN2);
    console.log(zoom);
    return zoom;
  }


/**
Create marker popup

*/

  addInfoWindow(marker, content, type) {

    
    let contentString: string;
    
    // marker extended description
    if (content.description && content.description.length > 140)
    {
        content.description = content.description.substr(0, 140) + '...';
    }
    
    // restaurants and events
    if (type && (type == 'restaurants' ||type == 'events' || type == 'deals'))
    {
      if (type == 'restaurants')
          contentString = '<div><h5>'+content.title+'</h5><div>'+content.address+'</div><div style="margin-bottom: 4px">'+this.createRating(content.rating)+'</div></div>';
      if (type == 'events')
          contentString = '<div><h5>'+content.title+'</h5><img src="'+ content.thumbnail +'" style="height:120px; float: left; margin-right: 10px"><span>'+content.description+'</span></div>';
      if (type == 'deals')
          contentString = '<div><h5>'+content.title+'</h5><img src="'+ content.thumbnail +'" style="height:120px; float: left; margin-right: 10px"><span>'+content.description+'</span><span><br></span></div>';
      if (type == 'map_optimize') //points in optimized map
          contentString = content;
    }
    else
    {
    
      if (content.rating && content.description)
        {
              contentString = '<div><h5>'+content.title+'</h5><div style="margin-bottom: 4px">'+this.createRating(content.rating)+'</div><img src="'+ content.thumbnail +'" style="height:120px; float: left; margin-right: 10px"><span>'+content.description+'</span></div>';
        }
        else // only title description
        {
              contentString = '<div><h5>'+content+'</h5></div>';
        }
      }
  
    let infoWindow = new google.maps.InfoWindow({
      content: contentString
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
      //this.itemTapped("click", item)
    });
  } 

createRating(rating)
{
  let rate_str:string = '';
  let src_1: string = '<img src="img/if_star.png" height="20">';
  let src_2: string = '<img src="img/if_star-e.png" height="20">';
  
  switch(rating) {
               case 1:
                 rate_str = src_1+ src_2 + src_2+ src_2 + src_2;
               break;
               case 2:
                 rate_str = src_1+ src_1 + src_2+ src_2 + src_2;
               break;
               case 3:
                 rate_str = src_1+ src_1 + src_1+ src_2 + src_2;
               break;
               case 4:
                 rate_str = src_1+ src_1 + src_1+ src_1 + src_2;
               break;
               case 5:
                 rate_str = src_1+ src_1 + src_1+ src_1 + src_1;
               break;

      }
      return rate_str;
}


   itemTapped(event, item) {
     let modal = this.modalCtrl.create(PoiDetailsPage, { item });
     modal.present();
   }



  calculateAndDisplayRoute(origin, destination ,waypts){

    console.log("FUNCTION calculateAndDisplayRoute ");
    console.log(waypts);
    /**
     * waypoints[]specifies an array of DirectionsWaypoints.
     * Waypoints alter a route by routing it through the specified location(s).
     * A waypoint is specified as an object literal with fields shown below:
     * - location specifies the location of the waypoint, as a LatLng, as a google.maps.Place object or as a String which will be geocoded.
     * - stopover is a boolean which indicates that the waypoint is a stop on the route, which has the effect of splitting the route into two routes.
     * */
   
    let waypoints = [];
    let waypoints_titles = [];
    for (let i=1; i<waypts.length-1;i++){
      if(waypts[i].lat && waypts[i].lng){
        waypoints.push({ location : new google.maps.LatLng(waypts[i].lat, waypts[i].lng), stopover: true});
      }
    }
    
    //tutti i title
    for (let i in waypts){
      if(waypts[i].lat && waypts[i].lng){
        waypoints_titles.push({ title : waypts[i].title, fk_category:  waypts[i].fk_category, linea: waypts[i].linea});
      }
    }

    let latlng_origin = { location : new google.maps.LatLng(origin.lat, origin.lng)};
    let latlng_destination = { location : new google.maps.LatLng(destination.lat, destination.lng)};

    console.log("origin: " + JSON.stringify(latlng_origin));
    console.log("destination: " + JSON.stringify(latlng_destination));

    this.routeResponse = null;

    if (typeof google !== "undefined") {

      
      let routeRequest = {
        origin: latlng_origin,
        destination: latlng_destination,
        waypoints: waypoints,
        optimizeWaypoints: false,
        provideRouteAlternatives: false,
        travelMode: 'WALKING'
      };
      
      this.directionsService.route(routeRequest, (response, status) => {
        

        if (status === 'OK') {
          this.directionsDisplay.setDirections(response);
          
          this.showSteps(response, waypoints_titles);
        } else {
          window.alert('Directions request failed due to ' + status);
        }

      });
      
    }
  }

  showSteps(directionResult, waypts_titles) {
    // For each step, place a marker, and add the text to the marker's
    // info window. Also attach the marker to an array so we
    // can keep track of it and remove it when calculating new
    // routes.
    var myRoute = directionResult.routes[0];
    var icon : string; 
    
    
    for (var i = 0; i < myRoute.legs.length; i++) {
     
      icon = "https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=" + (i+1) + "|4C9E21|000000";

      

     if (waypts_titles[i].title.substring(0,5) == "Start") //port start
     {
          if (i == 0 || i == myRoute.legs.length) {
             icon = "img/logo_icon.png";
          }
          waypts_titles[i].title = "<div><h5>Cruise terminal</h5></div>";
      }
      else if (waypts_titles[i].fk_category == undefined || waypts_titles[i].fk_category == 100) // ctm icon
      {
        console.log('CTM');
        icon = "https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=" + (i+1) + "|FE7900|FFFFFF";
        waypts_titles[i].title = "<div><h5><img src='img/ctm.png' style='float: left; margin-right: 10px'>CTM " + this.translate.instant('line') + " " + waypts_titles[i].linea + "</h5></div><span>"+ this.translate.instant('bus_stop') + ": " + waypts_titles[i].title +"</span>";
      }
      

      var marker = new google.maps.Marker({
        position: myRoute.legs[i].start_location,
        animation: google.maps.Animation.DROP,
        map: this.map,
        icon: icon
      });
      this.addInfoWindow(marker, waypts_titles[i].title, null);
      this.markerArray.push(marker);
    }
    
  
 // menage last point of the pathway
    
    if (waypts_titles[i].title.substring(0,5) == "Stop_")  //port stop
     {
          icon = "img/logo_icon.png";
          waypts_titles[i].title = "<div><h5>Cruise terminal</h5></div>";
      }
      else //last POI
      {
        if (waypts_titles[i].fk_category == undefined || waypts_titles[i].fk_category == 100) // ctm icon, this case is not real
      {
        icon = "https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=" + (i+1) + "|FE7900|FFFFFF";
        waypts_titles[i].title = "<div><h5><img src='img/ctm.png' style='float: left; margin-right: 10px'>CTM " + this.translate.instant('line') + " " + waypts_titles[i].linea + "</h5></div><span>"+ this.translate.instant('bus_stop') + ": " + waypts_titles[i].title +"</span>";
      }
      else  
      {
      icon ="https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=" + (i+1) + "|4C9E21|000000";
        waypts_titles[i].title = "<div><h5>" + waypts_titles[i].title + "</h5></div>";
      }
      }

    var marker = new google.maps.Marker({
      position: myRoute.legs[i - 1].end_location,
      animation: google.maps.Animation.DROP,
      map: this.map,
      icon: icon 
    });
    this.addInfoWindow(marker, waypts_titles[i].title, 'map_optimize');
    //console.log(waypts_titles[i].title);
    this.markerArray.push(marker);
  }

  attachInstructionText(marker, text) {
    google.maps.event.addListener(marker, 'click', function() {
      // Open an info window when the marker is clicked on,
      // containing the text of the step.
      this.stepDisplay.setContent(text);
      this.stepDisplay.open(this.map, marker);
    });
  }

 
}