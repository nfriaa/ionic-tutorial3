# ionic-tutorial3

Ionic tutorial3 : Appel d'une API de type RESTful et affichage des données.

[![contributions welcome](https://img.shields.io/badge/contributions-welcome-orange.svg?style=flat)](https://github.com/nfriaa/ionic-tutorial3/issues) [![Travis](https://img.shields.io/travis/rust-lang/rust.svg)](https://github.com/nfriaa/ionic-tutorial3) [![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/nfriaa/ionic-tutorial3/blob/master/LICENSE)

![](https://img.shields.io/badge/node-8-red.svg)
![](https://img.shields.io/badge/npm-5-blue.svg)
![](https://img.shields.io/badge/ionic-3-ff69b4.svg)
![](https://img.shields.io/badge/angular-5-orange.svg)
![](https://img.shields.io/badge/typescript-latest-green.svg)
![](https://img.shields.io/badge/editor-vscode-yellow.svg)

## Pour tester cette application en local
```sh
git clone https://github.com/nfriaa/ionic-tutorial3.git
cd ionic-tutorial3
npm install
ionic serve
```

## 1. Créer une nouvelle application Ionic
```sh
ionic start ionic-tutorial3 sidemenu
# puis démarrer dans le navigateur :
ionic serve
```

## 2. Créer le provider
C'est la classe qui va intéragir avec le service Web (RESTful) pour récupérer les données.
```sh
ionic g provider PeopleService
```

- changer le code du fichier `src/providers/people-service/people-service.ts` comme suit :
```ts
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
```

- déclarer ensuite l'objet `HttpModule` dans le fichier `src/app/app.module.ts` :
```ts
// dans la partie des imports :
import {HttpModule} from '@angular/http';

// et dans le tableau 'imports' :
imports: [
    ... ,
    HttpModule
  ],
```

## 2. Créer la page qui va contenir la liste des personnes :
- générer la page :
```sh
ionic g page PeopleList
```

- puis déclarer cette page dans le menu principale de l'application (voir ionic-tutorial1)

- modifier le code du fichier `src/pages/people-list/people-list.ts` pour avoir :
```ts
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { PeopleServiceProvider } from "../../providers/people-service/people-service";

@IonicPage()
@Component({
  selector: 'page-people-list',
  templateUrl: 'people-list.html',
  providers: [PeopleServiceProvider]
})
export class PeopleListPage {

  public people: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public peopleServiceProvider: PeopleServiceProvider) {

      console.log("PeopleListPage constructor.");

      this.loadPeople();
  }

  loadPeople(){
    this.peopleServiceProvider.load()
    .then(data => {
      this.people = data;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PeopleListPage');
  }

}
```

- modifier le code du fichier `src/pages/people-list/people-list.html` pour avoir :
```html
<ion-header>
  <ion-navbar>
    <button ion-button menuToggle>
      <ion-icon name="menu"></ion-icon>
    </button>
    <ion-title>Peaple List</ion-title>
  </ion-navbar>
</ion-header>

<ion-content padding>

  <ion-list>
    <button ion-item *ngFor="let person of people">
      <ion-avatar item-left>
        <img src="{{person.picture.thumbnail}}">
      </ion-avatar>
      <h2>{{person.name.first}} {{person.name.last}}</h2>
      <p>{{person.email}}</p>
    </button>
  </ion-list>

</ion-content>
```