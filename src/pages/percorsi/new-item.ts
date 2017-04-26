import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
//import {PouchDb} from '../../providers/pouch-db/pouch-db'
import {Validators, FormBuilder } from '@angular/forms';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  templateUrl: 'new-item.html',
})

export class NewItemPage {
  private form : any;

  constructor(
    private nav: NavController,
    private fb: FormBuilder,
    private nativeStorage: NativeStorage
  ) { }

  ionViewLoaded() {
    this.form = this.fb.group({
      'title': ['', Validators.required],
    })
  }

  saveItem() {
    console.log("this.form.value");
    console.log(this.form.value);


    let pathway = {
      _id: new Date().toISOString(),
      title : this.form.value.title,
      points : []
     };

    console.log(pathway);

    //this.db.saveData(pathway);
    this.nativeStorage.setItem('item', pathway)
      .then(
        () => console.log('Updated pathway!'),
        error => console.error('Error storing item', error)
      );
    this.nav.pop();
    //event.preventDefault();
  }

}
