import React from "react";
import { useState, useEffect } from "react";
import { apiFetch } from "../../../FetchApi";
import Choices from "choices.js";

const ModalRssFilter = (props) => {
  const id = (props.monitor && props.monitor.id) || "";
  const isModalVisible = props.setModalIsVisible;
  const [initialInputsValue, setInitialInputsValue] = useState([
    { name: "Exclude", data: [] },
    { name: "Highlighted", data: [] },
    { name: "OnlyPrio", data: false },

  ]);

  let excludeInp = null;
  let highlightedInp = null;

  const getItemsValue = (selector) => {
    const nodesList = document.querySelectorAll(selector);

    let values = [];
    nodesList.forEach((e) => {
      values.push(e.dataset.value.trim());
    });
    return values;
  };

  const saveFilters = async () => {
    let newData = [
      {
        name: "Exclude",
        data: getItemsValue(`.badges .choices__item--selectable`),
      },
      {
        name: "Highlighted",
        data: getItemsValue(`.highlighter .choices__item--selectable`),
      },
      {
        name: "OnlyPrio",
        data: document.querySelector('[name="only_prio"]').checked,
      },
    ];
    setInitialInputsValue(newData);
    const data = await apiFetch(
      { id, filters: newData },
      "/set_filters_for_RSS/"
    );

    isModalVisible(false);
  };

  async function getCurrentFilters() {
    const data = await apiFetch({ id }, "/get_filters_for_RSS/");

    let excludeInpVal = excludeInp.getValue();
    let highlightedInpVal = highlightedInp.getValue();

    if (excludeInpVal.length === 0) {
      excludeInp.setValue(data.data[0].data);
    }
    if (highlightedInpVal.length === 0) {
      highlightedInp.setValue(data.data[1].data);
    }

    document.querySelector('[name="only_prio"]').value = data.data[2].data;
    return data;
  }

  useEffect(() => {
    if (!excludeInp) {
      excludeInp = new Choices("#badges", {
        delimiter: ",",
        editItems: true,
        addItems: true,
        maxItemCount: 100,
        removeItemButton: true,
        placeholder: true,
        placeholderValue: "",
      });
    }
    if (!highlightedInp) {
      highlightedInp = new Choices("#highlighted", {
        delimiter: ",",
        items: [],
        addItems: true,
        editItems: true,
        maxItemCount: 100,
        removeItemButton: true,
        placeholder: true,
        placeholderValue: "",
      });
    }
    getCurrentFilters();
  }, []);

  return (
    <>
      <div
        id={id}
        class=" absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-4 w-full max-w-xl h-full md:h-auto z-10  mb-5  text-gray-600 dark:text-gray-400 whitespace-normal truncate dark:bg-gray-700 bg-gray-200"
      >
        <div class=" p-4 w-full max-w-xl h-full md:h-auto">
          <button
            type="button"
            onClick={() => {
              isModalVisible(false);
            }}
            class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
            data-modal-toggle="modal_label-{{@index}}"
          >
            <svg
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
          <h3 className="mb-4 text-lg  text-gray-500 dark:text-gray-400 whitespace-normal font-bold text-center ">
            Filters
          </h3>
          <p className="text-sm text-grey dark:text-white text-left mb-4  break-words ">
            If at least one of this keywords will exist in feed (case-insensitive), feed will not be delivered to plugin. 
            Be careful - you will not know about excluded feeds.{" "}
          </p>
          <p className="mb-1 text-xs">Excluding keywords</p>
          <div className="h-fit  badges overflow-hidden mr-auto bg-gray-50 border z-50  border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white mb-4">
            {" "}
            <input
              defaultValue={
                initialInputsValue.filter((o) => o.name === "Exclude").data
              }
              id="badges"
              type="text"
            ></input>
          </div>
          <p className="text-sm text-grey dark:text-white text-left mb-4  break-words ">
            Optionally, add some keywords to prioritize feeds. If the feed contains one of the
            selected keywords, Hothost will prepend 🔥🔥🔥 in message to draw your attention.
            {" "}
          </p>
          <p className="mb-1 text-xs">Highlighting keywords</p>
          <div className="h-fit  highlighter  overflow-hidden mr-auto bg-gray-50 border z-50  border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
            {" "}
            <input defaultValue="" id="highlighted" type="text"></input>
          </div>
          
          <div className="mb-6 mt-6" >
            <label
              htmlFor="only_prio"
              className="relative inline-flex items-center mb-4 cursor-pointer"
            >
              <input
                checked={
                  initialInputsValue.filter((o) => o.name === "OnlyPrio").data
                }
                name="only_prio"
                type="checkbox"
              />
              {/* <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div> */}
              <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                Deliver only prioritized feeds
              </span>
            </label>
          </div>


          <div className="flex justify-between  mt-4">
            {" "}
            <button
              data-modal-toggle="modal_label-{{@index}}"
              type="button"
              onClick={() => {
                saveFilters();
              }}
              class=" mr-2 w-20 mb-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Save
            </button>
            <button
              data-modal-toggle="modal_label-{{@index}}"
              onClick={() => {
                isModalVisible(false);
              }}
              type="button"
              class="w-20 mb-4 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div className="overlay h-[100vh] w-[100vw] overflow-hidden z-[0] fixed top-0 left-0 bg-gray-900 opacity-50"></div>

      {/* <div className=" w-[60vw] h-[50vh] absolute left-0 right-0 top-0 ring-0 flex mx-auto  translate-y-[50%]  bg-white rounded-lg shadow dark:bg-gray-700 mobile:absolute overflow-hidden flex-col p-4  "> */}

      {/* </div> */}
    </>
  );
};
export default ModalRssFilter;
