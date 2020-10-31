"use strict";
import { LitElement, html, css } from "lit-element";
import { repeat } from "lit-html/directives/repeat.js";
import "@polymer/paper-button";
import "@polymer/iron-iconset-svg";
import "@polymer/iron-icon";
import "@polymer/paper-styles/default-theme.js";
import "@polymer/paper-checkbox/paper-checkbox.js";

import "@01ht/ht-spinner";
import "./cloudinary-widget.js";
import {
  callFirebaseHTTPFunction
  // callTestHTTPFunction
} from "@01ht/ht-client-helper-functions";

import "./ht-storage-item.js";

import { stylesBasicWebcomponents } from "@01ht/ht-theme/styles";

class HTStorage extends LitElement {
  static get styles() {
    return [
      stylesBasicWebcomponents,
      css`
        paper-button {
          background: var(--accent-color);
          color: #fff;
          font-weight: 500;
          padding: 8px 16px;
          height: 36px;
        }

        strong {
          font-weight: 500;
        }

        paper-button#delete {
          color: #f44336;
          background: none;
        }

        iron-icon {
          margin-right: 4px;
        }

        #container {
          display: flex;
          flex-direction: column;
          border: 1px solid var(--divider-color);
        }

        #support {
          padding-bottom: 24px;
        }

        #actions {
          display: flex;
          justify-content: flex-end;
          padding: 8px 16px;
          background: #f5f5f5;
          border-bottom: 1px solid var(--divider-color);
        }

        #table {
          display: flex;
          flex-direction: column;
          overflow: auto;
          position: relative;
          min-height: 300px;
        }

        #scroller {
          position: absolute;
          display: flex;
          flex-direction: column;
          min-width: 100%;
        }

        #head {
          display: flex;
          position: absolute;
          top: 0;
          width: 100%;
          align-items: center;
          background: #f5f5f5;
          border-bottom: 1px solid var(--divider-color);
        }

        #head > * {
          color: rgba(0, 0, 0, 0.64);
          font-size: 12px;
          font-weight: 500;
        }

        .checkbox {
          display: flex;
          justify-content: center;
          width: 64px;
        }

        .preview {
          width: 64px;
          position: relative;
        }

        .link {
          width: 24px;
        }

        .name {
          width: 200px;
        }

        .size {
          width: 60px;
        }

        .type {
          width: 80px;
        }

        .dimension {
          width: 80px;
        }

        .date {
          width: 70px;
        }

        .checkbox,
        .preview {
          padding: 8px 0;
        }

        .name,
        .size,
        .type,
        .date {
          padding: 8px 24px;
        }

        #list {
          margin-top: 34px;
        }

        #no-items {
          display: flex;
          color: rgba(0, 0, 0, 0.64);
          font-size: 14px;
          padding: 16px;
        }

        ht-spinner {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        #delete[disabled] {
          color: #ccc;
        }

        #upload[disabled] {
          background: #ccc;
        }

        [hidden] {
          display: none !important;
        }

        @media (max-width: 600px) {
          :host {
            padding: 0;
          }
        }
      `
    ];
  }

