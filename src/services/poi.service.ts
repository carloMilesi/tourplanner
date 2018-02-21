import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';




@Injectable()
export class PoiService {
  data: any;
  constructor(
    private http: Http
  ) { }


  private proxy_url = 'http://seitre.crs4.it:3009/api/v1/';
  //private proxy_url = 'http://smartapi.crs4.it/tourplanner/api/v1/';
  //private proxy_url_optimize = 'http://192.167.144.196:5010/v1/requestTrip/';
  private proxy_url_optimize = 'touristtrip.ddns.net5010';

  load(path, _cb?) {
    this.http.get(this.proxy_url + path)
      .map(res => res.json())
      .subscribe(data => {
        // we've got back the raw data, now generate the core schedule data
        // and save the data for later reference
        this.data = this.dataToPoi(data);
        if(_cb !== undefined)
          _cb(this.data);
      });

  }

  load_optimize(params, _cb?)
  {
    this.http.post(this.proxy_url_optimize, params)
      .map(res => res.json())
      .catch((err) => {
                
                console.log(err);
                return Observable.throw(err)
            })
      .subscribe(data => {
        this.data = this.dataToPoi(data);
        if(_cb !== undefined)
          _cb(data);
      })
      
}



      

  dataToPoi(data){
    let res = [];
    for(let i = 0; i< data.length; i++) {
      /*res.push({
        title : data[i].label,
        description : data[i].abstract,
        lat : data[i].lat,
        lng : data[i].long,
        thumbnail : data[i].image,
        photos : data[i].photo
      })*/
        res.push({
            title : data[i].data.title,
            description : data[i].data.description,
            lat : data[i].data.latitude,
            lng : data[i].data.longitude,
            thumbnail : data[i].data.img,
            photos : data[i].data.photo,
            phone : data[i].data.phone,
            address: data[i].data.address,
            rating: data[i].rating,
            time_to_visit: data[i].time_to_visit
        })



    }
    return res;

  }



  coutItem()
  {
    return this.http.get(this.proxy_url + 'count')
        .map((res: Response) => res.json())
        .catch(this.catchError);
        
  }

/*
  private getData(res: Response)
  {
    return res.json() || {};
  }
*/
  private catchError(error: Response | any)
  {
    console.log(error);
    return Observable.throw(error.json().error || "Db error");
  }

}







