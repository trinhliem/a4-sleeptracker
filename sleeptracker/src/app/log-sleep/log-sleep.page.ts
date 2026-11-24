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
  ViewWillEnter,
  ToastController
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
      private navCtrl: NavController,
      private toastCtrl: ToastController
  ) {}

  async showToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2500,
      position: "middle",
      color: color
    });
    await toast.present();
  }

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
    const bedTime = new Date(this.bedtime);
    const wakeUp = new Date(this.wakeup);

    if (bedTime.getTime() > wakeUp.getTime()) {
      await this.showToast("Bedtime cannot be later than wake up time!", 'danger');
        return;
    }

    const record = new OvernightSleepData(bedTime, wakeUp);
    await this.sleepService.logOvernightData(record);
    await Haptics.notification(( { type: NotificationType.Success}));
    await this.navCtrl.navigateRoot('/home');
    await this.showToast("Sleep logged successfully!", 'success');
  }
}
