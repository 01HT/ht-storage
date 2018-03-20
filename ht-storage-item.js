"use strict";
import { LitElement, html } from "@polymer/lit-element";
import { repeat } from "lit-html/lib/repeat.js";
import "@polymer/paper-checkbox/paper-checkbox.js";
import "@polymer/paper-styles/default-theme.js";

class HTStorageItem extends LitElement {
  render({ data, selected }) {
    return html`
      <style>
        :host {
          display: block;
          box-sizing:border-box;
          position:relative;
        }

        #container {
            display:flex;
            align-items: center;
        }

        #container > div {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
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
      </style>
      <div id="container">
        <div class="checkbox">
            <paper-checkbox noink checked?=${selected} onclick=${e => {
      this._onChange(e);
    }}></paper-checkbox>
        </div>
        <div class="preview"><img src=${data.thumbURL}></div>
        <div class="name" title="${data.name}">${data.name}</div>
        <div class="size">${
          data.size ? this._sizeFormat(data.size, true) : ""
        }</div>
        <div class="type">${data.type}</div>
        <div class="date">${
          data.created ? data.created.toLocaleDateString() : ""
        }</div>
      </div>
  `;
  }

  static get is() {
    return "ht-storage-item";
  }

  static get properties() {
    return {
      data: Object,
      selected: Boolean
    };
  }

  constructor() {
    super();
    this.data = {};
    this.selected = false;
  }

  ready() {
    super.ready();
  }

  _onChange(e) {
    this.selected = e.target.checked;
  }

  _sizeFormat(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
      return bytes + " B";
    }
    var units = si
      ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
      : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
    var u = -1;
    do {
      bytes /= thresh;
      ++u;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1) + " " + units[u];
  }

  async delete() {
    try {
      var storageRef = firebase.storage().ref();
      var ref = storageRef.child(
        `uploads/${this.data.userId}/${this.data.name}`
      );
      await ref.delete();
      await this._checkDeleteComplete();
    } catch (err) {
      console.log(err.message);
    }
  }

  async _checkDeleteComplete() {
    try {
      let fullPath = this.data.fullPath;
      let unsubscription;
      let promise = new Promise((resolve, reject) => {
        unsubscription = firebase
          .firestore()
          .collection("uploads")
          .where("fullPath", "==", fullPath)
          .onSnapshot(snapshot => {
            if (!snapshot.exists) {
              resolve();
            } else {
              snapshot.docChanges.forEach(change => {
                if (change.type === "removed") {
                  let doc = change.doc.data();
                  if (doc.fullPath == fullPath) resolve();
                }
              });
            }
          });
      });
      await promise;
      unsubscription();
    } catch (err) {
      console.log(err.message);
    }
  }
}

customElements.define(HTStorageItem.is, HTStorageItem);
