//import { HttpClient } from "@angular/common/http";
import { Http } from '@angular/http';
import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";

@Injectable()
export class PeopleServiceProvider {
  constructor(public http: Http) {
    console.log("Hello PeopleServiceProvider Provider");
  }

  data: any;

  load() {
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular HTTP provider to request the data,
      // then on the response, it'll map the JSON data to a parsed JS object.
      // Next, we process the data and resolve the promise with the new data.
      this.http
        .get("https://randomuser.me/api/?results=5")
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          this.data = data.results;
          resolve(this.data);
        });
    });
  }
}
