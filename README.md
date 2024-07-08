## GitHub Link
[https://github.com/Kamal408/event-management](https://github.com/Kamal408/event-management)

## Hosted Demo
[https://kamalkafle.pythonanywhere.com/](https://kamalkafle.pythonanywhere.com/)


## Tech stack used
**Frontend**
* React
* Ant Design

**API**
* Flask

**Database**
* SQLite3

**Scheduler**
* Flask-APScheduler

**Mail SMTP**
* Mailgun [https://www.mailgun.com/](https://www.mailgun.com/)

**Holiday API**
* API Ninjas [https://api-ninjas.com/api/holidays](https://api-ninjas.com/api/holidays)


## Project status

**We'd like the task to be sent in two forms.**

1. A Github link where we can view your code ✅

2. A hosted link with the application ✅

## Task:

Create a calendar scheduling application that allows users with to view the calendar with holidays, create events, and receive notifications of events at the scheduled time. Users should be able to select their preferred timezone, create events on the calendar, and receive notifications of the events.

## Requirements:

**Calendar Management:**

* Enable users to view the calendar dates and select different timezones. ✅

* Allow users to view holidays for selected countries or regions. (Use an API like Holiday API) ✅

**Event Management**

* Provide users with the ability to create, update, delete, and view events on the calendar ✅

* Events should include properties such as title, start time, end time, description, participants ✅

* Implement validation to prevent scheduling conflicts ✅  
    ```
    The validation is done from API when creating event
    ```

**Event Notification Trigger:**

* When an event is created, schedule it in the backend to trigger a notification at the start time ✅
    
* Notifications can be implemented in any preferred way (like browser notification or email) ✅
    ``` 
    For this APP, the notification is implemented to send email for all the participants email 30 mins before the event. 
    ```

## Technical Requirements:

**Backend Development:**

* Choose an appropriate language and web framework for building RESTful APIs. ✅
    ```
    Language: Python
    Framework: Flask
    ```

* Use a database (e.g., SQLite, PostgreSQL) to persist calendar event data. ✅
    ```
    DB: SQLlite
    Flask Extension: Flask-SQLAlchemy
    ```

* Implement mechanisms to schedule notifications for scheduled events. ✅
    ```
    The demo server does not support cron job. The Flask-APScheduler for Flask is used to create a scheduler.
    ```

* Ensure that notifications/events are sent or triggered reliably and efficiently. ✅

**Frontend Development:**

* Utilize React or another frontend framework/library for building the frontend application. ✅
    ```
    React
    ```

* Use appropriate UI components and styling frameworks (e.g., React Bootstrap, Material-UI) to create a visually appealing and responsive user interface. ✅
    ```
    Ant Design
    ```

* Integrate the frontend with the backend APIs for calendar and event management, implementing data fetching and sending mechanisms to interact with the backend endpoints ✅

