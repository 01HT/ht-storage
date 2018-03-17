"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@polymer/paper-input/paper-input.js";
import "@polymer/paper-button";
import "@polymer/iron-iconset-svg";
import "@polymer/iron-icon";
import "@polymer/paper-styles/default-theme.js";
import "@polymer/paper-spinner/paper-spinner.js";

class HTStorage extends LitElement {
  render({ items, loading, loadingText }) {
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
          font-weight: 400;
          padding: 8px 16px;
          height:36px;
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
          align-items:center;
          height:36px;
          background: #f5f5f5;
          border-bottom: 1px solid var(--divider-color);
        }

        #head > * {
          padding: 0 24px;
          color: rgba(0,0,0,0.64);
          font-size: 12px;
          font-weight: 500;
        }

        .name {
          min-width:200px;
          max-width:200px;
        }

        .size {
          min-width:60px;
          max-width:60px;
        }

        .type {
          min-width:100px;
          max-width:100px;
        }

        .date {
          min-width:100px;
          max-width:100px;
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
          width: 25px;
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
          <paper-button raised on-click=${e => {
            this._openSelector();
          }}><iron-icon icon="ht-storage-icons:file-upload"></iron-icon>Загрузить файл</paper-button>
          <input type="file" on-change=${e => {
            this._inputChanged();
          }} hidden>
        </div>
        <div id="table">
          <div id="scroller">
            <div id="head">
              <div class="name">Название</div>
              <div class="size">Размер</div>
              <div class="type">Тип</div>
              <div class="date">Дата</div>
            </div>
            <div id="body">
              <div id="no-items" hidden?=${items.length === 0 ? false : true}>
                Нет файлов
              </div>
              <div id="list">
                
              </div>
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
      loading: Boolean,
      loadingText: String
    };
  }

  constructor() {
    super();
    this.items = [];
    this.loading = false;
    this.loadingText = "";
  }

  ready() {
    super.ready();
    this._updateList();
  }

  get input() {
    return this.shadowRoot.querySelector("input[type=file]");
  }

  _openSelector() {
    this.input.click();
  }

  _inputChanged(e) {
    let file = this.input.files[0];
    if (file === undefined) return;
    if (file.type.split("/")[0] !== "image") {
      console.error("unsupported file type :( ");
      return;
    }
    this._uploadFile(file);
  }

  _updateList() {
    this.loadingText = "Загрузка списка файлов";
    this.loading = true;
    let env = this;
    firebase
      .firestore()
      .collection("uploads")
      .where("userId", "==", firebase.auth().currentUser.uid)
      .get()
      .then(function(querySnapshot) {
        let items = [];
        querySnapshot.forEach(function(doc) {
          items.push(doc.data());
        });
        env.items = items;
        env.loading = false;
        console.log(env.items);
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
  }

  _listen(fileName) {
    let env = this;
    this.loading = true;
    this.loadingText = "Идет обработка файла";
    let unsubscribe = firebase
      .firestore()
      .collection("uploads")
      .where("userId", "==", firebase.auth().currentUser.uid)
      .onSnapshot(function(snapshot) {
        snapshot.docChanges.forEach(function(change) {
          if (change.type === "added") {
            let doc = change.doc.data();
            if (doc.name == fileName) {
              console.log(doc.name);
              env.loading = false;
              unsubscribe();
              env._updateList();
            }
          }
          // if (change.type === "modified") {
          //   console.log("Modified city: ", change.doc.data());
          // }
          // if (change.type === "removed") {
          //   console.log("Removed city: ", change.doc.data());
          // }
        });
        // if (doc.exists && doc.data().created !== null) {
        //   console.log("New record!");
        // }
      });
  }

  _uploadFile(file) {
    let fileName = file.name;
    let userId = firebase.auth().currentUser.uid;
    var storageRef = firebase.storage().ref();
    var ref = storageRef.child(`uploads/${userId}/${fileName}`);

    this._listen(fileName);

    setTimeout(() => {
      ref.put(file).then(function(snapshot) {
        firebase
          .firestore()
          .collection("uploads")
          .add({
            userId: firebase.auth().currentUser.uid,
            URL: snapshot.downloadURL,
            created: firebase.firestore.FieldValue.serverTimestamp(),
            name: file.name,
            size: snapshot.totalBytes,
            type: file.type
          })
          .then(_ => {
            console.log("Complete!");
          });
      });
    }, 5000);
  }
}

customElements.define(HTStorage.is, HTStorage);
