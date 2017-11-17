import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { PeopleServiceProvider } from "../../providers/people-service/people-service";
import { PeopleDetailsPage } from '../people-details/people-details';

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
      this.peoples = data;
    });
  }

  itemTapped(event, person) {
    this.navCtrl.push(PeopleDetailsPage, {
      person: person
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PeopleListPage');
  }

}
