import { Component, ViewChild } from '@angular/core';
import { NavController, Platform, NavParams, ModalController } from 'ionic-angular';
import { PoiDetailsPage } from './poi-details';
import { PoiService } from '../../services/poi.service';


@Component({
  selector: 'map-page',
  templateUrl: 'poi-map.html',
  providers: [PoiService]

})
export class MapPage {
  @ViewChild('myMap') myMap;

  private points: Array<any> = [];
  private pathway: any = null;
  private selectedItem: any;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public poiService: PoiService,
    public platform: Platform
  ) {

    console.log("Poi map constructor")

    this.pathway = navParams.get('pathway');
    this.selectedItem = this.navParams.get('item');

    this.platform.ready().then(() => {

      if (this.pathway) {
        this.myMap.loadPois(this.pathway.points);
      } else {
        console.log("loading pois form url")
        this.loadPoi();
      }
    })
  }


  loadPoi() {
    let url = 'http://seitre.crs4.it:3009/api/v1/' + this.selectedItem.path;
    this.poiService.load(url, pois => {
      this.points = pois;
      //console.log("points in load pois: " + JSON.stringify(this.points))
      this.myMap.loadPois(pois);
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