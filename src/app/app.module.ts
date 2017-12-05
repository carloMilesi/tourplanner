import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { CategoriesListPage } from '../pages/categories/categories-list';
import { PoiRoot } from '../pages/poi/poi';
import { PoiListPage } from '../pages/poi/poi-list';
import { PoiDetailsPage } from '../pages/poi/poi-details';
import { MapPage } from '../pages/poi/poi-map';
import { MapComponent } from '../pages/poi/map';
import { PathwayInsertPage} from '../pages/pathway-insert/pathway-insert';

import { PercorsiPage } from '../pages/percorsi/percorsi';
import { NativeStorage } from '@ionic-native/native-storage';
import { SettingsPage } from '../pages/settings/settings';


import { HttpModule } from '@angular/http';
import { Http } from '@angular/http';

import {
TranslateModule,
TranslateStaticLoader,
TranslateLoader } from 'ng2-translate/ng2-translate';
import { StarRatingComponent } from '../components/star-rating/star-rating';


export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}

@NgModule({ 
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    HelloIonicPage,
    CategoriesListPage,
    PoiRoot,
    PoiListPage,
    PoiDetailsPage,
    MapPage,
    PercorsiPage,
    MapComponent,
    SettingsPage,
    PathwayInsertPage,
    StarRatingComponent
    
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    HelloIonicPage,
    CategoriesListPage,
    PoiRoot,
    PoiListPage,
    PoiDetailsPage,
    MapPage,
    PercorsiPage,
    MapComponent,
    SettingsPage,
    PathwayInsertPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    NativeStorage,
    Geolocation
  ]
})
export class AppModule {}
