"use strict";
import { LitElement, html } from "@polymer/lit-element";
import { repeat } from "lit-html/lib/repeat.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/paper-button";
import "@polymer/iron-iconset-svg";
import "@polymer/iron-icon";
import "@polymer/paper-styles/default-theme.js";
import "@polymer/paper-spinner/paper-spinner.js";
import "ht-storage/ht-storage-item.js";

class HTStorage extends LitElement {
  render({ items, selected, loading, loadingText }) {
    return html`
      <style>
        :host {
          display: block;
          box-sizing:border-box;
          position:relative;
        }

        paper-button {
          background: var(--accent-color);
          color: #fff;
          font-weight: 500;
          padding: 8px 16px;
          height:36px;
        }

        paper-button#delete {
          color: var(--fail-color);
          background:none;
        }

        iron-icon {
          margin-right: 4px;
        }

        #container {
          display:flex;
          flex-direction:column;
        }

        #actions {
          display:flex;
          justify-content:flex-end;
          padding:8px 16px;
          background: #f5f5f5;
          border-bottom: 1px solid var(--divider-color);
        }

        #table {
          display:flex;
          flex-direction:column;
          overflow:auto;
          position: relative;
          min-height:300px;
        }

        #scroller {
          position:absolute;
          display:flex;
          flex-direction: column;
          min-width: 100%;
        }

        #head {
          display:flex;
          position:absolute;
          top:0;
          width:100%;
          align-items:center;
          background: #f5f5f5;
          border-bottom: 1px solid var(--divider-color);
        }

        #head > * {
          color: rgba(0,0,0,0.64);
          font-size: 12px;
          font-weight: 500;
        }

        .checkbox {
          display:flex;
          justify-content: center;
          width:64px;
        }

        .preview {
          width:84px;
          position:relative;
        }

        .preview img {
          display:block;
          width:auto;
          max-width:64px;
          height:32px;
        }

        .name {
          width:200px;
        }

        .size {
          width: 60px;
        }

        .type {
          width: 70px;
        }

        .date {
          width: 70px;
        }

        .checkbox, .preview {
          padding: 8px 0;
        }

        .name, .size, .type, .date {
            padding: 8px 24px;
        }

        #list {
          margin-top: 34px;
        }

        #no-items {
          display: flex;
          color: rgba(0,0,0,0.64);
          font-size: 14px;
          padding:16px;
        }

        #loading {
          position:absolute;
          top:0;
          right:0;
          left:0;
          bottom:0;
          display:flex;
          justify-content: center;
          align-items:center;
          background: rgba(0, 0, 0, 0.5);
          z-index:1;
        }

        #loading-card {
          background: #fff;
          padding:16px;
          display:flex;
          justify-content: center;
          align-items:center;
          border-radius:3px;
        }

        #loading-text {
          font-size: 14px;
          margin-left: 8px;
          font-weight: 400;
          color:var(--secondary-text-color);
        }

        paper-spinner {
          width: 24px;
          height: 24px;
        }

        [hidden] {
          display:none !important;
        }

        @media (max-width:600px) {
          :host {
            padding:0;
          }
        }
      </style>
      <iron-iconset-svg size="24" name="ht-storage-icons">
          <svg>
              <defs>
                <g id="file-upload"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"></path></g>
                <g id="delete"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></g>
              </defs>
          </svg>
      </iron-iconset-svg>
      <div id="container">
        <div id="loading" hidden?=${!loading}>
          <div id="loading-card">
            <paper-spinner active></paper-spinner>
            <div id="loading-text">${loadingText}</div>
          </div>
        </div>
        <div id="actions">
          <paper-button id="delete" on-click=${e => {
            this._deleteSelected();
          }} hidden?=${
      this.selected.length > 0 ? false : true
    }><iron-icon icon="ht-storage-icons:delete"></iron-icon>Удалить</paper-button>
          <paper-button raised on-click=${e => {
            this._openSelector();
          }}><iron-icon icon="ht-storage-icons:file-upload"></iron-icon>Загрузить файл</paper-button>
          <input type="file" multiple accept="image/*" on-change=${e => {
            this._inputChanged();
          }} hidden>
        </div>
        <div id="table">
          <div id="scroller">
            <div id="head">
              <div class="checkbox">
                <paper-checkbox noink onclick="${e => {
                  this._toggleSelectAll(e);
                }}"></paper-checkbox>
              </div>
              <div class="preview"></div>
              <div class="name">Название</div>
              <div class="size">Размер</div>
              <div class="type">Тип</div>
              <div class="date">Дата</div>
            </div>
              <div id="list">
                <div id="no-items" hidden?=${items.length === 0 ? false : true}>
                Нет файлов
              </div>
                ${repeat(
                  items,
                  item => html`
              <ht-storage-item data=${item} on-click=${e => {
                    this.updateSelected();
                  }}></ht-storage-item>
          `
                )}
              </div>
          </div>
        </div>
      </div>
  `;
  }

