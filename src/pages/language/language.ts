/**
 * Created by valentinamarotto on 20/04/17.
 */
import {Component} from '@angular/core';

import { TranslateService } from 'ng2-translate';

@Component({
    templateUrl: 'language.html'
})
export class LanguagePage {
    constructor(public translateService: TranslateService) {}

    setupLang(lang){
        this.translateService.use(lang);
    }
    /*setupItLang(){
        this.translateService.use('it');
    }*/
}
