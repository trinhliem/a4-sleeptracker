import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonBackButton, IonButton, IonRange, IonLabel,
    NavController
} from '@ionic/angular/standalone';
import { SleepService } from '../services/sleep.service';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

@Component({
    selector: 'app-log-sleepiness',
    templateUrl: 'log-sleepiness.page.html',
    imports: [
        FormsModule,
        IonHeader, IonToolbar, IonTitle, IonContent,
        IonButtons, IonBackButton, IonButton, IonRange, IonLabel
    ],
})
export class LogSleepinessPage {
    rating: number = 3;

    constructor(
        private sleepService: SleepService,
        private navCtrl: NavController
    ) {}

    getScaleDescription(val: number): string {
        return StanfordSleepinessData.ScaleValues[val] || '';
    }

    async save() {
        const record = new StanfordSleepinessData(this.rating, new Date());
        await this.sleepService.logSleepinessData(record);

        // Automatically navigate back to Home dashboard!
        this.navCtrl.back();
    }
}