  static get is() {
    return "ht-storage";
  }

  static get properties() {
    return {
      items: Array,
      selected: Array,
      loading: Boolean,
      loadingText: String
    };
  }

  constructor() {
    super();
    this.items = [];
    this.selected = [];
    this.loading = false;
    this.loadingText = "";
  }

  ready() {
    super.ready();
    this.updateList();
  }

  get input() {
    return this.shadowRoot.querySelector("input[type=file]");
  }

  _openSelector() {
    this.input.click();
  }

  _toggleSelectAll(e) {
    let checked = e.target.checked;
    let items = [];
    let elems = this.shadowRoot.querySelectorAll("ht-storage-item");
    elems.forEach(elem => {
      elem.selected = checked;
      if (checked) items.push(elem);
    });
    this.selected = items;
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
      let promises = [];
      this.selected.forEach(item => {
        promises.push(item.delete());
      });
      await Promise.all(promises);
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

  _inputChanged(e) {
    let files = this.input.files;
    if (files === undefined) return;
    let temp = [];
    for (let file of files) {
      temp.push(file);
      if (file.type.split("/")[0] !== "image") {
        this._showToast({ text: "Загружать можно только изображения" });
        return;
      }
    }
    this._uploadFiles(temp);
  }

  async updateList() {
    try {
      this.loadingText = "Обновление списка файлов";
      this.loading = true;
      let items = [];
      let snapshot = await firebase
        .firestore()
        .collection("uploads")
        .where("userId", "==", firebase.auth().currentUser.uid)
        .orderBy("created", "desc")
        .get();
      snapshot.forEach(function(doc) {
        let data = doc.data();
        data.selected = false;
        items.push(data);
      });
      this.items = items;
      this._resetToggle();
      this.loading = false;
    } catch (err) {
      console.log("UpdateList: ", error);
    }
  }

  async _checkUploadComplete(fullPath) {
    try {
      let unsubscription;
      let promise = new Promise((resolve, reject) => {
        unsubscription = firebase
          .firestore()
          .collection("uploads")
          .where("fullPath", "==", fullPath)
          .onSnapshot(snapshot => {
            if (snapshot.exists && snapshot.data() !== null) {
              resolve();
            } else {
              snapshot.docChanges.forEach(change => {
                if (change.type === "added") {
                  let doc = change.doc.data();
                  if (doc.fullPath == fullPath) resolve();
                }
                // if (change.type === "modified") {
                //   console.log("Modified city: ", change.doc.data());
                // }
                // if (change.type === "removed") {
                //   console.log("Removed city: ", change.doc.data());
                // }
              });
            }
          });
      });
      await promise;
      unsubscription();
    } catch (err) {
      console.log(err.message);
      this._showToast({ text: "_checkUploadComplete error" });
    }
  }

  async _isUniqueName(fileName) {
    try {
      let snapshot = await firebase
        .firestore()
        .collection("uploads")
        .where(
          "fullPath",
          "==",
          `uploads/${firebase.auth().currentUser.uid}/${fileName}`
        )
        .get();
      let items = [];
      snapshot.forEach(function(doc) {
        let data = doc.data();
        items.push(data);
      });
      if (items.length === 0) return true;
      return false;
    } catch (err) {
      console.log(err.message);
      this._showToast({ text: "_numberOfNameDuplicates" });
    }
  }

  async _uploadFile(file) {
    try {
      let fileName = file.name;
      let copyNumber = 1;
      // Make new File because impossible change file name in input
      while ((await this._isUniqueName(fileName)) === false) {
        fileName = file.name;
        let fileArr = fileName.split(".");
        let fileFormat = fileArr[fileArr.length - 1];
        fileArr.splice(fileArr.length - 1, 1);
        fileName = fileArr.join(".") + ` (${copyNumber})` + `.${fileFormat}`;
        copyNumber++;
      }
      let blob = file.slice(0, file.size, file.type);
      file = new File([blob], fileName, { type: file.type });
      let userId = firebase.auth().currentUser.uid;
      var storageRef = firebase.storage().ref();
      var ref = storageRef.child(`uploads/${userId}/${fileName}`);
      let snapshot = await ref.put(file);
      await this._checkUploadComplete(snapshot.metadata.fullPath);
    } catch (err) {
      console.log(err.message);
      this._showToast({ text: "_uploadFile" });
    }
  }

  async _uploadFiles(files) {
    try {
      this.loading = true;
      this.loadingText = "Идет обработка";
      let uploads = [];
      files.forEach(file => {
        uploads.push(this._uploadFile(file));
      });
      await Promise.all(uploads);
      this.loading = false;
      this.input.value = "";
      this.updateList();
    } catch (err) {
      console.log(err.message);
      this._showToast({ text: "Возникла ошибка при обработке файлов" });
    }
  }
}

customElements.define(HTStorage.is, HTStorage);
