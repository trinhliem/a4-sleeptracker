import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
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
  ViewWillEnter, ViewDidEnter
} from '@ionic/angular/standalone';
import { SleepService } from '../services/sleep.service';
import { addIcons } from 'ionicons';
import { bed, happy } from 'ionicons/icons';
import ApexCharts from "apexcharts";

import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';


const DAY_OFFSETS = [-3, -2, -1, 0, 1, 2, 3]; // for getting weekly data

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

export class HomePage implements ViewDidEnter, OnDestroy {
  @ViewChild('sleepChartContainer') chartElement!: ElementRef<HTMLDivElement>

  currentDate:string = new Date().toISOString();
  selectedDate:string = new Date().toISOString();
  selectedReadableDate:string = formatDate(new Date(this.selectedDate), 'mediumDate', 'en-US');

  private chart?: ApexCharts;

  constructor(public sleepService:SleepService) {
    addIcons({bed, happy});
	}
  async ionViewDidEnter() {
    await this.sleepService.initData();
    this.highlightedDates = this.colorCodeDates();
    this.renderOrUpdateChart();
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }

  get selectedSleepRecord(): OvernightSleepData | undefined {
    const targetYMD = this.selectedDate.slice(0, 10);

    return SleepService.AllOvernightData.find((record) => {
      const recordYMD = formatDate(record.endTime, 'yyyy-MM-dd', 'en-US');
      return recordYMD === targetYMD;
    });
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

  private get7DayRangeData() {
    // 1. Pre-index sleep logs by 'yyyy-MM-dd' for O(1) instant lookup
    const sleepMap = new Map(
      SleepService.AllOvernightData.map((r) => [formatDate(r.endTime, 'yyyy-MM-dd', 'en-US'), r])
    );

    const center = new Date(this.selectedDate);
    return DAY_OFFSETS.map((offset) => {
      const date = new Date(center);
      date.setDate(center.getDate() + offset);

      const key = formatDate(date, 'yyyy-MM-dd', 'en-US');
      const label = formatDate(date, 'EEE', 'en-US');
      const record = sleepMap.get(key);

      return {
        x: label,
        y: record ? this.toChartInterval(record) : []
      };
    });
  }

  private toChartInterval(record: OvernightSleepData): [number, number] {
    let startDec = record.startTime.getHours() + record.startTime.getMinutes() / 60;
    let endDec = record.endTime.getHours() + record.endTime.getMinutes() / 60;

    if (startDec < 18) startDec += 24;
    if (endDec < 18) endDec += 24;

    if (endDec <= startDec) endDec += 24;

    const baseMs = new Date(2026, 0, 1).getTime();
    return [baseMs + startDec * 3600000, baseMs + endDec * 3600000];
  }


  onDateChange(event: DatetimeCustomEvent) {
		this.selectedDate = event.detail.value as string;
		this.selectedReadableDate = formatDate(new Date(this.selectedDate), 'mediumDate', 'en-US');
    this.renderOrUpdateChart();
	}

  private renderOrUpdateChart() {
    const seriesData = this.get7DayRangeData();

    if (this.chart) {
      this.chart.updateSeries([{ name: 'Sleep', data: seriesData }]);
      return;
    }

    if (!this.chartElement) return;

    const options: ApexCharts.ApexOptions = {
      chart: {
        type: 'rangeBar',
        height: 250,
        toolbar: { show: false },
        animations: { enabled: true }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '38%',
          borderRadius: 8
        }
      },
      dataLabels: { enabled: false },
      xaxis: {
        type: 'category',
        axisBorder: { show: false },
        axisTicks: {show: false }
      },
      yaxis: {
        labels: {
          formatter: (val: number) => {
            if (!val || isNaN(val)) return '';
            return new Date(val).toLocaleTimeString([], {hour: 'numeric'});
          }
        }
      },
      grid: {
        borderColor: 'rgba(255, 255, 255, 0.08)',
        strokeDashArray: 3
      },
      series: [
        {name: 'Sleep',
        data: seriesData
        },
      ]
    };

    this.chart = new ApexCharts(this.chartElement.nativeElement, options);
    this.chart.render();

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
