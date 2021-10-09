import axios from "axios";
export const updateNetworkLog = (val, setNetworkList) => {
  let newRecord = null;
  let updateRecord = null;
  if (val.method) {
    newRecord = {
      baseURL: val.baseURL,
      url: val.url,
      body: val.data,
      headers: val.headers,
      method: val.method,
      uniqueId: val.uniqueId,
    };
  } else if (val.status >= 200 && val.status < 300) {
    updateRecord = {
      status: val.status,
      responeData: val.data,
      config: val.config,
    };
  } else {
    updateRecord = {
      status: val.response.status,
      responeData: val.response.data,
      config: val.response.config,
    };
  }

  if (newRecord) {
    setNetworkList((prev) => [...prev, newRecord]);
  } else {
    setNetworkList((prev) => {
      let updatedRecord = prev.map((item) => {
        //   console.log(item.uniqueId, updateRecord.config.uniqueId);
        if (item.uniqueId === updateRecord.config.uniqueId) {
          item.responeData = updateRecord.responeData;
          item.status = updateRecord.status;
        }

        return item;
      });

      return updatedRecord;
    });
  }
};

export const copyToClipboard = (textToCopy) => {
  return new Promise((res, rej) => {
    var $tempInput = document.createElement("TEXTAREA");
    var t = document.createTextNode(textToCopy);
    $tempInput.appendChild(t);
    var $body = document.getElementById("debugHelper");
    $body.appendChild($tempInput);
    $tempInput["select"]();
    document.execCommand("copy");
    $body.removeChild($tempInput);
    res("success");
  });
};

export const interceptConsoleLog = (setConsoleLog) => {
  // const log = console.log.bind(console);
  console.log = (...args) => {
    // log("DEBUG_HELPER:", ...args);
    setConsoleLog((prev) => [...prev, args]);
  };
};

export const interceptAxois = (updateNetworkList) => {
  console.log(">>>interceptAxois>>>>");
  // Add a request interceptor
  axios.interceptors.request.use(
    function (config) {
      // Do something before request is sent
      console.log(">>>>>>>", config);
      return updateNetworkList(config);
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );

  // Add a response interceptor
  axios.interceptors.response.use(
    function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      console.log("<<<<<<<", response);
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
};
