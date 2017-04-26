import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {HelloIonicPage} from '../pages/hello-ionic/hello-ionic';
import {CategoriesListPage} from '../pages/categories/categories-list';
import {PoiRoot} from '../pages/poi/poi';
import {PoiListPage} from '../pages/poi/poi-list';
import {PoiDetailsPage} from '../pages/poi/poi-details';
import {MapPage} from '../pages/poi/poi-map';
import {PercorsiPage} from '../pages/percorsi/percorsi';
import {LanguagePage} from '../pages/language/language';

import { NativeStorage } from '@ionic-native/native-storage';


import { GoogleMaps } from '@ionic-native/google-maps';

import { HttpModule } from '@angular/http';
import { Http } from '@angular/http';
import {
    TranslateModule,
    TranslateStaticLoader,
    TranslateLoader } from 'ng2-translate/ng2-translate';


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
    LanguagePage
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
    LanguagePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GoogleMaps,
    NativeStorage
  ]
})
export class AppModule {}
