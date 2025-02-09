import { API, BlockTool, BlockToolData, ToolConfig } from "@editorjs/editorjs";
import ReactDOM from "react-dom";
import WebsiteQuestionComponent from "./WebsiteQuestionComponent";

export interface WebsiteQuestionData extends BlockToolData {
  label: string;
  help: string;
  placeholder: string;
  required: boolean;
}

export default class WebsiteQuestion implements BlockTool {
  settings: { name: string; icon: string }[];
  api: API;
  data: WebsiteQuestionData;
  nodes: { holder: HTMLElement };
  config: ToolConfig;

  static get toolbox(): { icon: string; title?: string } {
    return {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clip-rule="evenodd" />
    </svg>`,
      title: "Website Question",
    };
  }

  constructor({ api, config, data }: { api: API; config?: ToolConfig; data?: WebsiteQuestionData }) {
    this.api = api;
    this.config = config;

    this.settings = [
      {
        name: "required",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 512" class="w-3 h-3"><path d="M471.99 334.43L336.06 256l135.93-78.43c7.66-4.42 10.28-14.2 5.86-21.86l-32.02-55.43c-4.42-7.65-14.21-10.28-21.87-5.86l-135.93 78.43V16c0-8.84-7.17-16-16.01-16h-64.04c-8.84 0-16.01 7.16-16.01 16v156.86L56.04 94.43c-7.66-4.42-17.45-1.79-21.87 5.86L2.15 155.71c-4.42 7.65-1.8 17.44 5.86 21.86L143.94 256 8.01 334.43c-7.66 4.42-10.28 14.21-5.86 21.86l32.02 55.43c4.42 7.65 14.21 10.27 21.87 5.86l135.93-78.43V496c0 8.84 7.17 16 16.01 16h64.04c8.84 0 16.01-7.16 16.01-16V339.14l135.93 78.43c7.66 4.42 17.45 1.8 21.87-5.86l32.02-55.43c4.42-7.65 1.8-17.43-5.86-21.85z"/></svg>`,
      },
    ];

    this.data = {
      label: data.label || "",
      help: data.help || "",
      placeholder: data.placeholder || "https://",
      required: data.required || false,
    };

    this.nodes = {
      holder: null,
    };
  }

  renderSettings(): HTMLElement {
    const wrapper = document.createElement("div");

    this.settings.forEach((tune) => {
      let button = document.createElement("div");

      button.classList.add("cdx-settings-button");
      button.classList.toggle("cdx-settings-button--active", this.data[tune.name]);
      button.innerHTML = tune.icon;
      wrapper.appendChild(button);

      button.addEventListener("click", () => {
        this._toggleTune(tune.name);
        button.classList.toggle("cdx-settings-button--active");
      });
    });

    return wrapper;
  }

  /**
   * @private
   * Click on the Settings Button
   * @param {string} tune — tune name from this.settings
   */
  _toggleTune(tune: string) {
    if (tune === "required") {
      this.data.required = !this.data.required;
    }
  }

  render(): HTMLElement {
    const rootNode = document.createElement("div");
    this.nodes.holder = rootNode;

    const onDataChange = (newData: WebsiteQuestionData) => {
      this.data = {
        ...newData,
      };
    };

    ReactDOM.render(<WebsiteQuestionComponent onDataChange={onDataChange} data={this.data} />, rootNode);

    return this.nodes.holder;
  }

  save() {
    return this.data;
  }
}
