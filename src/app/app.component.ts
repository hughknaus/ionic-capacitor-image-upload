import { Component, OnInit, VERSION } from '@angular/core';
import { CapacitorHttp } from '@capacitor/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  name = 'Angular ' + VERSION.major;
  url = 'http://localhost:3000';
  photo: Blob;

  constructor() {}

  ngOnInit() {
    console.log(`app::Init`);
    let imgPromise = this.getImage();
    imgPromise.then((res) => {
      if (typeof res.data === Blob) {
        console.log(`app::img`, res.data);
        //this.photo = `data:image/jpeg;base64,${res.data}`;
      }
    });
  }

  private getImage() {
    return CapacitorHttp.get({
      url: `https://images.pexels.com/photos/6037011/pexels-photo-6037011.jpeg?auto=compress&cs=tinysrgb&w=1600`,
    });
  }

  private uploadImage(blobData, name, ext) {
    const formData = new FormData();
    formData.append('file', blobData, `myimage.${ext}`);
    formData.append('name', name);

    return CapacitorHttp.post({ url: `${this.url}/image`, data: formData });
  }

  private uploadImageFile(file: File) {
    const ext = file.name.split('.').pop();
    const formData = new FormData();
    formData.append('file', file, `myimage.${ext}`);
    formData.append('name', file.name);

    return CapacitorHttp.post({ url: `${this.url}/image`, data: formData });
  }

  private uploadImageJpeg(file: File) {
    const ext = file.name.split('.').pop();
    const formData = new FormData();
    formData.append('file', file, `myimage.${ext}`);
    formData.append('name', file.name);

    return CapacitorHttp.post({
      url: `${this.url}/image`,
      webFetchExtra: { credentials: 'include' },
    });
  }

  public blobToBase64$ = (blob: Blob): Observable<string | ArrayBuffer> => {
    const fileReader: FileReader = new FileReader();
    const zoneFileReader = (fileReader as any)[
      '__zone_symbol__originalInstance'
    ]; // see: https://github.com/ionic-team/capacitor/issues/1564

    if (zoneFileReader) {
      console.log(
        `Zone filereader used. See: https://github.com/ionic-team/capacitor/issues/1564`
      );
    }

    const fr = zoneFileReader || fileReader;

    const observable: Observable<string | ArrayBuffer> = new Observable<
      string | ArrayBuffer
    >((observer) => {
      fr.onerror = (ev) => {
        console.error(`photosService::FileReader::blobToBase64::error`, ev);
      };

      fr.onloadstart = () => {
        console.log(`photosService::FileReader::blobToBase64::onloadstart`);
      };

      fr.onloadend = () => {
        console.log(`photosService::FileReader::blobToBase64::onloadend`);
        observer.next(fr.result);
        observer.complete();
      };

      fr.onprogress = (ev) => {
        let value: number = Math.round((ev.loaded / ev.total) * 100);
        console.log(
          `photosService::FileReader::blobToBase64:: progress: ${value}%`
        );
      };
    });

    fr.readAsDataURL(blob);
    return observable;
  };
}
