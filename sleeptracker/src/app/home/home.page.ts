import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonTabs,
	IonTabBar,
	IonTabButton,
	IonLabel,
	IonIcon,
	IonTab,
 	IonInput,
	IonButton,
  IonButtons,
  IonRange,
  IonFooter,} from '@ionic/angular/standalone';
import { SleepService } from '../services/sleep.service';
import { addIcons } from 'ionicons';
import { bed, happy } from 'ionicons/icons';

import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonTabs,
	IonTabBar,
	IonTabButton,
	IonLabel,
	IonIcon,
	IonTab,
	IonInput,
	IonButton,
  IonRange,
  IonFooter,
  IonToolbar,
  IonButtons,
  RouterLink],
})
export class HomePage implements OnInit{
  constructor(public sleepService:SleepService) {
    addIcons({bed, happy});
	}

	async ngOnInit() {
		console.log(this.allSleepData);
    await this.sleepService.initData();
	}

	/* Ionic doesn't allow bindings to static variables, so this getter can be used instead. */
	get allSleepData() {
		return SleepService.AllSleepData;
	}

}
