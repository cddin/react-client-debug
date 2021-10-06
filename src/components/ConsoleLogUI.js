import React from "react";

function ConsoleLogUI({deleteAllLabel, consoleLog, onCopyConsoleLog, onConsoleLogItemDelete, onDeleteAllConsoleLog, consoleLogItemRender, onConsoleLogItemView}) {
  return (
    <>
      <div style={{ padding: "5px" }}>
        <button onClick={onDeleteAllConsoleLog}>{deleteAllLabel}</button>
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
              <button onClick={() => onCopyConsoleLog(JSON.stringify(item))}>Copy</button>
              <button style={{marginLeft:"5px"}} onClick={() => onConsoleLogItemDelete(index)}>
                delete
              </button>
              <button  style={{marginLeft:"5px"}} onClick={() => onConsoleLogItemView(item)}>
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
    </>
  );
}

export default ConsoleLogUI;