  render() {
    const { items, selected, loading, loadingText } = this;
    return html`
      <iron-iconset-svg size="24" name="ht-storage-icons">
          <svg>
              <defs>
                <g id="file-upload"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"></path></g>
                <g id="delete"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></g>
              </defs>
          </svg>
      </iron-iconset-svg>
      <div id="support">
        <strong>Поддерживаются</strong>: .svg .webp .png .jpg .gif .mp4 .webm .flv .mov .ogv .3gp .3g2 .wmv .mpeg .mkv .avi | < 10MB
      </div>
      <div id="container">
        <div id="actions">
          <paper-button id="delete" ?disabled="${
            loading ? true : false
          }" @click="${this._deleteSelected}" ?hidden="${
      selected.length > 0 ? false : true
    }"><iron-icon icon="ht-storage-icons:delete"></iron-icon>Удалить</paper-button>
          <paper-button id="upload" raised ?disabled=${
            loading ? true : false
          } @click="${
      this._openUploadWidget
    }"><iron-icon icon="ht-storage-icons:file-upload"></iron-icon>Загрузить</paper-button>
        </div>
        <div id="table">
          <div id="scroller">
            <div id="head">
              <div class="checkbox">
                <paper-checkbox noink @click="${e => {
                  this._toggleSelectAll(e);
                }}"></paper-checkbox>
              </div>
              <div class="preview"></div>
              <div class="link"></div>
              <div class="name">Имя файла</div>
              <div class="size">Размер</div>
              <div class="type">Тип</div>
              <div class="dimension">Размерность</div>
              <div class="date">Дата</div>
            </div>
              <div id="list">
                <div id="no-items" ?hidden="${
                  items.length === 0 && !loading ? false : true
                }">
                Нет файлов
              </div>
                ${repeat(
                  items,
                  item => html`
              <ht-storage-item .data="${item}" @click="${
                    this.updateSelected
                  }"></ht-storage-item>
          `
                )}
              </div>
          </div>
        </div>
        <ht-spinner text="${loadingText}" ?hidden="${!loading}"></ht-spinner>
      </div>
  `;
  }

  static get properties() {
    return {
      items: { type: Array },
      selected: { type: Array },
      loading: { type: Boolean },
      loadingText: { type: String }
    };
  }

  constructor() {
    super();
    this.items = [];
    this.selected = [];
    this.loading = false;
    this.loadingText = "";
  }

  _openUploadWidget() {
    let uid = firebase.auth().currentUser.uid;
    let widget = cloudinary.openUploadWidget(
      {
        cloudName: window.appConfig.cloudinary.cloudName,
        apiKey: window.appConfig.cloudinary.apiKey,
        uploadSignature: this._getUploadSignature,
        showAdvancedOptions: false,
        cropping: false,
        sources: ["local", "url"],
        use_filename: true,
        folder: `uploads/${uid}/`,
        upload_preset: "uploads",
        styles: {
          palette: {
            window: "#FFFFFF",
            windowBorder: "#A7A7A7",
            tabIcon: "#414549",
            menuIcons: "#414549",
            textDark: "#414549",
            textLight: "#FFFFFF",
            link: "#7BAB44",
            action: "#7BAB44",
            inactiveTabIcon: "#414549",
            error: "#F44235",
            inProgress: "#7BAB44",
            complete: "#20B832",
            sourceBg: "#F5F5F5"
          },
          fonts: {
            "'Roboto', normal": "https://fonts.googleapis.com/css?family=Roboto"
          }
        }
      },
      (error, result) => {
        if (error) {
          widget.close();
          this._showToast({
            text: "Возникла ошибка при обработке файлов"
          });
        }
        if (result && result.data && result.data.event === "queues-end") {
          widget.close();
          this.updateList();
        }
      }
    );
  }

  async _getUploadSignature(callback, params_to_sign) {
    try {
      let idToken = await firebase.auth().currentUser.getIdToken();

      let functionOptions = {
        name: "httpsUploadsGetSignatureForUserFileUpload",
        projectId:
          window.appConfig.projectEnv === "prod"
            ? "myaccount-01-ht"
            : "myaccount-01-ht-dev",
        options: {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json"
          }),
          body: JSON.stringify({
            idToken: idToken,
            cloudinaryParams: params_to_sign
          })
        }
      };
      // callTestHTTPFunction;
      let signature = await callFirebaseHTTPFunction(functionOptions);
      callback(signature);
    } catch (err) {
      console.log(err.message);
      this._showToast({ text: "Ошибка формирования подписи" });
    }
  }

  _toggleSelectAll(e) {
    let checked = !e.target.checked;
    let items = [];
    let elems = this.shadowRoot.querySelectorAll("ht-storage-item");
    elems.forEach(elem => {
      elem.selected = checked;
      if (checked) items.push(elem);
    });
    this.selected = items;
  }

  _unselectAll() {
    let elems = this.shadowRoot.querySelectorAll("ht-storage-item");
    elems.forEach(elem => {
      if (elem.selected) elem.selected = false;
    });
  }

  _resetToggle() {
    let checkbox = this.shadowRoot.querySelector("paper-checkbox");
    if (checkbox.checked) checkbox.click();
    this.selected = [];
  }

  updateSelected() {
    let items = [];
    let elems = this.shadowRoot.querySelectorAll("ht-storage-item");
    elems.forEach(elem => {
      if (elem.selected) items.push(elem);
    });
    this.selected = items;
  }

  async _deleteSelected() {
    try {
      this.loadingText = "Идет удаление файлов";
      this.loading = true;
      let idToken = await firebase.auth().currentUser.getIdToken();
      let items = [];
      this.selected.forEach(item => {
        items.push({
          public_id: item.data.public_id,
          resource_type: item.data.resource_type
        });
      });
      let functionOptions = {
        name: "httpsUploadsDeleteFiles",
        projectId:
          window.appConfig.projectEnv === "prod"
            ? "myaccount-01-ht"
            : "myaccount-01-ht-dev",
        options: {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json"
          }),
          body: JSON.stringify({
            idToken: idToken,
            items: items
          })
        }
      };
      // callTestHTTPFunction;
      await callFirebaseHTTPFunction(functionOptions);
      this.loading = false;
      this.updateList();
    } catch (err) {
      console.log("_deleteSelected: ", err);
    }
  }

  _showToast(options) {
    this.dispatchEvent(
      new CustomEvent("show-toast", {
        bubbles: true,
        composed: true,
        detail: options
      })
    );
  }

  async updateList() {
    try {
      this._unselectAll();
      this.loadingText = "Обновление списка файлов";
      this.loading = true;
      let idToken = await firebase.auth().currentUser.getIdToken();
      let functionOptions = {
        name: "httpsUploadsGetFileList",
        projectId:
          window.appConfig.projectEnv === "prod"
            ? "myaccount-01-ht"
            : "myaccount-01-ht-dev",
        options: {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json"
          }),
          body: JSON.stringify({
            idToken: idToken
          })
        }
      };
      // callTestHTTPFunction;
      let items = await callFirebaseHTTPFunction(functionOptions);
      this.items = items;
      this._resetToggle();
      this.loading = false;
    } catch (err) {
      console.log("UpdateList: ", err);
    }
  }

  getSelectedItems() {
    let sources = [];
    this.selected.forEach(item => {
      sources.push(item.data);
    });
    return sources;
  }
}

customElements.define("ht-storage", HTStorage);
