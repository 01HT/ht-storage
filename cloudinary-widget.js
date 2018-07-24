!(function() {
  "use strict";
  var e = self.console,
    n = Object.freeze({ NONE: 0, ERROR: 1, WARN: 2, INFO: 3, LOG: 4 }),
    t = ["error", "warn", "info", "log"],
    i = window.Rollbar && window.Rollbar.options.enabled,
    o = ["error"],
    r =
      void 0 !== e &&
      void 0 !== e.log &&
      void 0 !== e.error &&
      void 0 !== e.debug &&
      void 0 !== e.warn &&
      "function" == typeof Function.prototype.apply,
    a = void 0,
    l = void 0,
    u = function(n, t, i, o) {
      return e[t]
        ? i ? e[t](i) : e[t]()
        : n.log("----------- " + (i || o) + " ----------- ");
    },
    d = function(n) {
      var l = n.level,
        d = {
          setLevel: function(e) {
            return (l = e), d;
          },
          getLevel: function() {
            return l || a;
          }
        };
      return (
        t.forEach(function(n) {
          d[n] = function() {
            for (var a = arguments.length, l = Array(a), u = 0; u < a; u++)
              l[u] = arguments[u];
            return (function(n, a, l) {
              if (r) {
                var u,
                  d = t.indexOf(a),
                  c = n.getLevel();
                return (
                  ~d && c >= d + 1 && e[a].apply(e, l),
                  i && ~o.indexOf(a) && (u = window.Rollbar)[a].apply(u, l),
                  n
                );
              }
            })(d, n, l);
          };
        }),
        (d.groupCollapsed = function(e) {
          return u(d, "groupCollapsed", e, "GROUP START");
        }),
        (d.group = function(e) {
          return u(d, "group", e, "GROUP START");
        }),
        (d.groupEnd = function() {
          return u(d, "groupEnd", null, "GROUP END");
        }),
        (d.debug = d.log),
        d
      );
    },
    c = function() {
      var e =
        arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      e.level = e.level || n.NONE;
      var t = e.newInstance || !l ? d(e) : l;
      return l || e.newInstance || (l = t), t;
    },
    s = {
      LOCAL: "local",
      URL: "url",
      CAMERA: "camera",
      IMAGE_SEARCH: "image_search",
      DROPBOX: "dropbox",
      FACEBOOK: "facebook",
      INSTAGRAM: "instagram"
    },
    f = "upload-finish",
    p = "widget-view-change",
    g = "uw_init",
    v = "uw_mini",
    h = "uw_config",
    m = "uw_prepare",
    y = "uw_prebatch",
    w = "uw_event",
    b = "uw_show",
    x = "uw_hide",
    E = "uw_tags",
    O = "uw_file",
    C = function(e, n, t, i) {
      var o =
          arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : null,
        r = (o = o || self).document.createElement(e);
      if (((n = n || {}), t && (n.class = t), n)) {
        var a = n;
        Object.keys(a).forEach(function(e) {
          return r.setAttribute(e, a[e]);
        });
      }
      if (i) {
        var l = i;
        Object.keys(l).forEach(function(e) {
          return (r.dataset[e] = l[e]);
        });
      }
      return r;
    },
    k = function(e) {
      var n =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
      return (
        (n = n || self), "string" == typeof e ? n.document.querySelector(e) : e
      );
    },
    R = function(e) {
      e.parentNode && e.parentNode.removeChild(e);
    },
    S = function(e, n) {
      Object.keys(n).forEach(function(t) {
        e.style[t] = n[t];
      });
    },
    N = function(e) {
      S(e, { display: "none" });
    },
    _ = "FileReader" in self && "FileList" in self && "Blob" in self,
    L = function(e) {
      return "string" == typeof e;
    },
    W = function(e) {
      return "function" == typeof e;
    },
    M = function(e, n) {
      var t = null;
      if (e.closest) t = e.closest(n);
      else {
        var i = self.document.querySelectorAll(n);
        i &&
          i.length &&
          (t = Array.prototype.find.call(i, function(n) {
            return (
              (t = e),
              !!(
                n.compareDocumentPosition(t) &
                Node.DOCUMENT_POSITION_CONTAINED_BY
              )
            );
            var t;
          }));
      }
      return t;
    },
    T = c(),
    I = function(e, n) {
      var t,
        i,
        o = /cloudinary\.com/;
      T.log("[all.comms]: using pm domain regex =  " + o.toString());
      var r = function(e, t) {
          n.widgetCallback && n.widgetCallback(t, e);
        },
        a = function(e) {
          var n = void 0;
          try {
            L(e) && (n = JSON.parse(e));
          } catch (n) {
            T.log("[all.comms]: failed to deserialize message: ", e);
          }
          return n;
        },
        l = function(e, t) {
          var i =
            arguments.length > 2 && void 0 !== arguments[2] && arguments[2]
              ? { type: e, data: t }
              : (function(e, n) {
                  return JSON.stringify({ type: e, data: n });
                })(e, t);
          n.postMessage(i);
        },
        u = (((t = {})[p] = function(e) {
          n.handleWidgetViewTypeChange(e.info);
        }),
        (t[f] = function(t) {
          if (
            (T.log("[all.comms]: received uploaded file data - ", t),
            t.info.failed)
          )
            e.inlineMode && r(null, t.info),
              n.triggerEvent("cloudinarywidgetfileuploadfail", [t.info]);
          else {
            var i = t.info.uploadInfo,
              o = { event: "success", info: i };
            n.processUploadResult(i),
              r(o),
              n.triggerEvent("cloudinarywidgetfileuploadsuccess", o);
          }
        }),
        t),
        d = (((i = {})[w] = function(e) {
          e.event && u[e.event] ? u[e.event](e) : r({ uw_event: !0, data: e });
        }),
        (i[x] = function() {
          n.hideWidget();
          var e = {
            event: "close",
            info: { message: "user closed the widget" }
          };
          r(e), n.triggerEvent("cloudinarywidgetclosed", e);
        }),
        (i[m] = function(n) {
          var t = function(e) {
              return l(m, e);
            },
            i = e.prepareUploadParams || e.uploadSignature;
          "function" == typeof i
            ? i(function(e) {
                T.log("[all.comms]: received prepared data from client: ", e);
                var n = [].concat(e).map(function(e) {
                  return "string" == typeof e ? { signature: e } : e;
                });
                t(n);
              }, n.request)
            : "string" == typeof e.uploadSignature &&
              t([{ signature: e.uploadSignature }]);
        }),
        (i[y] = function(n) {
          if ("function" != typeof e.preBatch)
            throw new Error("UploadWidget - preBatch handler not found!");
          e.preBatch(function(e) {
            T.log("[all.comms]: received pre-batch data from client: ", e),
              l(y, e);
          }, n.request);
        }),
        (i[E] = function(n) {
          e.getTags(function(e) {
            T.log("[all.comms]: received tags from client: ", e),
              l(E, { tags: e });
          }, n.prefix);
        }),
        i);
      return (
        window.addEventListener("message", function(n) {
          if (n.origin.match(o)) {
            var t = a(n.data),
              i = !1;
            t &&
              t.widgetId &&
              t.widgetId === e.widgetId &&
              (T.log(
                "[all.comms]: received message from widget: " + e.widgetId,
                t
              ),
              d[t.type] && ((i = !0), d[t.type](t))),
              i ||
                T.log(
                  "[all.comms]: received invalid message, invalid widget ID or invalid type! ",
                  n.data
                );
          }
        }),
        { sendMessage: l }
      );
    },
    P = 1,
    U = 2,
    j = 8,
    A = 500,
    F = 55,
    H = "right:35px",
    z = "(min-width: 767px)",
    q = 610,
    D = /(left|right)(?::([0-9a-z]*))?$/,
    V = function(e, n) {
      var t = { raw: H, side: null, offset: null },
        i = C(
          "iframe",
          { frameborder: "no", allow: "camera", width: "100%", height: "100%" },
          null,
          { test: "uw-iframe" }
        );
      S(i, { border: "none", background: "transparent" });
      var o = window.matchMedia(z),
        r = k(e.inlineContainer);
      r && S(r, { minHeight: q + "px", overflowX: "hidden" });
      var a = null,
        l = !1,
        u = "",
        d = !1,
        c = !1,
        s = !1,
        f = !1,
        p = void 0,
        g = function(e) {
          e.preventDefault();
        },
        v = function() {
          if (!r) {
            var n = s && f;
            p.body &&
              ((a = null === a ? p.body.style.overflow : a),
              (p.body.style.overflow = n ? "hidden" : a)),
              (function(e) {
                e
                  ? p.addEventListener("touchmove", g)
                  : p.removeEventListener("touchmove", g);
              })(n),
              (function(n) {
                if (!0 === e.controlVpMeta)
                  if (n) {
                    var t = k('head meta[name="viewport"]', self.top);
                    t ||
                      ((t = C(
                        "meta",
                        { name: "viewport" },
                        null,
                        null,
                        self.top
                      )),
                      p.head.appendChild(t)),
                      (t.content =
                        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no");
                  } else {
                    var i = k('head meta[name="viewport"]', self.top);
                    l && i ? (i.content = u) : i && p.head.removeChild(i);
                  }
              })(n);
          }
        },
        h = function() {
          d && c && (N(i), (s = !1), v());
        },
        m = function() {
          d && c && (S(i, { display: "block" }), (s = !0), v(), i.focus());
        },
        y = function() {
          var e;
          (e = i),
            (r || void 0 || document.body).appendChild(e),
            p.addEventListener("keyup", function(e) {
              27 === e.keyCode && h();
            });
        },
        w = function(n) {
          var o = Math.min(A, window.innerWidth) + "px";
          S(i, {
            width: n ? "100%" : o,
            bottom: n ? "0px" : "5px",
            height: F + "px",
            top: ""
          }),
            (function(n) {
              if (
                (e.queueViewPosition && e.queueViewPosition !== t.raw) ||
                !t.side ||
                !t.offset
              ) {
                t.raw = e.queueViewPosition || t.raw;
                var o = D.exec(t.raw);
                if (!o)
                  throw new Error(
                    "queueViewPosition param (" +
                      (e.queueViewPosition || "") +
                      ') is invalid. (valid ex: "right:35px")'
                  );
                (t.side = o[1]), (t.offset = o[2] || "0");
              }
              var r = void 0;
              (r = n
                ? { left: "0px", right: "0px" }
                : "left" === t.side
                  ? { left: t.offset || "", right: "" }
                  : { right: t.offset || "", left: "" }),
                S(i, r);
            })(n),
            (f = !1),
            v();
        },
        b = function() {
          S(
            i,
            r
              ? { height: q + "px", width: "100%" }
              : {
                  width: "100%",
                  height: "100%",
                  top: "0px",
                  left: "0px",
                  bottom: ""
                }
          ),
            (f = d),
            v();
        },
        x = function() {
          m(), b();
        },
        E = function(e) {
          w(!e.matches);
        },
        O = function(e) {
          switch ((o.removeListener(E), e.type)) {
            case P:
            case U:
              b();
              break;
            case j:
              w(!o.matches), o.addListener(E);
          }
        },
        R = function(n) {
          return i.contentWindow.postMessage(n, e.widgetHost);
        },
        _ = function() {
          return c;
        },
        L = function() {
          return d;
        },
        W = function() {
          h(), (d = !1);
        },
        M = function(e) {
          (d = !0), c && (x(), e && e.files && N(i));
        },
        T = function e() {
          i.removeEventListener("load", e),
            (c = !0),
            n({
              open: M,
              close: W,
              showWidget: m,
              hideWidget: h,
              isFrameReady: _,
              isWidgetOpen: L,
              postMessage: R,
              handleWidgetViewTypeChange: O
            }),
            x();
        };
      !(function() {
        p = (function() {
          var e = self.document;
          try {
            e = self.top.document;
          } catch (e) {}
          return e;
        })();
        var n = (function(e) {
            var n = [];
            return (
              e.debug && n.push("debug=true"),
              e.dev && n.push("dev=true"),
              e.cloudName && n.push("cloudName=" + e.cloudName),
              n.push(
                "pmHost=" + self.location.protocol + "//" + self.location.host
              ),
              n
            );
          })(e),
          t = e.widgetHost + "?" + n.join("&");
        i.setAttribute("src", t),
          N(i),
          S(i, {
            position: r ? null : "fixed",
            zIndex: r ? null : e.frameZIndex || "1000000"
          }),
          i.addEventListener("load", T),
          (function() {
            if (!0 === e.controlVpMeta) {
              var n = k('head meta[name="viewport"]', self.top);
              n && ((u = n.content), (l = !0));
            }
          })(),
          y();
      })();
    },
    B = "fetch" in self,
    G =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function(e) {
            return typeof e;
          }
        : function(e) {
            return e &&
              "function" == typeof Symbol &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? "symbol"
              : typeof e;
          },
    $ =
      Object.assign ||
      function(e) {
        for (var n = 1; n < arguments.length; n++) {
          var t = arguments[n];
          for (var i in t)
            Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
        }
        return e;
      },
    J = function(e) {
      var n =
          arguments.length > 1 && void 0 !== arguments[1]
            ? arguments[1]
            : "GET",
        t = arguments[2],
        i = arguments[3],
        o = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : {},
        r =
          t && "object" === (void 0 === t ? "undefined" : G(t))
            ? JSON.stringify(t)
            : t,
        a = B;
      return (a
        ? self.fetch(
            e,
            $(
              { method: n, body: r, headers: i ? new Headers(i) : void 0 },
              o.fetchOptions
            )
          )
        : new Promise(function(t, a) {
            var l = new XMLHttpRequest();
            l.open(n, e),
              o.responseType && (l.responseType = o.responseType),
              (l.onerror = function() {
                return a(l);
              }),
              (l.ontimeout = function() {
                return a(l);
              }),
              (l.onload = function() {
                return t(l);
              }),
              (function(e, n) {
                if (n) {
                  var t = n;
                  Object.keys(t).forEach(function(n) {
                    return e.setRequestHeader(n, t[n]);
                  });
                }
              })(l, i),
              l.send(r);
          })
      ).then(
        function(e, n, t) {
          var i = n.responseType,
            o = function(e) {
              return (t.response = e), t;
            };
          return !n.dontRead && e && t.ok
            ? i && t[i] ? t[i]().then(o) : t.json().then(o)
            : t;
        }.bind(null, a, o)
      );
    },
    K = c(),
    X = "cloudinary-button",
    Q = "cloudinary-thumbnails",
    Y = "cloudinary-thumbnail",
    Z = "cloudinary-delete",
    ee = function(e) {
      return e.fieldName || "image";
    },
    ne = function(e, n) {
      var t = n.form;
      return !t && e && (t = M(e, "form")), t;
    },
    te = function(e, n, t) {
      var i = ne(n, t);
      i &&
        (i = k(i)) &&
        (function(e, n, t) {
          var i = C("input", { type: "hidden", name: ee(t) }, null, {
            cloudinaryPublicId: e.public_id
          });
          i.value =
            [e.resource_type, e.type, e.path].join("/") + "#" + e.signature;
          try {
            i.dataset.cloudinary = JSON.stringify(e);
          } catch (e) {
            K.error(
              "[all.pageIntegrations]: failed to add info as serialized data attribute"
            );
          }
          n.appendChild(i);
        })(e, i, t);
    },
    ie = function(e, n, t, i, o, r) {
      e.addEventListener("click", function a(l) {
        var u =
          (function(e) {
            return e.deleteHost
              ? e.deleteHost
              : "https://api" +
                  (e.dev ? "-dev" : e.staging ? "-staging" : "") +
                  ".cloudinary.com";
          })(o) +
          "/v1_1/" +
          o.cloudName +
          "/delete_by_token";
        return (
          K.log(
            "[all.pageIntegrations]: \n        about to send delete request with token: " +
              i.delete_token +
              " to : " +
              u
          ),
          l.preventDefault(),
          J(
            u,
            "POST",
            { token: i.delete_token },
            { "Content-Type": "application/json" },
            { dontRead: !0 }
          )
            .then(function(l) {
              200 === l.status &&
                (K.log("[all.pageIntegrations]: successfully deleted file"),
                e.removeEventListener("click", a),
                (function(e, n, t, i) {
                  R(e);
                  var o = ne(n, i);
                  if (o) {
                    var r = o.querySelector(
                      'input[name="' +
                        ee(i) +
                        '"][data-cloudinary-public-id="' +
                        t.public_id +
                        '"]'
                    );
                    r && R(r);
                  }
                })(n, t, i, o),
                r.triggerEvent("cloudinarywidgetdeleted", i));
            })
            .catch(function(e) {
              K.warn(
                "[all.pageIntegrations]: failed to delete file with status: " +
                  e.status
              );
            })
        );
      });
    },
    oe = function(e, n, t, i) {
      if (!1 !== t.thumbnails && (t.thumbnails || n)) {
        var o = !0,
          r = k("." + Q);
        if (
          (r || ((o = !1), (r = C("ul", null, Q))),
          r.appendChild(
            (function(e, n, t, i) {
              var o = C("li", null, Y, { cloudinary: JSON.stringify(e) }),
                r = void 0;
              e.thumbnail_url
                ? (r = C("img", { src: e.thumbnail_url })).addEventListener(
                    "load",
                    function e() {
                      o.classList.add("active"),
                        r.removeEventListener("load", e);
                    }
                  )
                : ((r = C("span")).textContent = e.public_id);
              if ((o.appendChild(r), e.delete_token)) {
                var a = C("a", { href: "#" }, Z);
                (a.textContent = "x"), o.appendChild(a), ie(a, o, n, e, t, i);
              }
              return o;
            })(e, n, t, i)
          ),
          !o)
        ) {
          K.log("[all.pageIntegrations]: adding thumbnails list to dom");
          var a = t.thumbnails && k(t.thumbnails);
          a ? a.appendChild(r) : n && n.insertAdjacentElement("afterend", r);
        }
      }
    },
    re = function(e, n) {
      return 0 === n ? e : e.substr(0, 1).toUpperCase() + e.substr(1);
    },
    ae = function(e) {
      return Object.keys(e).reduce(function(n, t) {
        return (
          (n[
            t.indexOf("_") > 0
              ? (function(e) {
                  return e
                    .split("_")
                    .map(re)
                    .join("");
                })(t)
              : t
          ] =
            e[t]),
          n
        );
      }, {});
    },
    le = ["keepWidgetOpen", "stylesheet"],
    ue = Object.prototype.toString,
    de = function(e) {
      return le.forEach(function(n) {
        void 0 !== e[n] &&
          (function() {
            var e;
            (e = console).warn.apply(e, arguments);
          })(
            "Cloudinary.UploadWidget - '" +
              n +
              "' is no longer used in this version."
          );
      });
    },
    ce = function(e) {
      return ae((e = e || {}));
    },
    se = c(),
    fe = c(),
    pe = function(e, n) {
      var t = null,
        i = function(e) {
          var t = e.file,
            i = e.result,
            o = e.index,
            r = e.count;
          n.sendMessage(
            O,
            {
              lastModified: t.lastModified,
              lastModifiedDate: t.lastModifiedDate,
              name: t.name,
              size: t.size,
              type: t.type,
              file: i,
              index: o,
              count: r
            },
            !0
          );
        },
        o = function(n, o, r) {
          var a,
            l,
            u,
            d,
            c,
            s,
            f,
            p = void 0;
          return (
            !e.maxFileSize || (e.maxFileSize > 0 && n.size <= e.maxFileSize)
              ? (t ||
                  ((a = []),
                  (l = new FileReader()),
                  (u = null),
                  (d = function() {
                    u &&
                      u.readResolve({
                        file: u.file,
                        index: u.index,
                        count: u.count,
                        result: l.result
                      }),
                      c();
                  }),
                  (c = function() {
                    (u = null),
                      l.removeEventListener("load", d, !1),
                      l.removeEventListener("error", s, !1),
                      a.length && f(a.shift());
                  }),
                  (s = function() {
                    se.log("[utils.fileReader]: failed to read file", l.error),
                      u && u.readReject(l.error),
                      c();
                  }),
                  (f = function(e) {
                    (u = e),
                      l.addEventListener("load", d, !1),
                      l.addEventListener("error", s, !1),
                      l.readAsDataURL(e.file);
                  }),
                  (t = {
                    read: function(e) {
                      var n =
                          arguments.length > 1 && void 0 !== arguments[1]
                            ? arguments[1]
                            : 0,
                        t =
                          arguments.length > 2 && void 0 !== arguments[2]
                            ? arguments[2]
                            : 0;
                      return new Promise(function(i, o) {
                        var r = {
                          file: e,
                          index: n,
                          count: t,
                          readResolve: i,
                          readReject: o
                        };
                        1 !== l.readyState ? f(r) : a.push(r);
                      });
                    }
                  })),
                (p = t
                  .read(n, o, r)
                  .then(i)
                  .catch(function(e) {
                    fe.error(
                      "[global.all.uploadsHandler]: failed to send file data to widget for upload",
                      e,
                      n
                    );
                  })))
              : fe.log(
                  "[global.all.uploadsHandler]: provided file is larger than max file size configured",
                  n
                ),
            p
          );
        },
        r = function(e) {
          return Promise.race(
            Array.prototype.map.call(e, function(t, i) {
              var r,
                a = null;
              return (
                (r = t),
                _ && (r instanceof File || "[object File]" === r.toString())
                  ? (a = o(t, i, e.length))
                  : L(t)
                    ? n.sendMessage(O, { file: t, index: i, count: e.length })
                    : fe.warn(
                        "[global.all.uploadsHandler]: unknown type of object sent to upload",
                        t
                      ),
                a
              );
            })
          );
        };
      return {
        handleFiles: function(e) {
          return e && e.files ? r(e.files) : Promise.resolve();
        }
      };
    },
    ge = c(),
    ve = 0,
    he = function(e, n) {
      var t = (function(e, n) {
        if (((e = e || {}), "[object Object]" !== ue.call(e)))
          throw new Error(
            "[Cloudinary.UploadWidget]: widget options must be a valid Object"
          );
        var t = ce(e);
        return (
          (t.secure = t.secure || "https:" === document.location.protocol),
          (t.requirePrepareParams =
            !!t.prepareUploadParams || !!t.uploadSignature),
          (t.useTagsCallback = W(t.getTags)),
          (t.usePreBatchCallback = W(t.preBatch)),
          (t.inlineMode = !!t.inlineContainer),
          (t.fieldName = e.fieldName || (n && n.getAttribute("name")) || null),
          de(t),
          t
        );
      })(e, n);
      return (ve += 1), (t.widgetId = "widget_" + ve), t;
    },
    me = function(e, n, t) {
      if (
        ((t = (function(e, n) {
          var t = e || (n && n.element);
          if (t) {
            try {
              t = k(t);
            } catch (e) {
              throw new Error(
                "[Cloudinary.UploadWidget]: 'element' param must either be a valid HTMLElement or a selector string"
              );
            }
            if (!t || !t.nodeType)
              throw new Error(
                "[Cloudinary.UploadWidget]: 'element' param must resolve to a valid HTMLElement"
              );
          }
          return t;
        })(t, e)),
        e.inlineContainer && !k(e.inlineContainer))
      )
        throw new Error(
          "[Cloudinary.UploadWidget]: 'inlineContainer' param must either be a valid HTMLElement or a selector string"
        );
      var i = he(e, t);
      delete i.element;
      var o,
        r = void 0,
        a = void 0,
        l = void 0,
        u = function(e, n) {
          i.$ && i.$(t || i.form || document).trigger(e, n);
        },
        d = function(e) {
          return r
            ? r.then(e).catch(function(e) {
                return ge.error(
                  "Cloudinary.UploadWidget - encountered error ! ",
                  e
                );
              })
            : ge.error(
                "Cloudinary.UploadWidget - Widget frame API not ready yet!"
              );
        },
        c = function(e, n) {
          return d(function(t) {
            t.open(n),
              t.isFrameReady() &&
                (a.sendMessage(b, { source: e, options: n }, !0),
                l.handleFiles(n).then(function() {
                  setTimeout(function() {
                    t.showWidget();
                  }, 150);
                }));
          });
        };
      return (
        (o = (function() {
          var e = i.secure ? "https:" : "http:",
            n = void 0;
          if (!0 === i.dev) n = "//widget-dev.cloudinary.com/index.html";
          else {
            var t =
              "//widget" +
              (!0 === i.staging ? "-staging" : "") +
              ".cloudinary.com/v2.0/n/";
            n =
              i.widgetHost ||
              t + i.cloudName + "/" + i.widgetVersion + "/index.html";
          }
          return (n = 0 !== n.indexOf("http") ? e + n : n);
        })()),
        (r = (function(e) {
          return new Promise(V.bind(null, e));
        })($({}, i, { widgetHost: o }))).then(function(e) {
          (a = I(
            $({}, i, { widgetHost: o }),
            $(
              {
                triggerEvent: u,
                processUploadResult: function(e) {
                  return (function(e, n, t, i) {
                    te(e, n, t), oe(e, n, t, i);
                  })(e, t, i, { triggerEvent: u });
                },
                widgetCallback: n
              },
              e
            )
          )).sendMessage(g, $({}, i, { showOnStart: e.isWidgetOpen() })),
            (l = pe(i, a)),
            t &&
              (function(e, n, t) {
                var i = C("a", { href: "#" }, t.buttonClass || X);
                (i.innerHTML = t.buttonCaption || "Upload image"),
                  (e.style.display = "none"),
                  e.parentNode &&
                    e.parentNode.insertBefore(i, e.previousSibling),
                  i.addEventListener("click", function(e) {
                    return (
                      n(),
                      e.preventDefault && e.preventDefault(),
                      e.stopPropagation && e.stopPropagation(),
                      !1
                    );
                  });
              })(t, c, i);
        }),
        {
          open: function(e, n) {
            return c(e, n), this;
          },
          update: function(e) {
            var n = this;
            return (function(e) {
              return d(function() {
                var n = ce(e);
                a.sendMessage(h, n);
              });
            })(e).then(function() {
              return n;
            });
          },
          close: function(e) {
            return (
              (function(e) {
                d(function(n) {
                  n.close(), a.sendMessage(x, e);
                });
              })(e),
              this
            );
          },
          hide: function() {
            return (
              d(function(e) {
                return e.hideWidget();
              }),
              this
            );
          },
          show: function() {
            return (
              d(function(e) {
                return e.showWidget();
              }),
              this
            );
          },
          minimize: function() {
            return (
              d(function() {
                a.sendMessage(v);
              }),
              this
            );
          }
        }
      );
    },
    ye = c();
  !(function(e) {
    var t,
      i = { cloudName: null, apiKey: null },
      o = e.jQuery ? e.jQuery : e.$ && e.$.fn && e.$.fn.jquery ? e.$ : null,
      r = e.location.search.indexOf("debug=true") > -1,
      l = e.location.search.indexOf("dev=true") > -1;
    (t = r ? n.LOG : n.WARN),
      (a = t),
      (function() {
        try {
          var e = C("style", {
            id: "cloudinary-uw-page-styles",
            type: "text/css"
          });
          e.innerHTML =
            ".cloudinary-thumbnails { list-style: none; margin: 10px 0; padding: 0 }\n        .cloudinary-thumbnails:after { clear: both; display: block; content: '' }\n        .cloudinary-thumbnail { float: left; padding: 0; margin: 0 15px 5px 0; display: none } \n        .cloudinary-thumbnail.active { display: block } \n        .cloudinary-thumbnail img { border: 1px solid #01304d; border-radius: 2px; -moz-border-radius: 2px; -webkit-border-radius: 2px } \n        .cloudinary-thumbnail span { font-size: 11px; font-family: Arial, sans-serif; line-height: 14px; border: 1px solid #aaa; max-width: 150px; word-wrap: break-word; word-break: break-all; display: inline-block; padding: 3px; max-height: 60px; overflow: hidden; color: #999; } \n        .cloudinary-delete { vertical-align: top; font-size: 13px; text-decoration: none; padding-left: 2px; line-height: 8px; font-family: Arial, sans-serif; color: #01304d }\n        .cloudinary-button { background-color: #0078FF; color: #FFFFFF; text-decoration: none; font-size: 14px; line-height: 28px; height: 28x; cursor: pointer; font-weight: normal; display: inline-block; border-radius: 4px; padding: 10px 14px;}\n        .cloudinary-button:hover {-webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .5); box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .5); } ";
          var n = k("head");
          n && n.appendChild(e);
        } catch (e) {
          ye.error("[all.pageStyles]: failed to apply styles");
        }
      })();
    var u = (e.cloudinary = e.cloudinary || {});
    (u.applyUploadWidget = function(e, n, t) {
      return me(
        (function(e) {
          return $({}, i, { dev: l, debug: r }, e, {
            widgetVersion: "131",
            $: o
          });
        })(n),
        t,
        e
      );
    }),
      (u.createUploadWidget = function(e, n) {
        return u.applyUploadWidget(null, e, n);
      }),
      (u.openUploadWidget = function(e, n) {
        return u.createUploadWidget(e, n).open();
      }),
      (u.setCloudName = function(e) {
        i.cloudName = e;
      }),
      (u.setAPIKey = function(e) {
        i.apiKey = e;
      }),
      (u.WIDGET_SOURCES = $({}, s)),
      (u.WIDGET_VERSION = "131"),
      o &&
        (o.fn.cloudinary_upload_widget = function(e, n) {
          u.applyUploadWidget(o(this)[0], e, n);
        });
  })(self);
})();
