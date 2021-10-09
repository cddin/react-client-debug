import React, { useState, useEffect } from "react";
import ConsoleLogUI from "./ConsoleLogUI";
import ReactJson from "react-json-view";

import {
  updateNetworkLog,
  copyToClipboard,
  interceptConsoleLog,
  interceptAxois,
} from "./utils";

const CONSOLE = "console";
const NETWORK = "network";
const ERROR = "error";
let updateNetworkListInternal = null;

function ReactClientDebug(props) {
  const [isDebugHelperReader, setIsDebugHelperReader] = useState(false);
  const [devMode, setDevMode] = useState(false);
  const [isMinimize, setMinimize] = useState(true);
  const [viewMode, setViewMode] = useState(CONSOLE);
  const [consoleLog, setConsoleLog] = useState([]);
  const [viewObj, setViewObj] = useState(null);

  const [tapCount, setTapCount] = useState(0);
  const [timeOutVar, setTimeoutVar] = useState(null);
  const [networkList, setNetworkList] = useState([]);

  useEffect(() => {
    updateNetworkListInternal = (val) => {
      updateNetworkLog(val, setNetworkList);
    };
    const dvmode = localStorage.getItem("devmode");
    setDevMode(dvmode === "true");
    if (dvmode === "true") {
      interceptConsoleLog(setConsoleLog);
    }

    setIsDebugHelperReader(true);
    interceptAxois(updateNetworkList);
  }, []);

  // ======================
  // UI FUNCTION
  // ======================
  const onDeveloperModeHandler = () => {
    if (props.isDisable) {
      return;
    }

    if (devMode) {
      return;
    }

    if (timeOutVar) {
      clearTimeout(timeOutVar);
    }

    setTapCount(tapCount + 1);

    console.log("tapCount:", tapCount);
    if (tapCount === 10) {
      clearTimeout(timeOutVar);
      enableDevMode(true);
      alert("Developer mode ON");
      interceptConsoleLog(setConsoleLog);
    } else {
      setTimeoutVar(setTimeout(() => setTapCount(0), 250));
    }
  };

  const onShowClick = () => {
    setMinimize(false);
  };

  const onMinimizeClick = () => {
    setMinimize(true);
  };

  const onDisableDevModeClick = () => {
    enableDevMode(false);
  };
  const enableDevMode = (val) => {
    localStorage.setItem("devmode", val ? "true" : "false");
    setDevMode(val);
    if (!val) {
      setTapCount(0);
    }
  };

  const onViewModeChange = (event) => {
    setViewMode(event.target.value);
  };

  const onDeleteAllConsoleLog = () => {
    setConsoleLog([]);
  };

  const onDeleteAllNetworkLog = () => {
    setNetworkList([]);
  };

  const onConsoleLogItemDelete = (index) => {
    setConsoleLog((prev) => {
      prev.splice(index, 1);
      return [...prev];
    });
  };

  const onNetworkLogItemDelete = (index) => {
    setNetworkList((prev) => {
      prev.splice(index, 1);
      return [...prev];
    });
  };

  function consoleLogItemRender(item) {
    return item.map((subItem) => `${JSON.stringify(subItem)}, `);
  }

  function onConsoleLogItemView(item) {
    setViewObj(item);
  }

  function networkLogItemRender(networkItem) {
    let statusColor = "#999999";
    const networkStatusCode = networkItem.status ? networkItem.status : 0;
    if (networkStatusCode >= 200 && networkStatusCode < 300) {
      statusColor = "#32cd32";
    } else if (networkStatusCode >= 300) {
      statusColor = "#ff0000";
    }

    return (
      <div>
        <span>{networkItem.method}</span> [
        <span style={{ color: statusColor, fontWeight: "bold", fontSize: 12 }}>
          {networkItem.status ? networkItem.status : "pending"}
        </span>
        ] <span>{networkItem.url}</span>
      </div>
    );
  }
  // =====================
  // UI
  // =====================

  const MinMode = () => {
    return (
      <div
        style={{
          backgroundColor: "#CCCCCC",
          zIndex: 99,
          position: "fixed",
          top: 0,
        }}
      >
        <button onClick={onShowClick}>+</button>
      </div>
    );
  };

  const MaxMode = () => {
    return (
      <div>
        {viewObj && (
          <div
            style={{
              backgroundColor: "#ffffff",
              zIndex: 99,
              position: "fixed",
              top: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <button onClick={() => setViewObj(null)}>close</button>
            <div style={{ width: "100%", height: "100%", overflow: "scroll" }}>
              <ReactJson src={viewObj} collapsed={true} />
            </div>
          </div>
        )}

        {!viewObj && (
          <div
            style={{
              backgroundColor: "#CCCCCC",
              zIndex: 99,
              position: "fixed",
              top: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                backgroundColor: "#aeaeae",
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <button onClick={onMinimizeClick}>-</button>
              <button onClick={onDisableDevModeClick}>disable devmode</button>
              <select
                name="viewMode"
                id="viewMode"
                onChange={onViewModeChange}
                value={viewMode}
              >
                <option value={CONSOLE}>{CONSOLE}</option>
                <option value={NETWORK}>{NETWORK}</option>
                <option value={ERROR}>{ERROR}</option>
              </select>
            </div>

            <div
              style={{
                width: "100%",
                overflow: "scroll",
                backgroundColor: "#F8F8F8",
              }}
            >
              {viewMode === CONSOLE && (
                <ConsoleLogUI
                  deleteAllLabel="Delete all console log"
                  consoleLog={consoleLog}
                  onCopyConsoleLog={copyToClipboard}
                  onConsoleLogItemDelete={onConsoleLogItemDelete}
                  onDeleteAllConsoleLog={onDeleteAllConsoleLog}
                  consoleLogItemRender={consoleLogItemRender}
                  onConsoleLogItemView={onConsoleLogItemView}
                />
              )}
              {viewMode === NETWORK && (
                <ConsoleLogUI
                  deleteAllLabel="Delete all network log"
                  consoleLog={networkList}
                  onCopyConsoleLog={copyToClipboard}
                  onConsoleLogItemDelete={onNetworkLogItemDelete}
                  onDeleteAllConsoleLog={onDeleteAllNetworkLog}
                  consoleLogItemRender={networkLogItemRender}
                  onConsoleLogItemView={onConsoleLogItemView}
                />
              )}
              {viewMode === ERROR && <ErrorUI />}
            </div>
          </div>
        )}
      </div>
    );
  };

  const ErrorUI = () => {
    return (
      <div style={{ padding: "5px" }}>
        <div>ErrorUI - coming soon</div>s
      </div>
    );
  };

  if (!isDebugHelperReader) {
    return <div></div>;
  }

  return (
    <div
      id="debugHelper"
      onClick={onDeveloperModeHandler}
      style={{
        textAlign: "left",
        fontSize: "11px",
        position: "absolute",
        top: "0",
        bottom: "0",
        left: "0",
        right: "0",
        color: "#000000",
        letterSpacing: "0.5px",
      }}
    >
      {props.children}
      {isMinimize && devMode && <MinMode></MinMode>}
      {!isMinimize && devMode && <MaxMode></MaxMode>}
    </div>
  );
}

export default ReactClientDebug;

export function updateNetworkList(val) {
  val.uniqueId = Math.floor(
    Math.random() * Math.floor(Math.random() * Date.now())
  );
  if (updateNetworkListInternal) {
    updateNetworkListInternal(val);
  }

  return val;
}
