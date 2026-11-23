import { Component } from '@angular/core';
import {
  IonApp,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel
  } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, bed, happy } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    IonApp, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel
  ],
})
export class AppComponent {
  constructor() {
    addIcons({ home, bed, happy });
  }
}

