"use strict";
import { LitElement, html, css } from "lit-element";
import "@polymer/paper-checkbox/paper-checkbox.js";
import "@polymer/iron-iconset-svg";
import "@polymer/iron-icon";

import { stylesBasicWebcomponents } from "@01ht/ht-theme/styles";

class HTStorageItem extends LitElement {
  static get styles() {
    return [
      stylesBasicWebcomponents,
      css`
        a {
          color: var(--secondary-text-color);
        }

        #container {
          display: flex;
          align-items: center;
          height: 64px;
        }

        #container > div {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
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

        .preview img {
          display: block;
          width: auto;
          max-width: 48px;
          height: auto;
          max-height: 64px;
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
      `
    ];
  }

  render() {
    const { data, selected } = this;
    return html`
      <iron-iconset-svg size="24" name="ht-storage-item-icons">
          <svg>
              <defs>
                <g id="link"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"></path></g>
              </defs>
          </svg>
      </iron-iconset-svg>
      <div id="container">
        <div class="checkbox">
            <paper-checkbox noink ?checked="${selected}" @checked-changed="${e => {
      this._onChange(e);
    }}"></paper-checkbox>
        </div>
        <div class="preview"><img src="${window.cloudinaryURL}/${
      data.resource_type
    }/upload/c_scale,h_128,q_auto/v${data.version}/${data.public_id}.jpg"></div>
          <div class="link"><a target="_blank" href="${window.cloudinaryURL}/${
      data.resource_type
    }/upload/v${data.version}/${data.public_id}.${data.format}">
        <iron-icon icon="ht-storage-item-icons:link"></iron-icon>
        </a></div>
            <div class="name" title="${data.name}">${data.secure_url.substr(
      data.secure_url.lastIndexOf("/") + 1
    )}</div>
        <div class="size">${this._sizeFormat(data.bytes, true)}</div>
        <div class="type">${data.resource_type}</div>
        <div class="dimension">${data.width} x ${data.height}</div>
        <div class="date">${new Date(
          data.created_at
        ).toLocaleDateString()}</div>
      </div>
  `;
  }

  static get properties() {
    return {
      data: { type: Object },
      selected: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.data = {};
    this.selected = false;
  }

  shouldUpdate(changedProperties) {
    if (changedProperties.has("data")) {
      if (this.data === undefined || this.data.public_id === undefined)
        return false;
    }
    return true;
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
}

customElements.define("ht-storage-item", HTStorageItem);
