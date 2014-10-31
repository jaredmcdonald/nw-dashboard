# nw-dashboard

## configuration

```bash
npm install
```

get a free [weather underground api](http://www.wunderground.com/weather/api/) key, set up a [todo server](https://github.com/jaredmcdonald/todo-server) and set up `config.json`:

```json
{
  "ALERT_SERVER_PORT" : <localhost port on which to listen>,
  "WUNDERGROUND_API_KEY" : "<your api key here>",
  "TODO_SERVER_URL" : "https://path/to/your-todo-server"
}
```

then

```bash
npm start
```

## alert POSTs

nw-dashboard has a POST endpoint for recieving (very rudimentary) alerts. POSTs to `http://localhost:<port>/alert` should have the following two fields:

```json
{
  "title" : "alert title",
  "description" : "this is a longer description of the alert"
}
```

otherwise the server will reject them with a `400 Bad Request`. if accepted, server will send `200 OK`
