import { Injectable } from '@angular/core';
import {HttpClient, HttpRequest, HttpEventType, HttpResponse, HttpParams} from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

const fileUploadUrl = 'http://localhost:8000/fileUpload';
const fileListUrl = 'http://localhost:8000/fileList';
const fileDownloadUrl = 'http://localhost:8000/fileDownload';
const fileDeletedUrl = 'http://localhost:8000/fileDelete';

@Injectable()
export class FileService {
  constructor(private http: HttpClient) {}

  public upload(files: Set<File>): {[key: string]: {progress: Observable<number>}} {
    const status = {};

    files.forEach(file => {
      // Create a new form
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);

      // Create a http-post request and pass the form and tell it to report the upload progress
      const req = new HttpRequest('POST', fileUploadUrl, formData, {
        reportProgress: true
      });

      const progress = new Subject<number>();

      // Send the http-request and subscribe for progress
      this.http.request(req).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          // Update the progress percentage
          const percentDone = Math.round(100 * event.loaded / event.total);
          progress.next(percentDone);
        } else if (event instanceof HttpResponse) {
          // File is completely uploaded
          progress.complete();
        }
      });

      // Save progress observable in a map
      status[file.name] = {
        progress: progress.asObservable()
      };
    });

    // Return the map of progress observables
    return status;
  }

  public downloadFile(file: string): Observable<Blob> {
    const params = new HttpParams()
      .set('fileName', file);
    return Observable.create(observer => {
      this.http.get(fileDownloadUrl, {
        params: params,
        responseType: 'blob'
      }).subscribe((data: Blob) => {
        observer.next(data);
        observer.complete();
      });
    });
  }

  public downloadFileList(): Observable<string[]> {
    return Observable.create(observer => {
      this.http.request('GET', fileListUrl).subscribe((data: string[]) => {
        observer.next(data);
        observer.complete();
      });
    });
  }

  public deleteFile(file: string): Observable<string> {
    const params = new HttpParams()
      .set('fileName', file);
    return Observable.create(observer => {
      this.http.delete(fileDeletedUrl, {
        params: params
      }).subscribe((data: string) => {
        observer.next(data);
        observer.complete();
      });
    });
  }
}
