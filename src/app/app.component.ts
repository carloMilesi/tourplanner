import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import {PercorsiPage} from '../pages/percorsi/percorsi';
import { TranslateService } from 'ng2-translate';

import {SettingsPage} from '../pages/settings/settings';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HelloIonicPage;
  pages: Array<{title: string, icon: string, component: any}>;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private translateService: TranslateService
) {

    this.initializeApp();
    this.translateService.setDefaultLang("en");
    
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'MENU_POI', icon: 'md-home', component: HelloIonicPage },
      //{ title: 'MENU_CATEGORIES', icon: 'md-locate', component: CategoriesListPage },
      { title: 'MENU_PATHWAYS', icon: 'navigate', component: PercorsiPage },
      { title: "MENU_SETTINGS", icon: 'md-settings', component: SettingsPage },
    ];


  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      //this.splashScreen.hide();
      this.hideSplashScreen();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  hideSplashScreen() {
    if (this.splashScreen) {
      setTimeout(() => {
        this.splashScreen.hide();
      }, 100);
    }
  }
}
