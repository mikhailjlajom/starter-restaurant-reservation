# Capstone: Restaurant Reservation System

> You have been hired as a full stack developer at _Periodic Tables_, a startup that is creating a reservation system for fine dining restaurants.
> The software is used only by restaurant personnel when a customer calls to request a reservation.
> At this point, the customers will not access the system online.

# Links for the Deployed Application

[Front-end Application](https://final-res-reservation-fe.herokuapp.com/dashboard)

[Back-end Application](https://final-res-reservation-be.herokuapp.com/reservations)

# Screenshots and Description

## Dashboard (/dashboard)

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
