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
    var $body = document.getElementById("reactClientDebugMain");
    $body.appendChild($tempInput);
    $tempInput["select"]();
    document.execCommand("copy");
    $body.removeChild($tempInput);
    res("success");
  });
};

export const interceptConsoleLog = (setConsoleLog) => {
  const log = console.log.bind(console);
  console.log = (...args) => {
    // log("DEBUG_HELPER:", ...args);
    setConsoleLog((prev) => [...prev, args]);
  };
};
