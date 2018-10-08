import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileExchangeComponent } from './components/file-exchange/file-exchange.component';
import { MatButtonModule, MatDialogModule, MatIconModule, MatListModule, MatProgressBarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { DialogComponent } from './components/dialog/dialog.component';
import { FileService } from './service/file.service';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule,
    FlexLayoutModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatProgressBarModule,
    MatIconModule
  ],
  declarations: [ FileExchangeComponent, DialogComponent ],
  exports: [ FileExchangeComponent ],
  providers: [ FileService ],
  entryComponents: [ DialogComponent ]
})
export class FileExchangeModule {}
