import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
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
  IonFooter,
  IonDatetime,
	IonItem,
	DatetimeCustomEvent,
	ViewWillEnter
} from '@ionic/angular/standalone';
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
  RouterLink,
	IonDatetime,
IonItem],
})

export class HomePage implements ViewWillEnter {
  constructor(public sleepService:SleepService) {
    addIcons({bed, happy});
	}

	currentDate:string = new Date().toISOString();
	selectedDate:string = new Date().toISOString();
	selectedReadableDate:string = formatDate(new Date(this.selectedDate), 'mediumDate', 'en-US');

	async ionViewWillEnter() {
		await this.sleepService.initData();
		this.highlightedDates = this.colorCodeDates();
	}

  get greeting(): string {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return 'Good morning';
    } else if (hour >=12 && hour < 17) {
      return 'Good afternoon';
    } else if (hour >= 17 && hour < 21) {
      return 'Good evening';
    } else {
      return 'Good night';
    }
  }

	/* Ionic doesn't allow bindings to static variables, so this getter can be used instead. */
	get allSleepData() {
		return SleepService.AllSleepData;
	}

	onDateChange(event: DatetimeCustomEvent) {
		this.selectedDate = event.detail.value as string;
		this.selectedReadableDate = formatDate(new Date(this.selectedDate), 'mediumDate', 'en-US');
	}

	colorCodeDates() {
		return SleepService.AllOvernightData.map((record) => {
			const dateString = formatDate(record.endTime, 'yyyy-MM-dd', 'en-US');
			const durationHours = record.durationHours;

			let bgColor = '#2dd36f'; //Good
			if(durationHours < 6) {
				bgColor = '#eb445a'; // Bad
			} else if (durationHours < 8) {
				bgColor = '#FFEF00'; // Okay
			}
		

		return {
			date: dateString,
			textColor: '#ffffff',
			backgroundColor: bgColor
		};
	});
}

	highlightedDates: { date: string; textColor: string; backgroundColor: string }[] = [];
}
