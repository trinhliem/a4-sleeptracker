import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonItem,
  IonModal,
  NavController,
  ViewWillEnter
} from '@ionic/angular/standalone';
import {Haptics, NotificationType} from '@capacitor/haptics';
import {SleepService} from '../services/sleep.service';
import {OvernightSleepData} from '../data/overnight-sleep-data';

@Component({
    selector: 'app-log-sleep',
    templateUrl: 'log-sleep.page.html',
  imports: [
    FormsModule,
    IonContent,
    IonButton,
    IonItem, IonDatetime, IonDatetimeButton, IonModal
  ],
})
export class LogSleepPage implements ViewWillEnter { // the interface triggers whenever the page is navigated to
  currentStep: number = 1;
  direction: 'forward' | 'backward' = 'forward';

  bedtime: string = new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString();
  wakeup: string = new Date().toISOString();

  constructor(
      private sleepService: SleepService,
      private navCtrl: NavController
  ) {}

  ionViewWillEnter() {
    this.currentStep = 1;
    this.direction = 'forward';

  }

  nextStep() {
    this.direction = 'forward';
    this.currentStep = 2;
  }

  prevStep() {
    this.direction = 'backward';
    this.currentStep = 1;
  }

  async save() {
      const record = new OvernightSleepData(new Date(this.bedtime), new Date(this.wakeup));
      await this.sleepService.logOvernightData(record);
      await Haptics.notification(( { type: NotificationType.Success}))
      await this.navCtrl.navigateRoot('/home');
  }
}
