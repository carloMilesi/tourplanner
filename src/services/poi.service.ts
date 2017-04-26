import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


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

  dataToPoi(data){
    let res = [];
    for(let i = 0; i< data.length; i++) {
      res.push({
        title : data[i].label,
        description : data[i].abstract,
        lat : data[i].lat,
        lng : data[i].long,
        thumbnail : data[i].image,
        photos : data[i].photo
      })

    }
    return res;

  }



}







