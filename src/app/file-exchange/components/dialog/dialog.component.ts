import { Component, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FileService } from '../../service/file.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  @ViewChild('file') file;
  public files: Set<File> = new Set();
  public progress: {[key: string]: {progress: Observable<number>}}; // TODO
  public uploading = false;
  public uploadSuccessful = false;

  constructor(public dialogRef: MatDialogRef<DialogComponent>, public uploadService: FileService) {}

  addFiles() {
    this.file.nativeElement.click();
  }

  public onFilesAdded(): void {
    // Create the set of files
    const files: { [key: string]: File } = this.file.nativeElement.files;
    for (const key in files) {
      if (!isNaN(parseInt(key, 10))) {
        this.files.add(files[key]);
      }
    }
  }

  public deleteSelectedFile(file: File): void {
    if (this.files.has(file)) {
      this.files.delete(file);
    }
  }

  public closeDialog(): void {
    return this.dialogRef.close();
  }

  public uploadFile(): void {
    this.uploading = true;
    this.dialogRef.disableClose = true;

    // start the upload and save the progress map
    this.progress = this.uploadService.upload(this.files);

    // convert the progress map into an array for forkJoin
    const allProgressObservables: Observable<number>[] = [];
    for (const key of Object.keys(this.progress)) {
      allProgressObservables.push(this.progress[key].progress);
    }

    // When all progress-observables are completed...
    forkJoin(allProgressObservables).subscribe(() => {
      this.dialogRef.disableClose = false;
      this.uploadSuccessful = true;
      this.uploading = false;
    });
  }
}
