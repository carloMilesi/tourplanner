import {Component, ViewChild, ElementRef, NgZone} from '@angular/core';
import {NavController, NavParams, ViewController, AlertController, ModalController} from 'ionic-angular';
// import { Slides } from 'ionic-angular';
import {Platform} from 'ionic-angular';
//import {Geolocation} from '@ionic-native';
//import { Geolocation } from '@ionic-native/geolocation';

//import {PouchDb} from "../../providers/pouch-db/pouch-db";
import {PercorsiPage} from "../percorsi/percorsi";

declare var google;


@Component({
  templateUrl: 'poi-details.html'
})
export class PoiDetailsPage {
  map: any;
  public edited : boolean = true;

  selectedItem: any;
  //mySlideOptions = {
  //  initialSlide: 0,
  //  loop: false
  //};
  private paths: any;

 // @ViewChild('mySlider') slider: Slides;

  constructor(
      private navParams: NavParams,
      private platform: Platform,
      private viewCtrl: ViewController,
      //  private db: PouchDb,
      private zone: NgZone,
      private alertCtrl: AlertController,
      public modalCtrl: ModalController
      //,private geolocation: Geolocation

  ) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.platform = platform;
    //if(this.selectedItem.lat && this.selectedItem.lng)
      //this.initializeMap(this.selectedItem.lat, this.selectedItem.lng);
     // this.loadMap(this.selectedItem.lat, this.selectedItem.lng);
  }

  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }

  /*
  loadMap(lat, lng){
    let options = {timeout: 5000, enableHighAccuracy: true};
    //ENABLE THE FOLLOWING:

    this.geolocation.getCurrentPosition((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude

      //let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      let latLng = new google.maps.LatLng(lat, lng);
      let mapOptions = {
        center: latLng,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(document.querySelector('#map'), mapOptions);


      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.map.getCenter()
      });

      let content = "<h4>Information!</h4>";

      this.addInfoWindow(marker, content);

    },
      (error) => {
      console.log('Error getting location', error);
    });



  }



  initializeMap(lat, lng){
    this.platform.ready().then(() => {
      console.log(lat + " - " + lng);

      var minZoomLevel = 15;

      let mapOptions = {
        zoom: minZoomLevel,
        center: new google.maps.LatLng(lat, lng),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
      };

      this.map = new google.maps.Map(document.getElementById('map'), mapOptions);

      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.map.getCenter()
      });

      let content = "<h4>Information!</h4>";

      this.addInfoWindow(marker, content);

    });
  }
   


  addInfoWindow(marker, content){

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }
*/


  openPathways(event, item){
    console.log("open pathways")
    console.log({poi: item, add: true})
    let modal = this.modalCtrl.create(PercorsiPage, {poi: item, add: true});
    modal.present();

    //this.showRadio();
  }

  /*
  ionViewLoaded() {
    this.platform.ready().then(() => {
      this.loadPathways()
    });
  }

  loadPathways(){
    this.db.initDB();
    this.db.getAll()
      .then(data => {
        this.zone.run(() => {
          console.log(data)
          this.paths = data;
        });
      })
      .catch(console.error.bind(console));
  }


  showRadio() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Seleziona un percorso');

    for(let i = 0; i < this.paths.length; i++){
      alert.addInput({
        type: 'radio',
        label: this.paths[i].title,
        value: this.paths[i].title
      });
    }

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        console.log("ok button pressed")
        //this.testRadioOpen = false;
        //this.testRadioResult = data;
      }
    });
    alert.present();
  }
 */
}
