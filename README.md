# Notificare Live API Console

A simple Express + SockJS server to display a live console of incoming Live API messages

## Usage

```sh
PRIVATE_KEY=xxx PUBLIC_KEY=yyy PORT=3014 node index.js
```

Where keys come from Settings in Dashboard

The LiveAPI is listening on the `/live` route, so make sure your URL in Dashboard maps to that.

## License

This software is distributed under the
[Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0),
see LICENSE.txt and NOTICE.txt for more information.
