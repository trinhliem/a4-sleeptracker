import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';


const STORAGE_KEYS = {
  OVERNIGHT: 'sleeptracker_overnight_records',
  SLEEPINESS: 'sleeptracker_sleepiness_records',
  HAS_SEEDED: 'sleeptracker_has_seeded'  // load default data flag if first launch
};

@Injectable({
  providedIn: 'root'
})
export class SleepService {
	private static LoadDefaultData:boolean = true;
	public static AllSleepData:SleepData[] = [];
	public static AllOvernightData:OvernightSleepData[] = [];
	public static AllSleepinessData:StanfordSleepinessData[] = [];

	constructor() {
    this.initData();
		if(SleepService.LoadDefaultData) {
			this.addDefaultData();
		SleepService.LoadDefaultData = false;
	}
	}


  /**
   * dummy values for first start up -- for display purposes
   * @private
   */
	private addDefaultData(): void {
		var goToBed = new Date();
		goToBed.setDate(goToBed.getDate() - 1); //set to yesterday
		goToBed.setHours(1, 3, 0); //1:03am

		var wakeUp = new Date();
		wakeUp.setTime(goToBed.getTime() + 8 * 60 * 60 * 1000); //Sleep for exactly eight hours, waking up at 9:03am
		this.logOvernightData(new OvernightSleepData(goToBed, wakeUp)); // add that person was asleep 1am-9am yesterday

    var sleepinessDate = new Date();
		sleepinessDate.setDate(sleepinessDate.getDate() - 1); //set to yesterday
		sleepinessDate.setHours(14, 38, 0); //2:38pm

    this.logSleepinessData(new StanfordSleepinessData(4, sleepinessDate)); // add sleepiness at 2pm
		goToBed = new Date();
		goToBed.setDate(goToBed.getDate() - 1); //set to yesterday
		goToBed.setHours(23, 11, 0); //11:11pm
		wakeUp = new Date();
		wakeUp.setTime(goToBed.getTime() + 9 * 60 * 60 * 1000); //Sleep for exactly nine hours

    this.logOvernightData(new OvernightSleepData(goToBed, wakeUp));
	}


	public async logOvernightData(sleepData:OvernightSleepData) {
		SleepService.AllSleepData.push(sleepData);
		SleepService.AllOvernightData.push(sleepData);

    await this.saveAll(); // save to native storage
	}

	public async logSleepinessData(sleepData:StanfordSleepinessData) {
		SleepService.AllSleepData.push(sleepData);
		SleepService.AllSleepinessData.push(sleepData);

    await this.saveAll(); // save to native storage
	}

  /**
   * Initialize data on each run
   */
  public async initData(): Promise<void> {
    const {value: hasSeeded} = await Preferences.get({ key: STORAGE_KEYS.HAS_SEEDED});

    if (!hasSeeded) {
      this.addDefaultData();
      await Preferences.set({ key: STORAGE_KEYS.HAS_SEEDED, value: 'true'});
      await this.saveAll();
    } else {
      await this.loadAll();
    }
  }


  /**
   * Reads stored JSON strings from Preferences and instantiate class instances
   */
  public async loadAll(): Promise<void> {
    SleepService.AllSleepData = [];
    SleepService.AllOvernightData = [];
    SleepService.AllSleepinessData = [];

    // grab raw overnight sleep data from JSON and instantiate them into sleepData objects
    const { value: overnightJson } = await Preferences.get({ key: STORAGE_KEYS.OVERNIGHT });

    if (overnightJson) {
      const rawRecords: any[] = JSON.parse(overnightJson);

      for (const item of rawRecords) {
        const overnight = new OvernightSleepData(
          new Date(item.sleepStart),
          new Date(item.sleepEnd)
        );
        overnight.id = item.id;
        overnight.loggedAt = new Date(item.loggedAt);

        // push to the new object to the class arrays
        SleepService.AllOvernightData.push(overnight);
        SleepService.AllSleepData.push(overnight)
      }
    }

    // grab Stanford Sleepiness Data from JSON and instantiate
    const {value: sleepinessJson} = await Preferences.get({key: STORAGE_KEYS.SLEEPINESS});

    if (sleepinessJson) {
      const rawRecords: any[] = JSON.parse(sleepinessJson);

      for (const item of rawRecords) {
        const sleepiness = new StanfordSleepinessData(
          item.loggedValue,
          new Date(item.loggedAt)
        );
        sleepiness.id = item.id;

        // push to the new object to the class arrays
        SleepService.AllSleepinessData.push(sleepiness);
        SleepService.AllSleepData.push(sleepiness);
      }
    }
  }


  /**
   * Saves all sleep data into native storage
   */
  public async saveAll(): Promise<void> {
    await Preferences.set({
      key: STORAGE_KEYS.OVERNIGHT,
      value: JSON.stringify(SleepService.AllOvernightData)
    })
    await Preferences.set({
      key: STORAGE_KEYS.SLEEPINESS,
      value: JSON.stringify(SleepService.AllSleepinessData)
    })
  }

  public async persistData() {
    await Preferences.set({
      key: 'overnight_records',
      value: JSON.stringify(SleepService.AllOvernightData)
    });
    await Preferences.set({
      key: 'sleepiness_records',
      value: JSON.stringify(SleepService.AllSleepinessData)
    });
  }


  /**
   * Clears all data from native storage and in-memory arrays.
   * Used for new session/log-out
   */
  public async clearAllData(): Promise<void> {
    await Preferences.clear();

    SleepService.AllSleepData = [];
    SleepService.AllOvernightData = [];
    SleepService.AllSleepinessData = [];
  }

}
