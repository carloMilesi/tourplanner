import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Http} from '@angular/http';

import { NativeStorage } from '@ionic-native/native-storage';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/of';


@Injectable()
export class PathwaysService {
  //obPathways : Observable<any>
  pathways: Array<any> = [];
  serve: Boolean = true;

  constructor(
    private nativeStorage: NativeStorage
    , public platform: Platform
    , private http: Http

  ) {
    console.log("Pathways service constructor");

  }

  add(new_pathway) {
    console.log("Adding a new pathway");

    this.pathways.unshift(new_pathway);
    if (this.serve)
      this.saveLocal();

    return this.pathways;
  }


  getAll(_cb) {
    console.log("Retreiving ALL pathways");
    //return new Observable.of(this.pathways);
    this.init(_cb)
  }

  update(pathway) {
    console.log("updating pathways array for id " + pathway._id)
    let path = this.pathways.filter(p => p._id == pathway._id)[0];
    let index = this.pathways.indexOf(path)
    console.log("index " + index)
    if (index > -1) {
      this.pathways.splice(index, 1)
      this.pathways.unshift(pathway)
      this.saveLocal();
    }

  }

  remove(pathway) {
    console.log("Removing pathway form list");

    let index = this.pathways.indexOf(pathway, 0);
    if (index > -1) {
      this.pathways.splice(index, 1);
    }
    this.saveLocal();

  /*this.pathways.splice(pathway, 1);
    if (this.serve)
      this.saveLocal();*/

  }

  saveLocal() {
    console.log("local this.pathways " + JSON.stringify(this.pathways))
    this.nativeStorage.setItem('pathways', this.pathways)
      .then(
      () => console.log("Pathways saved!!!"),
      error => console.error('Error while storing pathways', error)
      );

  }

