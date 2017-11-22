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

  load(url, _cb?) {
    this.http.get(url)
      .map(res => res.json())
      .subscribe(data => {
        // we've got back the raw data, now generate the core schedule data
        // and save the data for later reference
        this.data = this.dataToPoi(data);
        if(_cb !== undefined)
          _cb(this.data);
      });

  }

  load_optimize(url, params, _cb?)
  {
    this.http.post(url, params)
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
    //return this.http.get('http://156.148.14.147:3009/api/v1/count')
    return this.http.get('http://smartapi.crs4.it/tourplanner/api/v1/count')
    //.do((res: Response) => console.log(res))
        .map((res: Response) => res.json())
        .catch(this.catchError);
        
  }


  private getData(res: Response)
  {
    return res.json() || {};
  }

  private catchError(error: Response | any)
  {
    console.log(error);
    return Observable.throw(error.json().error || "Db error");
  }

}







