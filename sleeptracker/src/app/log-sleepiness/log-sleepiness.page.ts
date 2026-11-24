import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {IonButton, IonContent, IonRange, NavController, RangeCustomEvent} from '@ionic/angular/standalone';
import {Haptics, ImpactStyle, NotificationType} from '@capacitor/haptics';
import {SleepService} from '../services/sleep.service';
import {StanfordSleepinessData} from '../data/stanford-sleepiness-data';

@Component({
    selector: 'app-log-sleepiness',
    templateUrl: 'log-sleepiness.page.html',
  imports: [
    FormsModule,
    IonContent,
    IonButton,
    IonRange
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
        console.log('Saved sleepiness record: ', record.summaryString());
        await Haptics.notification(( { type: NotificationType.Success }))
        await this.navCtrl.navigateRoot('/home');
    }

    onSliderChange(event: RangeCustomEvent)
    {
      console.log('ionChange emitted value:', event.detail.value)
      Haptics.impact({ style: ImpactStyle.Light});
      //this.rating = event.detail.value as number;
    }

}
