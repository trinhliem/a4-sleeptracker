--Readme document for Trinh Nguyen Do, Kavein Zhang, trinhln1@uci.edu, kaveinz@uci.edu, *UCI id(s)*--

1. How many assignment points do you believe you completed (replace the *'s with your numbers)?

10/10
- 1/1 The ability to log overnight sleep
- 1/1 The ability to log sleepiness during the day
- 1/1 The ability to view these two categories of logged data
- 2/2 Either using a native device resource or backing up logged data
- 2/2 Following good principles of mobile design
- 2/2 Creating a compelling app
- 1/1 A readme and demo video which explains how these features were implemented and their design rationale

2. How long, in hours, did it take you to complete this assignment?
16 hours


3. What online resources did you consult when completing this assignment? (list specific URLs)
https://ionic.io/ionicons
https://ionicframework.com/docs/
https://apexcharts.com/docs/chart-types/range-bar-chart/
https://gemini.google.com/app


4. What classmates or other individuals did you consult as part of this assignment? What did you discuss?
As a team we discussed different options to display data (color-coded calendars, bar charts, etc.). We also discussed
how to route between pages, data validation, and so on.


5. Is there anything special we need to know in order to run your code?
No


--Aim for no more than two sentences for each of the following questions.--


6. Did you design your app with a particular type of user in mind? If so, whom?
We designed the app for casual users who wanted to view their sleep data and sleepiness throughout the day in charts.


7. Did you design your app specifically for iOS or Android, or both?
We designed the app for iOS, and we tried to keep the design to be close to be similar to iOS apps'.


8. How can a person log overnight sleep in your app? Why did you choose to support logging overnight sleep in this way?
The person can click on the "Sleep" button on the navigation bar, and enter their bedtime, then they can click 'next'
to advance to the wakeup menu and finish logging their overnight sleep. We think that it is more intuitive and simpler
as the data is logged chronologically, and we also drew inspiration from other sleep tracking apps.




9. How can a person log sleepiness during the day in your app? Why did you choose to support logging sleepiness in this way?
The person can click on the "Sleepiness" button on the navigation bar, then use the slider to select their sleepiness
rating according to the rating description. We think that putting the numerical rating on a slider is more intuitive,
and the description helps the user decide.



10. How can a person view the data they logged in your app? Why did you choose to support viewing logged data in this way?
The user can land in home (which is the data button), and click on a date on the calendar and see their sleep data
in the chart. We drew inspiration from Apple's Health app which shows sleep data in range bar charts, and similarly we
use a line chart for the sleepiness data.



11. Which feature choose--using a native device resource, backing up logged data, or both?
We did both: backing up logged data using Capacitor's Preferences, and added Haptics.


12. If you used a native device resource, what feature did you add? How does this feature change the app's experience for a user?
We added haptics to the slider and to the sleep data logging button. This way it's more engaging and the user
would know when they have logged their data successfully.


13. If you backed up logged data, where does it back up to?
Data is backed up to the device's native local storage using @capacitor/preferences (on iOS is NSUSerDefaults). All sleep data
is serialized into JSON and persists across reboots.

14. How does your app implement or follow principles of good mobile design?
Our app has a bottom tab navigation, and two-step process when logging sleep to keep things simple. We also color code
calendar for hitting sleep goals, added tactile feedback when logging sleepiness, and added data visualizations for
user-friendliness.