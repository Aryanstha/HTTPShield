import React from "react";
import { useState } from "react";
import { apiFetch } from "../../../FetchApi.js";
import AgentConfigurator from "../AgentConfigurator/AgentConfigurator.jsx";

import PresintationButton from "./PresentationButton";

const AddHostDlg = (props) => {
  const monitoringData = props.monitoringData;
  const deleteMonitorUpdate = props.deleteMonitorUpdate;
  const refreshData = props.refreshData
  const removeMonitor = async function (id) {
    const data = await apiFetch({ id }, "remove_monitor");

    deleteMonitorUpdate(data.data);
  };

  const [active, setActive] = useState("Pure Docker");

  return (
    <div>
      <div className="p-6 mt-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h5 className="text-md mb-4 font-bold leading-none text-gray-900 dark:text-white">
          Configure your agent
        </h5>
        <ul className="flex flex-nowrap overflow-x-auto text-sm font-medium text-center">
          <li className="flex shrink-1">
            <PresintationButton
              name={"Pure Docker"}
              setState={setActive}
              active={active}
            ></PresintationButton>
          </li>
          <li className="flex shrink-1">
            <PresintationButton
              name={"Compose"}
              setState={setActive}
              active={active}
            ></PresintationButton>
          </li>
          <li className="flex shrink-1">
            <PresintationButton
              name={"Pure Bash"}
              setState={setActive}
              active={active}
            ></PresintationButton>
          </li>
        </ul>

        <AgentConfigurator
          monitoringData={monitoringData}
          active={active}
        ></AgentConfigurator>
        <p className="ext-md mb-4 font-bold leading-none text-gray-900 dark:text-white">Wait up to 10 seconds for data to appear or refresh page</p>
        <div className="flex justify-between	">
        <button
          onClick={() => {
            removeMonitor(monitoringData.id);
          }}
          className="flex mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 border border-red-700 rounded items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Remove
        </button>
        
        <div>
          <button
            onClick={() => {
              refreshData()
            }}
            className="flex mt-4 py-2 px-4 text-white hover:bg-green-800 dark:focus:ring-gray-700 dark:bg-green-400 dark:border-gray-600 dark:hover:bg-green-500 font-bold rounded items-center"
          >
            <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" viewBox="0 0 24 24" 
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 mr-1">
              <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  strokeWidth="2" />
            </svg>         
            Refresh page
          </button>
        </div>
      </div>
     </div>
    </div>
  );
};

export default AddHostDlg;
