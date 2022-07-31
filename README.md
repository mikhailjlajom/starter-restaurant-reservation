# Capstone: Restaurant Reservation System

> You have been hired as a full stack developer at _Periodic Tables_, a startup that is creating a reservation system for fine dining restaurants.
> The software is used only by restaurant personnel when a customer calls to request a reservation.
> At this point, the customers will not access the system online.

# Links for the Deployed Application

[Front-end Application](https://final-res-reservation-fe.herokuapp.com/dashboard)

[Back-end Application](https://final-res-reservation-be.herokuapp.com/reservations)

# Screenshots and Description

## Dashboard (/dashboard)

![](/deployed-screenshots/Dashboard.png)

![](/deployed-screenshots/DashboardButtons.png)

1. List all reservations for date (defaulted to today's date), reservations are sorted by time
  - shows details of the reservation including Name, Phone number, Date, Time, # of People, and status
  - display buttons
     - Seat (Seats the reservation to a free table)
     - Edit (Edits the details of the reservation)
     - Cancel (Changes the status of the reservation to cancelled)
2. List all tables, sorted by name
  - shows details of table including, table_id, table name, capacity, and (free or occupied)
  - if table is occupied finish button appears, allows to finish the reservation at the table
3. Buttons to switch dates, going to previous, today, or next date

4. Any errors will appear above the table

## Search (/search)

![](/deployed-screenshots/Search.png)

1. Searches reservation/reservations by phone number. 
  - Reservations that are found by phone number will be sorted by time
  - Reservations shown will have all details including status and buttons Seat, Edit, and Cancel

## Creating a reservation (/reservations/new)

![](/deployed-screenshots/CreateReservation.png)

1. Creates a new reservation with a Form to fill out
  - All fields are required
  - Any errors upon creating a reservation will appear above the table eg. Incorrect reservation time, and date.

## Editing an existing reservation (/reservations/edit)

![](/deployed-screenshots/EditReservation.png)

1. Edits an existing reservation with the same form used in Creating a reservation but details are autofilled. 
  - Cancelling the edit goes back to previous page
  - Submitting the editted reservation returns the user to the dashboard for the date of the edited reservation

## Seat a reservation (/reservations/:reservation_id/seat)

![](/deployed-screenshots/SeatReservation.png)

1. Seats a reservation to a table.
  - Select options to choose which table to seat reservation
  - If any errors upon seating happen, will be shown above of the form
  - Submitting form will bring user to dashboard with table now being occupied and finish button appears
  - Cancelling the form brings user to the previous page

## Create a table (/tables/new)

![](/deployed-screenshots/CreateTable.png)

1. Creates a new table
  - Creates a new table with a form
  - Any errors upon submitting will appear above the form
  - Submitting the form will bring user to dashboard with newly added table to the list
  - Cancelling the form will bring user back to previous page

## Technology

Build using:

- HTML
- CSS
- React.Js
- Bootstrap
- Knex
- Express
- Heroku
- PostgreSQL

## Installation

1. Fork and clone this repository.
1. Run cp ./back-end/.env.sample ./back-end/.env.
1. Update the ./back-end/.env file with the connection URL's to your ElephantSQL database instance.
1. Run cp ./front-end/.env.sample ./front-end/.env.
1. You should not need to make changes to the ./front-end/.env file unless you want to connect to a backend at a location other than http://localhost:5001.
1. Run npm install to install project dependencies.
1. Run npm run start:dev to start your server in development mode.