  // get all pathway
  init(_cb) {
    console.log("Initialization pathways array");

    this.nativeStorage.getItem('pathways')
      .then(
      (pathways) => {
        console.log("Retreiving local storage pathways");
        this.pathways = pathways;
        _cb(this.pathways);
      },
      (error) => {
        console.error('Error retreiving local storage pathways')
        console.log(JSON.stringify(error))
        if (error.code == 2) {
          this.saveLocal()
          _cb(this.pathways);
        }
      }
      );
  }


//get pathway by id
getPathwayById(_id)
{
  return new Promise((resolve, reject) => {
    
    this.nativeStorage.getItem('pathways')
    .then(data => {
        console.log("Retreiving local storage pathways");
        
        if (Array.isArray(data))
        {
              let arr_data: any = [];
              arr_data.unshift(data);
              console.log(arr_data);
              
              for (let i = 0; i < arr_data[0].length; i++) {
                
                  if (arr_data[0][i]._id == _id)
                  {
                    //console.log(arr_data[0][i]);
                    resolve(arr_data[0][i]);
                  }
                  else
                    resolve([]);
                }
          }
          else
            resolve([]); 
   },
    (error) => {
      console.error('Error retreiving local storage pathways')
      console.log(JSON.stringify(error))
      reject(error);
      
    });
  });

}


// insert poi to pathway

insertPoi(_id, poi)
{
        
  return new Promise((resolve, reject) => {

      this.getPathwayById(_id)
          .then(pathway => {
            //let p: any;
            //p = pathway;
            console.log('============================ insertPoi');
            console.log('=> id percorso: ' + _id);  
            console.log('=> percorso');  
            console.log(pathway);
            console.log('=> poi da inserire');
            console.log(poi);
              let poiIndex = pathway['points'].filter(point => point.title === poi.title); // verifica se il punto è già presente
              console.log('=> check presenza poi');
              console.log(poiIndex.length);
              if (poiIndex.length > 0) {
                          resolve([]);
                        }
              else
              {
                pathway['points'].unshift(poi); //json del percorso
                
                console.log("updating pathways array for id " + pathway['_id'])
                
                this.nativeStorage.getItem('pathways')
                          .then(
                          (pathways) => {
                            console.log("=> pathways");
                            
                            let a: any;
                            a = pathway;
                            let path = pathways.filter(p => p._id == a._id)[0];
                            
                            this.pathways = pathways;
                            let index = this.pathways.indexOf(path);
                            console.log('check presenza pathway index: ' + index);
                            if (index > -1) {
                              this.pathways.splice(index, 1)
                              this.pathways.unshift(pathway);
                              console.log(this.pathways);
                              this.nativeStorage.setItem('pathways', this.pathways)
                                    .then(
                                    () => resolve(pathway),
                                    error => console.error('Error while storing pathways', error)
                                    );
                              
                            }
                            else
                              resolve([]);
                            
                          },
                          (error) => {
                            console.error('Error retreiving local storage pathways')
                            console.log(JSON.stringify(error))
                            reject([]);
                            
                          }
                          );
                
                
                
                
                
                
              }
          },
          (error) => {
            console.error('Errore')
            console.log(JSON.stringify(error));
            resolve(error);
          });

  
  
  
  
  });

}


// insert pathway
insertPathway(pathway, _cb)
{
  this.nativeStorage.getItem('pathways')
	.then(
	data => {
		console.log(data);
		if (Array.isArray(data))
		{
					data.unshift(pathway);
					this.nativeStorage.setItem('pathways', data)
				      .then(
				        () => {console.log('Updated pathway add value!'); 
                  _cb(1);
                 
                

              },
				        error => console.error('Error storing item', error)
				      );
	     }
	    else // first pathway
	    {	
                let _pathways: any;
                _pathways.unshift(pathway);

					this.nativeStorage.setItem('pathways', _pathways)
				      .then(
				        () => {console.log('Updated pathway! create value'); 
                _cb(2);
                
                
                
              },
				        error => console.error('Error storing item', error)
				      );
	    }	
	},
	error => console.error(error)
		);

}



deletePoint(item, pathway, _cb)
{
  if (pathway)
  {
    console.log(pathway._id);
    console.log(item._id);
    //console.log(this.pathway);
    let new_pathway: any = [];
   
    this.nativeStorage.getItem('pathways')
    .then(
    data => {
      if (Array.isArray(data))
      {
        
        let arr_data: any = [];
        arr_data.unshift(data);
        console.log(arr_data);
        
        for (let i = 0; i < arr_data[0].length; i++) {
          
          if (arr_data[0][i]._id == pathway._id)
          {
            //console.log(arr_data[0][i]);
            
            for (let ii = 0; ii < arr_data[0][i].points.length; ii++) {
              if (arr_data[0][i].points[ii]._id == item._id)
              {
               // console.log(arr_data[0][i].points[ii]);
                arr_data[0][i].points.splice(ii, 1);
                console.log(arr_data[0][i]);
                new_pathway.push(arr_data[0][i]);
                
              }
            }
          }
        
        } 
        console.log(new_pathway[0]);
        
        this.nativeStorage.setItem('pathways', arr_data[0])
        .then(
          () => {console.log('Updated pathway! create value'); 
          _cb(new_pathway[0]);
        },
          error => console.error('Error storing item', error)
        );


      }
    
    },
    error => console.error(error)
      );



    
  }
  console.log('delete point');
}



//count the point excluded

countExtraPoint(pathway, pathway_opt)
{
  
  let check: boolean = false;
  let extraPoint: any = [];
  
  if (pathway.length > pathway_opt.length - 2)
  {
      for(let i = 0; i < pathway.length; i++){
        
        check = false;

        for (let ii = 0; ii < pathway_opt.length; ii++)
        {
          
            if (pathway_opt[ii].title == pathway[i].title)
            {
              check = true;
              break;
            }
          
        }

        
      if (check == false)
      {
        extraPoint.push(pathway[i]);
      }
  }
  
  return extraPoint;
  }
  else
   return 0;
}




insert_OpenData(pathway)
{
  return new Promise((resolve, reject) => {
      this.http.post('http://seitre.crs4.it:3009/api/v1/pathway', pathway)
      .map(response => response.json())
      .subscribe(result => {
        
        resolve(result.value);
      }, (err) => {
        reject(-1);
      });

    });
}




}







