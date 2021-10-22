import React from "react";

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

function ConsoleLogUI({
  deleteAllLabel,
  consoleLog,
  onCopyConsoleLog,
  onConsoleLogItemDelete,
  onDeleteAllConsoleLog,
  consoleLogItemRender,
  onConsoleLogItemView,
}) {
  return (
    <div>
      <div style={{ padding: "5px" }}>
        <button style={styles.button} onClick={onDeleteAllConsoleLog}>
          {deleteAllLabel}
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {consoleLog.map((item, index) => (
          <div
            key={index}
            style={{
              backgroundColor: index % 2 ? "#F0F0F0" : "#E8E8E8",
              display: "flex",
              flexDirection: "column",
              padding: "5px",
              borderBottom: "#000000 solid 1px",
            }}
          >
            <div>
              <button
                style={styles.button}
                onClick={() => onCopyConsoleLog(JSON.stringify(item))}
              >
                Copy
              </button>
              <button
                style={{ ...styles.button, marginLeft: "5px" }}
                onClick={() => onConsoleLogItemDelete(index)}
              >
                delete
              </button>
              <button
                style={{ ...styles.button, marginLeft: "5px" }}
                onClick={() => onConsoleLogItemView(item)}
              >
                view
              </button>
            </div>
            <div
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                marginTop: "5px",
                maxHeight: "100px",
              }}
            >
              {consoleLogItemRender(item)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ConsoleLogUI;
