import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonBackButton, IonButton,
    IonItem, IonLabel, IonDatetime, IonDatetimeButton, IonModal,
    NavController, IonInput, IonFooter
} from '@ionic/angular/standalone';
import { SleepService } from '../services/sleep.service';
import { OvernightSleepData } from '../data/overnight-sleep-data';

@Component({
    selector: 'app-log-sleep',
    templateUrl: 'log-sleep.page.html',
    imports: [
        FormsModule,
        IonHeader, IonToolbar, IonTitle, IonContent,
        IonButtons, IonBackButton, IonButton,
        IonItem, IonLabel, IonDatetime, IonDatetimeButton, IonModal,
        IonInput, IonFooter
    ],
})
export class LogSleepPage {
    bedtime: string = new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString();
    wakeup: string = new Date().toISOString();

    constructor(
        private sleepService: SleepService,
        private navCtrl: NavController
    ) {}

    async save() {
        const record = new OvernightSleepData(new Date(this.bedtime), new Date(this.wakeup));
        await this.sleepService.logOvernightData(record);

        this.navCtrl.back();
    }

    LogSleep()
    {

    }
}
