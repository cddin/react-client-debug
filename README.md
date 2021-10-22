# react-client-debug

react-client-debug is a react component that help developer to read web console log and network log from UI. In case developer have a limitation to access developer tools like chrome inspect.

Just tap the screen for 10 times. "plus" button will appear on the top left screen.

Notes:
Network log - for now only work with axios

## Installation

Use the package manager (NPM) to install.

```bash
npm install react-client-debug
```

## Usage

```javascript
import ReactClientDebug from "react-client-debug";
import axios from "axios";
```

and add at the root of application.

```javascript
<div className="App">
  <ReactClientDebug
    isEnabled={true}
    axios={axios}
    secKey="12345"
    autoLogin={true}
  >
    <header className="App-header">
      <p>Hello World</p>
    </header>
  </ReactClientDebug>
</div>
```

## Custom axios intercept

if you are create new instance of axios, react-client-debug unable to log the network. But there is option to do it manually.

```javascript
import { updateNetworkList } from "react-client-debug";

const xxx = axios.create();
xxx.interceptors.request.use(function (config) {
  // Do something before request is sent
  return updateNetworkList(config);
});
// Add a response interceptor
xxx.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    updateNetworkList(response);
    return response;
  },
  function (error) {
    updateNetworkList(error);
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);
```

## Developer info

[cddin80@gmail.com](mailto:cddin80@gmail.com)

## License

[ISC](https://opensource.org/licenses/ISC)
