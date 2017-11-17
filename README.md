# ionic-tutorial3

Ionic tutorial3 : Appel d'une API de type RESTful et affichage des données (liste / détails). L'API utilisée dans ce tutorial est `https://randomuser.me` qui permet d'avoir un ou plusieurs personnes exemples.

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
Nous allons recupérer 5 utilisateurs à partir de l'API `randomuser.me` à l'aide de l'URL `https://randomuser.me/api/?results=5`
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
        .get("https://randomuser.me/api/?results=10")
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

## 2. Créer la page qui va contenir la liste des personnes
- générer la page :
```sh
ionic g page PeopleList
```

- puis déclarer cette page dans le menu principale de l'application (voir ionic-tutorial1).

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

  public peoples: any;

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
    <button ion-item *ngFor="let person of peoples">
      <ion-avatar item-left>
        <img src="{{person.picture.thumbnail}}">
      </ion-avatar>
      <h2>{{person.name.title}} {{person.name.first}} {{person.name.last}}</h2>
      <p>{{person.email}}</p>
    </button>
  </ion-list>

</ion-content>
```

## 3. Créer la page qui va contenir les détails d'une personne
- générer la page :
```sh
ionic g page PeopleDetails
```

- puis déclarer cette page dans le fichier `src/app/app.module.ts` (voir ionic-tutorial1).

- dans le fichier `src/pages/people-list/people-list.html` ajouter l'appel de fonction après le clic :
```html
<button ion-item *ngFor="let person of peoples" (click)="itemTapped($event, person)">
```

- dans le fichier `src/pages/people-list/people-list.ts` ajouter la fonction `itemTapped` qui nous rediriger vers la page `PeopleDetailsPage` :
```ts
itemTapped(event, person) {
    this.navCtrl.push(PeopleDetailsPage, {
      person: person
    });
  }
```

- le code du fichier `src/pages/people-details/people-details.ts` :
```ts
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-people-details',
  templateUrl: 'people-details.html',
})
export class PeopleDetailsPage {

  selectedItem: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.selectedItem = navParams.get('person');
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PeopleDetailsPage');
  }

}
```

- le code du fichier `src/pages/people-details/people-details.html` :
```html
<ion-header>
  <ion-navbar>
    <button menuToggle *ngIf="!selectedItem">
      <ion-icon name="menu"></ion-icon>
    </button>
    <ion-title>People Details</ion-title>
  </ion-navbar>
</ion-header>

<ion-content>

  <ion-card *ngIf="selectedItem">
    <img src="{{selectedItem.picture.medium}}" />
    
    <ion-card-content>
      <ion-card-title>
        {{selectedItem.name.title}} {{selectedItem.name.first}} {{selectedItem.name.last}}
      </ion-card-title>

      <p>
        Email: {{selectedItem.email}}
        <br/>
        Phone: {{selectedItem.phone}}
        <br/>
        Nationality: {{selectedItem.nat}}
        <br/>
        City: {{selectedItem.location.city}}
        <br/>
        State: {{selectedItem.location.state}}
        <br/>
        Birth date: {{selectedItem.dob}}
      </p>
    </ion-card-content>
  </ion-card>

</ion-content>
```

Et voilà vous pouvez visualiser la liste des personnes et lorsqu'on clic sur une personne on obtient les détails.