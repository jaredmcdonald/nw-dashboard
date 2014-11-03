# nw-dashboard

## configuration

```bash
npm install
```

get a free [weather underground api](http://www.wunderground.com/weather/api/) key, set up a [todo server](https://github.com/jaredmcdonald/todo-server) and set up `config.json`:

```json
{
  "ALERT_SERVER_HOST" : "1.2.3.4",
  "ALERT_SERVER_PORT" : 3000,
  "WUNDERGROUND_API_KEY" : "<your api key here>",
  "TODO_SERVER_URL" : "https://path/to/your-todo-server"
}
```

then

```bash
npm start
```

## alert server

nw-dashboard has a built-in server for receiving, retrieving and deleting (very rudimentary) alert messages. server starts up automatically at `http://<host>:<port>`, where `port` is the value specified in `config.json` as `"ALERT_SERVER_PORT"` (defaults to `8080`) and `host` is `"ALERT_SERVER_HOST"` (default is `localhost`, but I've had problems seeing this elsewhere on a network and ended up specifying a network IP here to make it visible). note that for now there is no persistence for alerts--they're just stored in-memory as an array

routes:

### POST `/alert`

body must contain the following two fields:

```json
{
  "title" : "alert title",
  "description" : "this is a longer description of the alert"
}
```

otherwise the server will reject them with a `400 Bad Request`. if accepted, server will send `201 Created` with the url of the resource (`/alerts/<id>`)

### DELETE `/alert/<id>`

deletes the alert with the specified id and return `204 No Content` if there is an alert with that id; `404 Not Found` otherwise

### GET `/alert/<id>`

returns the alert with the specified id (`200 OK`) if there is an alert with that id; `404 Not Found` otherwise

### GET `/alert/all`

returns all alerts (`200 OK`). deleted alerts appear as `null` to preserve array indexing (I know, I know...)
