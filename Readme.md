# Forecast and Historical Data API


## requirements
[OPEN WEATHER MAP API KEY](https://home.openweathermap.org/api_keys) <br>
[VISUAL CROSSING API KEY](https://www.visualcrossing.com/)

## Location endpoints
  
  ```/api/v1/location (GET)```
  > Get all locations
  
  ```/api/v1/location/:location_id (GET)```
  > Get a location by id
  
  ```/api/v1/location/user-locations (GET)```
  > Get all locations of a user

  ```/api/v1/location (POST)```
  > Create a new location
  ```
  Request Body:
  {
    "zip": "string",
    "country_code": "string",
  }
  ```

  ```/api/v1/location/:location_id (PUT)```
  > Update a location by location_id

  ```/api/v1/location/:location_id (DELETE)```
  > Delete a location by location_id

## Weather endpoints
  ```/api/v1/weather/:location_id (GET)```
  > Get weather forecast for a location by location_id

  ```/api/v1/weather/history/:location_id/:days (GET)```
  > Get historical weather data for a location by location_id and number of days in past 7,15,30


## User operation endpoints

```/api/v1/users/register (POST)```

```
Register a new user
Request Body:
{
  "email": "string",
  "password": "string"
  "username": "string"
}
```

```/api/v1/users/login (POST)```

```
login
Request Body:
{
  "username": "string",
  "password": "string"
}
```

```/api/v1/users/logout (POST)```

```/api/v1/users/refresh-token(POST)```
