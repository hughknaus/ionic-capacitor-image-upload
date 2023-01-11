import { Component, OnInit } from '@angular/core';
import { CapacitorHttp } from '@capacitor/core';
import { from, Observable, tap, map } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  url = 'http://localhost:3000';
  photo$: Observable<string>;

  constructor() {
    console.log(`Tab1Page::Ctor`);
  }

  ngOnInit() {
    console.log(`Tab1Page::Init`);
    let imgPromise = from(this.getImage());
    this.photo$ = imgPromise.pipe(
      map(res => res.data),
      tap(data => { 
        console.log(`Tab1Page::data`, data);
      }),
      map(responseTypeBlob => { 
        var blob = this.toBlob(`data:image/jpeg;base64,${responseTypeBlob}`);
        // const uInt8Array = new Uint8Array(binaryData);
        // var blob = new Blob([uInt8Array], { type: "image/jpeg" });
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = URL.createObjectURL(blob);
        console.log(`Tab1Page::imageUrl`, imageUrl);
        return imageUrl;
      }),
    );
  }

  private getImage() {
    return CapacitorHttp.get({
      url: `http://localhost/193843.jpg`,
      headers: { accept: `image/jpeg` },
      responseType: `blob`
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

  public toBlob(base64: string) {
    console.log(`FilesService::toBlob::`, base64);
    const data = base64.replace(/^data:/, '');
    const imageType = base64.match(/image\/[^;]+/) ? base64.match(/image\/[^;]+/)[0] ?? "image/jpeg" : "image/jpeg";
    const base64String = data.replace(/^[^,]+,/, '');

    const rawData = window.atob(base64String);
    const bytes = new Array(rawData.length);
    for (var x = 0; x < rawData.length; x++) {
        bytes[x] = rawData.charCodeAt(x);
    }
    const arr = new Uint8Array(bytes);
    const blob = new Blob([arr], { type: imageType });

    return blob;
}

}
