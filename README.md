# slot-booking
Slot Booking Assignment 

## 1.Free Slots
Return all the free slots available for a given date converted to whatever timezone we pass.
For reference also added ```bookedSlotMod``` which provide different time details of booked slots. 
```
Api : http://localhost:3001/v1/freeSlots

Body:
{
    "Date": "2023-01-29",
    "Timezone" : "America/Los_Angeles"
}

Response: 
{
    "meta": {
        "Status": true,
        "Message": "Success",
        "code": 200
    },
    "Data": {
        "freeSlots": [
            "2023-01-28T20:30:00-08:00",
            "2023-01-28T21:00:00-08:00",
            "2023-01-28T22:30:00-08:00",
            "2023-01-28T23:30:00-08:00",
            "2023-01-29T00:00:00-08:00",
            "2023-01-29T00:30:00-08:00",
            "2023-01-29T01:00:00-08:00",
            "2023-01-29T01:30:00-08:00",
            "2023-01-29T02:30:00-08:00",
            "2023-01-29T03:00:00-08:00"
        ],
        "bookedSlotMod": [
            {
                "duration": 30,
                "slot": "2023-01-29T05:30:00.000Z",
                "user_slot": "2023-01-28 21:30",
                "config_slot": "2023-01-29 11:00"
            },
            {
                "duration": 30,
                "slot": "2023-01-29T06:00:00.000Z",
                "user_slot": "2023-01-28 22:00",
                "config_slot": "2023-01-29 11:30"
            },
            {
                "duration": 30,
                "slot": "2023-01-29T07:00:00.000Z",
                "user_slot": "2023-01-28 23:00",
                "config_slot": "2023-01-29 12:30"
            },
            {
                "duration": 30,
                "slot": "2023-01-29T10:00:00.000Z",
                "user_slot": "2023-01-29 02:00",
                "config_slot": "2023-01-29 15:30"
            },
            {
                "duration": 30,
                "slot": "2023-01-30T05:30:00.000Z",
                "user_slot": "2023-01-29 21:30",
                "config_slot": "2023-01-30 11:00"
            }
        ]
    },
    "Token": ""
}
```

## 2.Create Event
Whatever data is passed it will create the event and store that into the firestore document, 
if the event already exists for that time it returns status code 422 or else just store it and return with status 200.

```
Api : http://localhost:3001/v1/bookSlot

Body: 
{
    "DateTime": "2023-01-30 11:00",
    "Duration": 30
}

Response 404:
{
    "meta": {
        "Status": false,
        "Message": "Already exist",
        "code": 422
    },
    "Data": {},
    "Token": ""
}

Response 200:
{
    "meta": {
        "Status": true,
        "Message": "Slot Booked",
        "code": 200
    },
    "Data": {},
    "Token": ""
}
```

## 3.Get Event
Returns all the events between given StartDate & EndDate. All events returned as in UTC timezone.

```
Api: http://localhost:3001/v1/getEvents

Body: 
{
    "StartDate":"2023-01-29",
    "EndDate": "2023-02-01"
}

Response:
{
    "meta": {
        "Status": true,
        "Message": "Success",
        "code": 200
    },
    "Data": [
        {
            "duration": 30,
            "slot": "2023-01-29T05:30:00.000Z"
        },
        {
            "duration": 30,
            "slot": "2023-01-29T06:00:00.000Z"
        },
        {
            "duration": 30,
            "slot": "2023-01-29T07:00:00.000Z"
        },
        {
            "duration": 30,
            "slot": "2023-01-29T10:00:00.000Z"
        },
        {
            "duration": 30,
            "slot": "2023-01-30T04:30:00.000Z"
        },
        {
            "duration": 30,
            "slot": "2023-01-30T05:30:00.000Z"
        }
    ],
    "Token": ""
}
```
