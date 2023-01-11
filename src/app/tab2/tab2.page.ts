import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor() { }
  ionRefresh(event) {
    console.log('ion Refresh event triggered!!');
    console.log(event.target);
    event.target.complete();
  }
  ionPull(event){
    console.log('ion pull event triggered!!');
    // console.log(event.target);
  }
  ionStart(event){
    console.log('ion start event triggered!!');
    console.log(event.target);
  }
}
