import {BrowserModule, DomSanitizer} from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {FileExchangeModule} from './file-exchange/file-exchange.module';
import {MatIconRegistry} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FileExchangeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private mir: MatIconRegistry, private ds: DomSanitizer) {
    mir.addSvgIconSet(ds.bypassSecurityTrustResourceUrl('node_modules/@mdi/angular-material/mdi.svg'));
  }
}
