import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
import { FileService } from '../../service/file.service';

@Component({
  selector: 'app-file-exchange',
  templateUrl: './file-exchange.component.html',
  styleUrls: ['./file-exchange.component.scss']
})
export class FileExchangeComponent implements OnInit {

  public fileList: string[] = [];

  public fileTypeIconStart = 'assets/images/file_type_';

  public loading = true;

  constructor(public dialog: MatDialog, public downloadService: FileService) { }

  ngOnInit() {
    this.downloadFileList();
  }

  public downloadFileList(): void {
    this.loading = true;
    this.downloadService.downloadFileList().subscribe((list) => {
      this.loading = false;
      this.fileList = list;
    });
  }

  public openUploadDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, { width: '50%', height: '50%' });
    dialogRef.afterClosed().subscribe(() => {
      this.downloadFileList();
    });
  }

  public downloadFile(file: string): void {
    this.downloadService.downloadFile(file).subscribe((data: Blob) => {
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = file;
      link.click();
    });
  }

  public deleteFile(file: string): void {
    this.downloadService.deleteFile(file).subscribe(() => {
      this.downloadFileList();
    });
  }

  public getIconFor(file: string): string {
    const extension = file.split('.').pop();
    switch (extension) {
      case 'pdf':
        return this.fileTypeIconStart + 'pdf.png';
      case 'png':
      case 'jpg':
      case 'gif':
        return this.fileTypeIconStart + 'image.png';
      case 'zip':
      case 'rar':
      case '7z':
      case 'gz':
        return this.fileTypeIconStart + 'archive.png';
      case 'xls':
      case 'xlsx':
        return this.fileTypeIconStart + 'excel.png';
      case 'doc':
      case 'docx':
        return this.fileTypeIconStart + 'word.png';
      case 'ppt':
      case 'pptx':
        return this.fileTypeIconStart + 'powerpoint.png';
      case 'tex':
        return this.fileTypeIconStart + 'latex.png';
      case 'mp3':
      case 'aac':
      case 'ac3':
      case 'ogg':
      case 'flac':
      case 'alac':
      case 'wav':
        return this.fileTypeIconStart + 'audio.png';
      case 'exe':
        return this.fileTypeIconStart + 'binary.png';
      case 'c':
        return this.fileTypeIconStart + 'c.png';
      case 'cpp':
        return this.fileTypeIconStart + 'cpp.png';
      case 'cs':
        return this.fileTypeIconStart + 'csharp.png';
      case 'css':
        return this.fileTypeIconStart + 'css.png';
      case 'csv':
        return this.fileTypeIconStart + 'csv.png';
      case 'html':
        return this.fileTypeIconStart + 'html.png';
      case 'java':
        return this.fileTypeIconStart + 'java.png';
      case 'js':
        return this.fileTypeIconStart + 'js.png';
      case 'json':
        return this.fileTypeIconStart + 'json.png';
      case 'm':
        return this.fileTypeIconStart + 'matlab.png';
      case 'py':
        return this.fileTypeIconStart + 'python.png';
      case 'sh':
        return this.fileTypeIconStart + 'shell.png';
      case 'txt':
        return this.fileTypeIconStart + 'text.png';
      case 'ts':
        return this.fileTypeIconStart + 'typexcript.png';
      case 'mp4':
      case 'mkv':
      case 'avi':
      case 'mpeg':
        return this.fileTypeIconStart + 'typexcript.png';
      case 'xml':
        return this.fileTypeIconStart + 'xml.png';
      default:
        return this.fileTypeIconStart + 'default.png';
    }
  }
}
