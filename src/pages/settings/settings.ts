/**
 * Created by valentinamarotto on 20/04/17.
 */
import { Component } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { NativeStorage } from '@ionic-native/native-storage';



@Component({
    templateUrl: 'settings.html'
})
export class SettingsPage {
    private settings: any = {
        language: String
    }

    constructor(
        public translateService: TranslateService,
        private nativeStorage: NativeStorage) { }

        
    init(){
        console.log("init settings...")
        this.translateService.setDefaultLang("en");

        this.nativeStorage.getItem("settings").then((settings) => {
            this.settings = settings;
            this.translateService.use(settings.language);
        }, (error) => {
           this.setupLang("en");
        });
    }

    setupLang(lang) {
        this.translateService.use(lang);

        this.settings.language = lang;
        this.nativeStorage.setItem("settings", this.settings).then(() => {
            console.log("Settings saved")
        })
    }



}
