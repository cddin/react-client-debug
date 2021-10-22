import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ReactJson from "react-json-view";
import ConsoleLogUI from "./ConsoleLogUI";
import {
  updateNetworkLog,
  copyToClipboard,
  interceptConsoleLog,
  interceptAxios,
} from "./utils";

const CONSOLE = "console";
const NETWORK = "network";
const ERROR = "error";
let updateNetworkListInternal = null;
let tempSecKey = "";

const styles = {
  button: {
    WebkitAppearance: "none",
    MozAppearance: "none",
    appearance: "none",
    padding: "3px 6px",
    border: "1px solid #999999",
    backgroundColor: "rgb(240, 240, 240)",
  },
};

function ReactClientDebug(props) {
  const [isEnabled, setIsEnabled] = useState(props?.isEnabled ?? true);
  const [devMode, setDevMode] = useState(false);
  const [isMinimize, setMinimize] = useState(true);
  const [viewMode, setViewMode] = useState(CONSOLE);
  const [consoleLog, setConsoleLog] = useState([]);
  const [viewObj, setViewObj] = useState(null);

  const [tapCount, setTapCount] = useState(0);
  const [timeOutVar, setTimeoutVar] = useState(null);
  const [networkList, setNetworkList] = useState([]);

  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    updateNetworkListInternal = (val) => {
      updateNetworkLog(val, setNetworkList);
    };
    const dvmode = localStorage.getItem("devmode");
    setDevMode(dvmode === "true");
    if (dvmode === "true") {
      interceptConsoleLog(setConsoleLog);
    }

    interceptAxios(props.axios, updateNetworkList);

    checkIfLogin();
  }, []);

  // ======================
  // UI FUNCTION
  // ======================
  const onDeveloperModeHandler = () => {
    if (!isEnabled) {
      return;
    }

    if (devMode) {
      return;
    }

    if (timeOutVar) {
      clearTimeout(timeOutVar);
    }

    setTapCount(tapCount + 1);

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
      localStorage.removeItem("secKey");
      setIsLogin(false);
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

  function checkIfLogin() {
    // if secKey is not set, skip login
    if (props?.secKey === "") {
      setIsLogin(true);
      return;
    }
    const lsSecKey = localStorage.getItem("secKey");
    if (lsSecKey === props?.secKey && props?.autoLogin) {
      setIsLogin(true);
    }
  }

  function onPwEnter() {
    if (tempSecKey === props?.secKey) {
      setIsLogin(true);
      if (props?.autoLogin) {
        localStorage.setItem("secKey", props?.secKey ?? "");
      }
    }
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
        <button style={styles.button} onClick={onShowClick}>
          +
        </button>
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
            <button style={styles.button} onClick={() => setViewObj(null)}>
              close
            </button>
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
              <button style={styles.button} onClick={onMinimizeClick}>
                -
              </button>
              <button style={styles.button} onClick={onDisableDevModeClick}>
                disable devmode
              </button>
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

  // show login ui
  if (isEnabled && devMode && !isLogin) {
    return (
      <div
        style={{
          padding: "10px",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          top: "0",
          bottom: "0",
          left: "0",
          right: "0",
          margin: "auto",
        }}
      >
        <form
          style={{
            border: "1px solid #cccccc",
            backgroundColor: "aliceblue",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            fontSize: "12px",
          }}
        >
          <label>
            {"Enter key "}
            <input
              type="text"
              onChange={(e) => {
                tempSecKey = e.target.value;
                onPwEnter();
              }}
            />
          </label>
          <button style={styles.button} onClick={() => enableDevMode(false)}>
            cancel
          </button>
        </form>
      </div>
    );
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
      {isMinimize && devMode && isEnabled && <MinMode></MinMode>}
      {!isMinimize && devMode && isEnabled && <MaxMode></MaxMode>}
    </div>
  );
}

ReactClientDebug.propTypes = {
  axios: PropTypes.object.isRequired,
  isEnabled: PropTypes.bool,
  autoLogin: PropTypes.bool,
  secKey: PropTypes.string,
  customArrayProp: PropTypes.arrayOf(function (
    propValue,
    key,
    componentName,
    location,
    propFullName
  ) {
    if (!/matchme/.test(propValue[key])) {
      return new Error(
        "Invalid prop `" +
          propFullName +
          "` supplied to" +
          " `" +
          componentName +
          "`. Validation failed."
      );
    }
  }),
};

ReactClientDebug.defaultProps = {
  isEnabled: true,
  autoLogin: true,
  secKey: "",
};

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
