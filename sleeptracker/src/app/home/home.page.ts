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
	DatetimeCustomEvent
} from '@ionic/angular/standalone';
import { SleepService } from '../services/sleep.service';
import { addIcons } from 'ionicons';
import { bed, happy } from 'ionicons/icons';

import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

//For coloring the dates in the calendar, assign each date a package
interface DateColors {
	textColor: string;
	backgroundColor: string;
	//border: string;
}

	const SleepAmount: Record<'good' | 'bad' | 'okay', DateColors> = {
	good: {
		textColor: '#09721b',
		backgroundColor: '#d4f5d4',
		//border: '1px solid #09721b'
	},
	bad: {
		textColor: '#800080',
      	backgroundColor: '#ffc0cb',
      	//border: '1px solid #e91e63',
	},
	okay: {
		textColor: '#737000',
      	backgroundColor: '#FDEFB2',
      	//border: '1px solid #FFE135',
	}
}

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

export class HomePage implements OnInit{
  constructor(public sleepService:SleepService) {
    addIcons({bed, happy});
	}

	currentDate:string = new Date().toISOString();
	selectedDate:string = new Date().toISOString();
	selectedReadableDate:string = formatDate(new Date(this.selectedDate), 'mediumDate', 'en-US');

	async ngOnInit() {
		console.log(this.allSleepData);
    await this.sleepService.initData();
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
		console.log('HomePage.allSleepData', SleepService.AllSleepData);
		return SleepService.AllSleepData;
	}

	onDateChange(event: DatetimeCustomEvent) {
		this.selectedDate = event.detail.value as string;
		this.selectedReadableDate = formatDate(new Date(this.selectedDate), 'mediumDate', 'en-US');
	}

	

	highlightedDates = [
		{date: '2026-11-26', ...SleepAmount.good},
		{date: '2026-11-27', ...SleepAmount.bad},
		{date: '2026-11-28', ...SleepAmount.okay}
	];
}
