import { Component, ViewChild } from '@angular/core';
import { NavController, Platform, NavParams, ModalController } from 'ionic-angular';
import { PoiDetailsPage } from './poi-details';
import { PoiService } from '../../services/poi.service';
import { TranslateService } from 'ng2-translate';
import { LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { PathwaysService } from '../../services/pathways.service';

@Component({
  selector: 'map-page',
  templateUrl: 'poi-map.html',
  providers: [PoiService, PathwaysService]

})
export class MapPage {
  @ViewChild('myMap') myMap;

  private points: Array<any> = [];
  private pathway: any = null;
  private path: string;
  private checkOptimize: number = 1; // [0: enable optimization, 1 disable optimization]
  public optimizeContent: string; 



  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public poiService: PoiService,
    public platform: Platform,
    public translate: TranslateService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public pathwaysService: PathwaysService
  ) {

    console.log("Poi map constructor")
    
    this.path = navParams.get('path');
    this.pathway = navParams.get('pathway');
    this.optimizeContent =  this.translate.instant('PATHWAYS.OPTIMIZE_BUTTON');
    
    this.platform.ready().then(() => {

      if (this.pathway) {
        // load pathway optimized or not
        this.optimizePathway(1);
      } 
      else 
      {
        console.log("loading pois form url")
        this.loadPoi();
      }
    })
  }


  loadPoi(){
    this.poiService.load(this.path, pois => {
      this.points = pois;
      //console.log("points in load pois: " + JSON.stringify(this.points))
      this.myMap.loadPois(pois, "pois", this.path);
    })

  }

  itemTapped(event, item) {
    let modal = this.modalCtrl.create(PoiDetailsPage, { item });
    modal.present();
    // this.navCtrl.push(PoiDetailsPage, {
    //   item: item
    // });
  }





  optimizePathway(_type){
    let loading = this.loadingCtrl.create({
      spinner: 'circles'
      //content: 'This will navigate to the next page and then dismiss after 3 seconds.'
    });
  
    loading.present();
    
    let timeOut_value: number = 2000;
    let optimize: number;
    let optimizeLabel: string;
    let p: any;
    let origin: any;
    let destination: any;
    let waypts: any;
    
    timeOut_value = 1000;

    if (this.checkOptimize == 0)
    {
      optimize = 1;
      optimizeLabel = this.translate.instant('PATHWAYS.NO_OPTIMIZE_BUTTON');  
      
      this.poiService.load_optimize(_type, this.pathway,
          (data) => {
                 if (!data.error)
                {
                              origin = data.Points[0];
                              destination = data.Points[data.Points.length-1];
                              waypts = data.Points;
                              p = data.Points;
                            
                              
                            this.myMap.loadPois(p, "pathway", this.path);
                            
                            // pathway
                            this.myMap.calculateAndDisplayRoute(origin, destination, waypts);
                        
                            // extra point
                            let extraPoint = this.pathwaysService.countExtraPoint(this.pathway.points, data.Points);
                            if (extraPoint != 0)
                            {
                              this.myMap.loadMultiPois(extraPoint, '', 'ex');
                            }
                            
                            
                            setTimeout(() => {
                              loading.dismiss();
                              this.checkOptimize = optimize;
                              this.optimizeContent =  optimizeLabel;
                            }, 1000);


                  }
                  else
                  {
                            console.log(data.error);
                            optimize = 0;
                            optimizeLabel = this.translate.instant('PATHWAYS.NO_OPTIMIZE_BUTTON');
                            loading.dismiss();
                            
                  }
            })
     
    }
    else
    {
      optimize = 0;
      optimizeLabel = this.translate.instant('PATHWAYS.OPTIMIZE_BUTTON');
      
      //console.log(this.pathway);
      origin = this.pathway.points[0];
      destination = this.pathway.points[this.pathway.points.length-1];
      waypts = this.pathway.points;
    
     p = this.pathway.points;
  
     this.myMap.loadPois(p, "pathway", this.path);
     this.myMap.calculateAndDisplayRoute(origin, destination, waypts);
    
     setTimeout(() => {
      loading.dismiss();
      this.checkOptimize = optimize;
      this.optimizeContent =  optimizeLabel;
    }, 1000); 


      
      }
 
   /*   
    setTimeout(() => {
      loading.dismiss();
      this.checkOptimize = optimize;
      this.optimizeContent =  optimizeLabel;
    }, timeOut_value);
 */

}



// display extra poi (restaurants, events, ecc.. )in the pathaway map

    addItems(category)
    {
      
      let center_point: any = this.getCenter(this.pathway);
      //console.log(center_point);
      


      let url_param = category +'?lat=' + center_point.lat + '&lng=' + center_point.lng;
    /*
      if  (category == 'deals')
      {
        url_param = += '&data_inizio='+ this.pathway.date_start
      }
  */
    
    
      this.poiService.load(url_param, pois => {
      
      if (pois.length == 0)
      { 
        let toast = this.toastCtrl.create({
          message: this.translate.instant('PATHWAYS.POINT_GET'),
          duration: 3000
        });
        toast.present();
      }
      else
      {
      this.points = pois;
        //console.log(pois);
        //console.log("points in load pois: " + JSON.stringify(this.points))
        if (pois)
          this.myMap.loadPois2(pois, category);
      }
    
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
        
        // test
        //this.myMap.loadSinglePoi({"lat": c_lat, "lng": c_lng});

        return {"lat": c_lat, "lng": c_lng};
    }


  }