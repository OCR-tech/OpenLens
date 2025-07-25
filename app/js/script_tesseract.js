/*! For license information please see tesseract.min.js.LICENSE.txt */
!(function (t, e) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = e())
    : "function" == typeof define && define.amd
    ? define([], e)
    : "object" == typeof exports
    ? (exports.Tesseract = e())
    : (t.Tesseract = e());
})(self, () =>
  (() => {
    var t = {
        670: (t) => {
          function e(t) {
            return (
              (e =
                "function" == typeof Symbol &&
                "symbol" == typeof Symbol.iterator
                  ? function (t) {
                      return typeof t;
                    }
                  : function (t) {
                      return t &&
                        "function" == typeof Symbol &&
                        t.constructor === Symbol &&
                        t !== Symbol.prototype
                        ? "symbol"
                        : typeof t;
                    }),
              e(t)
            );
          }
          t.exports = function () {
            return (
              ("undefined" != typeof window &&
                "object" === e(window.process) &&
                "renderer" === window.process.type) ||
              !(
                "undefined" == typeof process ||
                "object" !== e(process.versions) ||
                !process.versions.electron
              ) ||
              ("object" ===
                ("undefined" == typeof navigator
                  ? "undefined"
                  : e(navigator)) &&
                "string" == typeof navigator.userAgent &&
                navigator.userAgent.indexOf("Electron") >= 0)
            );
          };
        },
        760: (t, e, r) => {
          function n(t) {
            return (
              (n =
                "function" == typeof Symbol &&
                "symbol" == typeof Symbol.iterator
                  ? function (t) {
                      return typeof t;
                    }
                  : function (t) {
                      return t &&
                        "function" == typeof Symbol &&
                        t.constructor === Symbol &&
                        t !== Symbol.prototype
                        ? "symbol"
                        : typeof t;
                    }),
              n(t)
            );
          }
          var o = (function (t) {
            "use strict";
            var e,
              r = Object.prototype,
              o = r.hasOwnProperty,
              i =
                Object.defineProperty ||
                function (t, e, r) {
                  t[e] = r.value;
                },
              a = "function" == typeof Symbol ? Symbol : {},
              c = a.iterator || "@@iterator",
              u = a.asyncIterator || "@@asyncIterator",
              s = a.toStringTag || "@@toStringTag";
            function l(t, e, r) {
              return (
                Object.defineProperty(t, e, {
                  value: r,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                }),
                t[e]
              );
            }
            try {
              l({}, "");
            } catch (t) {
              l = function (t, e, r) {
                return (t[e] = r);
              };
            }
            function f(t, e, r, n) {
              var o = e && e.prototype instanceof m ? e : m,
                a = Object.create(o.prototype),
                c = new N(n || []);
              return i(a, "_invoke", { value: k(t, r, c) }), a;
            }
            function p(t, e, r) {
              try {
                return { type: "normal", arg: t.call(e, r) };
              } catch (t) {
                return { type: "throw", arg: t };
              }
            }
            t.wrap = f;
            var h = "suspendedStart",
              y = "suspendedYield",
              d = "executing",
              v = "completed",
              g = {};
            function m() {}
            function b() {}
            function w() {}
            var x = {};
            l(x, c, function () {
              return this;
            });
            var L = Object.getPrototypeOf,
              O = L && L(L(A([])));
            O && O !== r && o.call(O, c) && (x = O);
            var E = (w.prototype = m.prototype = Object.create(x));
            function j(t) {
              ["next", "throw", "return"].forEach(function (e) {
                l(t, e, function (t) {
                  return this._invoke(e, t);
                });
              });
            }
            function S(t, e) {
              function r(i, a, c, u) {
                var s = p(t[i], t, a);
                if ("throw" !== s.type) {
                  var l = s.arg,
                    f = l.value;
                  return f && "object" === n(f) && o.call(f, "__await")
                    ? e.resolve(f.__await).then(
                        function (t) {
                          r("next", t, c, u);
                        },
                        function (t) {
                          r("throw", t, c, u);
                        }
                      )
                    : e.resolve(f).then(
                        function (t) {
                          (l.value = t), c(l);
                        },
                        function (t) {
                          return r("throw", t, c, u);
                        }
                      );
                }
                u(s.arg);
              }
              var a;
              i(this, "_invoke", {
                value: function (t, n) {
                  function o() {
                    return new e(function (e, o) {
                      r(t, n, e, o);
                    });
                  }
                  return (a = a ? a.then(o, o) : o());
                },
              });
            }
            function k(t, e, r) {
              var n = h;
              return function (o, i) {
                if (n === d) throw new Error("Generator is already running");
                if (n === v) {
                  if ("throw" === o) throw i;
                  return G();
                }
                for (r.method = o, r.arg = i; ; ) {
                  var a = r.delegate;
                  if (a) {
                    var c = P(a, r);
                    if (c) {
                      if (c === g) continue;
                      return c;
                    }
                  }
                  if ("next" === r.method) r.sent = r._sent = r.arg;
                  else if ("throw" === r.method) {
                    if (n === h) throw ((n = v), r.arg);
                    r.dispatchException(r.arg);
                  } else "return" === r.method && r.abrupt("return", r.arg);
                  n = d;
                  var u = p(t, e, r);
                  if ("normal" === u.type) {
                    if (((n = r.done ? v : y), u.arg === g)) continue;
                    return { value: u.arg, done: r.done };
                  }
                  "throw" === u.type &&
                    ((n = v), (r.method = "throw"), (r.arg = u.arg));
                }
              };
            }
            function P(t, r) {
              var n = r.method,
                o = t.iterator[n];
              if (o === e)
                return (
                  (r.delegate = null),
                  ("throw" === n &&
                    t.iterator.return &&
                    ((r.method = "return"),
                    (r.arg = e),
                    P(t, r),
                    "throw" === r.method)) ||
                    ("return" !== n &&
                      ((r.method = "throw"),
                      (r.arg = new TypeError(
                        "The iterator does not provide a '" + n + "' method"
                      )))),
                  g
                );
              var i = p(o, t.iterator, r.arg);
              if ("throw" === i.type)
                return (
                  (r.method = "throw"), (r.arg = i.arg), (r.delegate = null), g
                );
              var a = i.arg;
              return a
                ? a.done
                  ? ((r[t.resultName] = a.value),
                    (r.next = t.nextLoc),
                    "return" !== r.method && ((r.method = "next"), (r.arg = e)),
                    (r.delegate = null),
                    g)
                  : a
                : ((r.method = "throw"),
                  (r.arg = new TypeError("iterator result is not an object")),
                  (r.delegate = null),
                  g);
            }
            function _(t) {
              var e = { tryLoc: t[0] };
              1 in t && (e.catchLoc = t[1]),
                2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
                this.tryEntries.push(e);
            }
            function T(t) {
              var e = t.completion || {};
              (e.type = "normal"), delete e.arg, (t.completion = e);
            }
            function N(t) {
              (this.tryEntries = [{ tryLoc: "root" }]),
                t.forEach(_, this),
                this.reset(!0);
            }
            function A(t) {
              if (t) {
                var r = t[c];
                if (r) return r.call(t);
                if ("function" == typeof t.next) return t;
                if (!isNaN(t.length)) {
                  var n = -1,
                    i = function r() {
                      for (; ++n < t.length; )
                        if (o.call(t, n))
                          return (r.value = t[n]), (r.done = !1), r;
                      return (r.value = e), (r.done = !0), r;
                    };
                  return (i.next = i);
                }
              }
              return { next: G };
            }
            function G() {
              return { value: e, done: !0 };
            }
            return (
              (b.prototype = w),
              i(E, "constructor", { value: w, configurable: !0 }),
              i(w, "constructor", { value: b, configurable: !0 }),
              (b.displayName = l(w, s, "GeneratorFunction")),
              (t.isGeneratorFunction = function (t) {
                var e = "function" == typeof t && t.constructor;
                return (
                  !!e &&
                  (e === b || "GeneratorFunction" === (e.displayName || e.name))
                );
              }),
              (t.mark = function (t) {
                return (
                  Object.setPrototypeOf
                    ? Object.setPrototypeOf(t, w)
                    : ((t.__proto__ = w), l(t, s, "GeneratorFunction")),
                  (t.prototype = Object.create(E)),
                  t
                );
              }),
              (t.awrap = function (t) {
                return { __await: t };
              }),
              j(S.prototype),
              l(S.prototype, u, function () {
                return this;
              }),
              (t.AsyncIterator = S),
              (t.async = function (e, r, n, o, i) {
                void 0 === i && (i = Promise);
                var a = new S(f(e, r, n, o), i);
                return t.isGeneratorFunction(r)
                  ? a
                  : a.next().then(function (t) {
                      return t.done ? t.value : a.next();
                    });
              }),
              j(E),
              l(E, s, "Generator"),
              l(E, c, function () {
                return this;
              }),
              l(E, "toString", function () {
                return "[object Generator]";
              }),
              (t.keys = function (t) {
                var e = Object(t),
                  r = [];
                for (var n in e) r.push(n);
                return (
                  r.reverse(),
                  function t() {
                    for (; r.length; ) {
                      var n = r.pop();
                      if (n in e) return (t.value = n), (t.done = !1), t;
                    }
                    return (t.done = !0), t;
                  }
                );
              }),
              (t.values = A),
              (N.prototype = {
                constructor: N,
                reset: function (t) {
                  if (
                    ((this.prev = 0),
                    (this.next = 0),
                    (this.sent = this._sent = e),
                    (this.done = !1),
                    (this.delegate = null),
                    (this.method = "next"),
                    (this.arg = e),
                    this.tryEntries.forEach(T),
                    !t)
                  )
                    for (var r in this)
                      "t" === r.charAt(0) &&
                        o.call(this, r) &&
                        !isNaN(+r.slice(1)) &&
                        (this[r] = e);
                },
                stop: function () {
                  this.done = !0;
                  var t = this.tryEntries[0].completion;
                  if ("throw" === t.type) throw t.arg;
                  return this.rval;
                },
                dispatchException: function (t) {
                  if (this.done) throw t;
                  var r = this;
                  function n(n, o) {
                    return (
                      (c.type = "throw"),
                      (c.arg = t),
                      (r.next = n),
                      o && ((r.method = "next"), (r.arg = e)),
                      !!o
                    );
                  }
                  for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                    var a = this.tryEntries[i],
                      c = a.completion;
                    if ("root" === a.tryLoc) return n("end");
                    if (a.tryLoc <= this.prev) {
                      var u = o.call(a, "catchLoc"),
                        s = o.call(a, "finallyLoc");
                      if (u && s) {
                        if (this.prev < a.catchLoc) return n(a.catchLoc, !0);
                        if (this.prev < a.finallyLoc) return n(a.finallyLoc);
                      } else if (u) {
                        if (this.prev < a.catchLoc) return n(a.catchLoc, !0);
                      } else {
                        if (!s)
                          throw new Error(
                            "try statement without catch or finally"
                          );
                        if (this.prev < a.finallyLoc) return n(a.finallyLoc);
                      }
                    }
                  }
                },
                abrupt: function (t, e) {
                  for (var r = this.tryEntries.length - 1; r >= 0; --r) {
                    var n = this.tryEntries[r];
                    if (
                      n.tryLoc <= this.prev &&
                      o.call(n, "finallyLoc") &&
                      this.prev < n.finallyLoc
                    ) {
                      var i = n;
                      break;
                    }
                  }
                  i &&
                    ("break" === t || "continue" === t) &&
                    i.tryLoc <= e &&
                    e <= i.finallyLoc &&
                    (i = null);
                  var a = i ? i.completion : {};
                  return (
                    (a.type = t),
                    (a.arg = e),
                    i
                      ? ((this.method = "next"), (this.next = i.finallyLoc), g)
                      : this.complete(a)
                  );
                },
                complete: function (t, e) {
                  if ("throw" === t.type) throw t.arg;
                  return (
                    "break" === t.type || "continue" === t.type
                      ? (this.next = t.arg)
                      : "return" === t.type
                      ? ((this.rval = this.arg = t.arg),
                        (this.method = "return"),
                        (this.next = "end"))
                      : "normal" === t.type && e && (this.next = e),
                    g
                  );
                },
                finish: function (t) {
                  for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var r = this.tryEntries[e];
                    if (r.finallyLoc === t)
                      return this.complete(r.completion, r.afterLoc), T(r), g;
                  }
                },
                catch: function (t) {
                  for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var r = this.tryEntries[e];
                    if (r.tryLoc === t) {
                      var n = r.completion;
                      if ("throw" === n.type) {
                        var o = n.arg;
                        T(r);
                      }
                      return o;
                    }
                  }
                  throw new Error("illegal catch attempt");
                },
                delegateYield: function (t, r, n) {
                  return (
                    (this.delegate = {
                      iterator: A(t),
                      resultName: r,
                      nextLoc: n,
                    }),
                    "next" === this.method && (this.arg = e),
                    g
                  );
                },
              }),
              t
            );
          })("object" === n((t = r.nmd(t))) ? t.exports : {});
          try {
            regeneratorRuntime = o;
          } catch (t) {
            "object" ===
            ("undefined" == typeof globalThis ? "undefined" : n(globalThis))
              ? (globalThis.regeneratorRuntime = o)
              : Function("r", "regeneratorRuntime = r")(o);
          }
        },
        793: (t, e, r) => {
          function n(t) {
            return (
              (n =
                "function" == typeof Symbol &&
                "symbol" == typeof Symbol.iterator
                  ? function (t) {
                      return typeof t;
                    }
                  : function (t) {
                      return t &&
                        "function" == typeof Symbol &&
                        t.constructor === Symbol &&
                        t !== Symbol.prototype
                        ? "symbol"
                        : typeof t;
                    }),
              n(t)
            );
          }
          function o() {
            "use strict";
            o = function () {
              return t;
            };
            var t = {},
              e = Object.prototype,
              r = e.hasOwnProperty,
              i =
                Object.defineProperty ||
                function (t, e, r) {
                  t[e] = r.value;
                },
              a = "function" == typeof Symbol ? Symbol : {},
              c = a.iterator || "@@iterator",
              u = a.asyncIterator || "@@asyncIterator",
              s = a.toStringTag || "@@toStringTag";
            function l(t, e, r) {
              return (
                Object.defineProperty(t, e, {
                  value: r,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                }),
                t[e]
              );
            }
            try {
              l({}, "");
            } catch (t) {
              l = function (t, e, r) {
                return (t[e] = r);
              };
            }
            function f(t, e, r, n) {
              var o = e && e.prototype instanceof y ? e : y,
                a = Object.create(o.prototype),
                c = new k(n || []);
              return i(a, "_invoke", { value: O(t, r, c) }), a;
            }
            function p(t, e, r) {
              try {
                return { type: "normal", arg: t.call(e, r) };
              } catch (t) {
                return { type: "throw", arg: t };
              }
            }
            t.wrap = f;
            var h = {};
            function y() {}
            function d() {}
            function v() {}
            var g = {};
            l(g, c, function () {
              return this;
            });
            var m = Object.getPrototypeOf,
              b = m && m(m(P([])));
            b && b !== e && r.call(b, c) && (g = b);
            var w = (v.prototype = y.prototype = Object.create(g));
            function x(t) {
              ["next", "throw", "return"].forEach(function (e) {
                l(t, e, function (t) {
                  return this._invoke(e, t);
                });
              });
            }
            function L(t, e) {
              function o(i, a, c, u) {
                var s = p(t[i], t, a);
                if ("throw" !== s.type) {
                  var l = s.arg,
                    f = l.value;
                  return f && "object" == n(f) && r.call(f, "__await")
                    ? e.resolve(f.__await).then(
                        function (t) {
                          o("next", t, c, u);
                        },
                        function (t) {
                          o("throw", t, c, u);
                        }
                      )
                    : e.resolve(f).then(
                        function (t) {
                          (l.value = t), c(l);
                        },
                        function (t) {
                          return o("throw", t, c, u);
                        }
                      );
                }
                u(s.arg);
              }
              var a;
              i(this, "_invoke", {
                value: function (t, r) {
                  function n() {
                    return new e(function (e, n) {
                      o(t, r, e, n);
                    });
                  }
                  return (a = a ? a.then(n, n) : n());
                },
              });
            }
            function O(t, e, r) {
              var n = "suspendedStart";
              return function (o, i) {
                if ("executing" === n)
                  throw new Error("Generator is already running");
                if ("completed" === n) {
                  if ("throw" === o) throw i;
                  return { value: void 0, done: !0 };
                }
                for (r.method = o, r.arg = i; ; ) {
                  var a = r.delegate;
                  if (a) {
                    var c = E(a, r);
                    if (c) {
                      if (c === h) continue;
                      return c;
                    }
                  }
                  if ("next" === r.method) r.sent = r._sent = r.arg;
                  else if ("throw" === r.method) {
                    if ("suspendedStart" === n)
                      throw ((n = "completed"), r.arg);
                    r.dispatchException(r.arg);
                  } else "return" === r.method && r.abrupt("return", r.arg);
                  n = "executing";
                  var u = p(t, e, r);
                  if ("normal" === u.type) {
                    if (
                      ((n = r.done ? "completed" : "suspendedYield"),
                      u.arg === h)
                    )
                      continue;
                    return { value: u.arg, done: r.done };
                  }
                  "throw" === u.type &&
                    ((n = "completed"), (r.method = "throw"), (r.arg = u.arg));
                }
              };
            }
            function E(t, e) {
              var r = e.method,
                n = t.iterator[r];
              if (void 0 === n)
                return (
                  (e.delegate = null),
                  ("throw" === r &&
                    t.iterator.return &&
                    ((e.method = "return"),
                    (e.arg = void 0),
                    E(t, e),
                    "throw" === e.method)) ||
                    ("return" !== r &&
                      ((e.method = "throw"),
                      (e.arg = new TypeError(
                        "The iterator does not provide a '" + r + "' method"
                      )))),
                  h
                );
              var o = p(n, t.iterator, e.arg);
              if ("throw" === o.type)
                return (
                  (e.method = "throw"), (e.arg = o.arg), (e.delegate = null), h
                );
              var i = o.arg;
              return i
                ? i.done
                  ? ((e[t.resultName] = i.value),
                    (e.next = t.nextLoc),
                    "return" !== e.method &&
                      ((e.method = "next"), (e.arg = void 0)),
                    (e.delegate = null),
                    h)
                  : i
                : ((e.method = "throw"),
                  (e.arg = new TypeError("iterator result is not an object")),
                  (e.delegate = null),
                  h);
            }
            function j(t) {
              var e = { tryLoc: t[0] };
              1 in t && (e.catchLoc = t[1]),
                2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
                this.tryEntries.push(e);
            }
            function S(t) {
              var e = t.completion || {};
              (e.type = "normal"), delete e.arg, (t.completion = e);
            }
            function k(t) {
              (this.tryEntries = [{ tryLoc: "root" }]),
                t.forEach(j, this),
                this.reset(!0);
            }
            function P(t) {
              if (t) {
                var e = t[c];
                if (e) return e.call(t);
                if ("function" == typeof t.next) return t;
                if (!isNaN(t.length)) {
                  var n = -1,
                    o = function e() {
                      for (; ++n < t.length; )
                        if (r.call(t, n))
                          return (e.value = t[n]), (e.done = !1), e;
                      return (e.value = void 0), (e.done = !0), e;
                    };
                  return (o.next = o);
                }
              }
              return { next: _ };
            }
            function _() {
              return { value: void 0, done: !0 };
            }
            return (
              (d.prototype = v),
              i(w, "constructor", { value: v, configurable: !0 }),
              i(v, "constructor", { value: d, configurable: !0 }),
              (d.displayName = l(v, s, "GeneratorFunction")),
              (t.isGeneratorFunction = function (t) {
                var e = "function" == typeof t && t.constructor;
                return (
                  !!e &&
                  (e === d || "GeneratorFunction" === (e.displayName || e.name))
                );
              }),
              (t.mark = function (t) {
                return (
                  Object.setPrototypeOf
                    ? Object.setPrototypeOf(t, v)
                    : ((t.__proto__ = v), l(t, s, "GeneratorFunction")),
                  (t.prototype = Object.create(w)),
                  t
                );
              }),
              (t.awrap = function (t) {
                return { __await: t };
              }),
              x(L.prototype),
              l(L.prototype, u, function () {
                return this;
              }),
              (t.AsyncIterator = L),
              (t.async = function (e, r, n, o, i) {
                void 0 === i && (i = Promise);
                var a = new L(f(e, r, n, o), i);
                return t.isGeneratorFunction(r)
                  ? a
                  : a.next().then(function (t) {
                      return t.done ? t.value : a.next();
                    });
              }),
              x(w),
              l(w, s, "Generator"),
              l(w, c, function () {
                return this;
              }),
              l(w, "toString", function () {
                return "[object Generator]";
              }),
              (t.keys = function (t) {
                var e = Object(t),
                  r = [];
                for (var n in e) r.push(n);
                return (
                  r.reverse(),
                  function t() {
                    for (; r.length; ) {
                      var n = r.pop();
                      if (n in e) return (t.value = n), (t.done = !1), t;
                    }
                    return (t.done = !0), t;
                  }
                );
              }),
              (t.values = P),
              (k.prototype = {
                constructor: k,
                reset: function (t) {
                  if (
                    ((this.prev = 0),
                    (this.next = 0),
                    (this.sent = this._sent = void 0),
                    (this.done = !1),
                    (this.delegate = null),
                    (this.method = "next"),
                    (this.arg = void 0),
                    this.tryEntries.forEach(S),
                    !t)
                  )
                    for (var e in this)
                      "t" === e.charAt(0) &&
                        r.call(this, e) &&
                        !isNaN(+e.slice(1)) &&
                        (this[e] = void 0);
                },
                stop: function () {
                  this.done = !0;
                  var t = this.tryEntries[0].completion;
                  if ("throw" === t.type) throw t.arg;
                  return this.rval;
                },
                dispatchException: function (t) {
                  if (this.done) throw t;
                  var e = this;
                  function n(r, n) {
                    return (
                      (a.type = "throw"),
                      (a.arg = t),
                      (e.next = r),
                      n && ((e.method = "next"), (e.arg = void 0)),
                      !!n
                    );
                  }
                  for (var o = this.tryEntries.length - 1; o >= 0; --o) {
                    var i = this.tryEntries[o],
                      a = i.completion;
                    if ("root" === i.tryLoc) return n("end");
                    if (i.tryLoc <= this.prev) {
                      var c = r.call(i, "catchLoc"),
                        u = r.call(i, "finallyLoc");
                      if (c && u) {
                        if (this.prev < i.catchLoc) return n(i.catchLoc, !0);
                        if (this.prev < i.finallyLoc) return n(i.finallyLoc);
                      } else if (c) {
                        if (this.prev < i.catchLoc) return n(i.catchLoc, !0);
                      } else {
                        if (!u)
                          throw new Error(
                            "try statement without catch or finally"
                          );
                        if (this.prev < i.finallyLoc) return n(i.finallyLoc);
                      }
                    }
                  }
                },
                abrupt: function (t, e) {
                  for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                    var o = this.tryEntries[n];
                    if (
                      o.tryLoc <= this.prev &&
                      r.call(o, "finallyLoc") &&
                      this.prev < o.finallyLoc
                    ) {
                      var i = o;
                      break;
                    }
                  }
                  i &&
                    ("break" === t || "continue" === t) &&
                    i.tryLoc <= e &&
                    e <= i.finallyLoc &&
                    (i = null);
                  var a = i ? i.completion : {};
                  return (
                    (a.type = t),
                    (a.arg = e),
                    i
                      ? ((this.method = "next"), (this.next = i.finallyLoc), h)
                      : this.complete(a)
                  );
                },
                complete: function (t, e) {
                  if ("throw" === t.type) throw t.arg;
                  return (
                    "break" === t.type || "continue" === t.type
                      ? (this.next = t.arg)
                      : "return" === t.type
                      ? ((this.rval = this.arg = t.arg),
                        (this.method = "return"),
                        (this.next = "end"))
                      : "normal" === t.type && e && (this.next = e),
                    h
                  );
                },
                finish: function (t) {
                  for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var r = this.tryEntries[e];
                    if (r.finallyLoc === t)
                      return this.complete(r.completion, r.afterLoc), S(r), h;
                  }
                },
                catch: function (t) {
                  for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var r = this.tryEntries[e];
                    if (r.tryLoc === t) {
                      var n = r.completion;
                      if ("throw" === n.type) {
                        var o = n.arg;
                        S(r);
                      }
                      return o;
                    }
                  }
                  throw new Error("illegal catch attempt");
                },
                delegateYield: function (t, e, r) {
                  return (
                    (this.delegate = {
                      iterator: P(t),
                      resultName: e,
                      nextLoc: r,
                    }),
                    "next" === this.method && (this.arg = void 0),
                    h
                  );
                },
              }),
              t
            );
          }
          function i(t, e, r, n, o, i, a) {
            try {
              var c = t[i](a),
                u = c.value;
            } catch (t) {
              return void r(t);
            }
            c.done ? e(u) : Promise.resolve(u).then(n, o);
          }
          function a(t) {
            return function () {
              var e = this,
                r = arguments;
              return new Promise(function (n, o) {
                var a = t.apply(e, r);
                function c(t) {
                  i(a, n, o, c, u, "next", t);
                }
                function u(t) {
                  i(a, n, o, c, u, "throw", t);
                }
                c(void 0);
              });
            };
          }
          var c = r(311),
            u = (function () {
              var t = a(
                o().mark(function t(e, r, n) {
                  var i;
                  return o().wrap(function (t) {
                    for (;;)
                      switch ((t.prev = t.next)) {
                        case 0:
                          return (t.next = 2), c(r, 1, n);
                        case 2:
                          return (
                            (i = t.sent),
                            t.abrupt(
                              "return",
                              i.recognize(e).finally(
                                a(
                                  o().mark(function t() {
                                    return o().wrap(function (t) {
                                      for (;;)
                                        switch ((t.prev = t.next)) {
                                          case 0:
                                            return (t.next = 2), i.terminate();
                                          case 2:
                                          case "end":
                                            return t.stop();
                                        }
                                    }, t);
                                  })
                                )
                              )
                            )
                          );
                        case 4:
                        case "end":
                          return t.stop();
                      }
                  }, t);
                })
              );
              return function (e, r, n) {
                return t.apply(this, arguments);
              };
            })(),
            s = (function () {
              var t = a(
                o().mark(function t(e, r) {
                  var n;
                  return o().wrap(function (t) {
                    for (;;)
                      switch ((t.prev = t.next)) {
                        case 0:
                          return (t.next = 2), c("osd", 0, r);
                        case 2:
                          return (
                            (n = t.sent),
                            t.abrupt(
                              "return",
                              n.detect(e).finally(
                                a(
                                  o().mark(function t() {
                                    return o().wrap(function (t) {
                                      for (;;)
                                        switch ((t.prev = t.next)) {
                                          case 0:
                                            return (t.next = 2), n.terminate();
                                          case 2:
                                          case "end":
                                            return t.stop();
                                        }
                                    }, t);
                                  })
                                )
                              )
                            )
                          );
                        case 4:
                        case "end":
                          return t.stop();
                      }
                  }, t);
                })
              );
              return function (e, r) {
                return t.apply(this, arguments);
              };
            })();
          t.exports = { recognize: u, detect: s };
        },
        847: (t) => {
          t.exports = {
            TESSERACT_ONLY: 0,
            LSTM_ONLY: 1,
            TESSERACT_LSTM_COMBINED: 2,
            DEFAULT: 3,
          };
        },
        711: (t) => {
          t.exports = {
            OSD_ONLY: "0",
            AUTO_OSD: "1",
            AUTO_ONLY: "2",
            AUTO: "3",
            SINGLE_COLUMN: "4",
            SINGLE_BLOCK_VERT_TEXT: "5",
            SINGLE_BLOCK: "6",
            SINGLE_LINE: "7",
            SINGLE_WORD: "8",
            CIRCLE_WORD: "9",
            SINGLE_CHAR: "10",
            SPARSE_TEXT: "11",
            SPARSE_TEXT_OSD: "12",
            RAW_LINE: "13",
          };
        },
        341: (t) => {
          t.exports = { workerBlobURL: !0, logger: function () {} };
        },
        5: (t) => {
          t.exports = {
            AFR: "afr",
            AMH: "amh",
            ARA: "ara",
            ASM: "asm",
            AZE: "aze",
            AZE_CYRL: "aze_cyrl",
            BEL: "bel",
            BEN: "ben",
            BOD: "bod",
            BOS: "bos",
            BUL: "bul",
            CAT: "cat",
            CEB: "ceb",
            CES: "ces",
            CHI_SIM: "chi_sim",
            CHI_TRA: "chi_tra",
            CHR: "chr",
            CYM: "cym",
            DAN: "dan",
            DEU: "deu",
            DZO: "dzo",
            ELL: "ell",
            ENG: "eng",
            ENM: "enm",
            EPO: "epo",
            EST: "est",
            EUS: "eus",
            FAS: "fas",
            FIN: "fin",
            FRA: "fra",
            FRK: "frk",
            FRM: "frm",
            GLE: "gle",
            GLG: "glg",
            GRC: "grc",
            GUJ: "guj",
            HAT: "hat",
            HEB: "heb",
            HIN: "hin",
            HRV: "hrv",
            HUN: "hun",
            IKU: "iku",
            IND: "ind",
            ISL: "isl",
            ITA: "ita",
            ITA_OLD: "ita_old",
            JAV: "jav",
            JPN: "jpn",
            KAN: "kan",
            KAT: "kat",
            KAT_OLD: "kat_old",
            KAZ: "kaz",
            KHM: "khm",
            KIR: "kir",
            KOR: "kor",
            KUR: "kur",
            LAO: "lao",
            LAT: "lat",
            LAV: "lav",
            LIT: "lit",
            MAL: "mal",
            MAR: "mar",
            MKD: "mkd",
            MLT: "mlt",
            MSA: "msa",
            MYA: "mya",
            NEP: "nep",
            NLD: "nld",
            NOR: "nor",
            ORI: "ori",
            PAN: "pan",
            POL: "pol",
            POR: "por",
            PUS: "pus",
            RON: "ron",
            RUS: "rus",
            SAN: "san",
            SIN: "sin",
            SLK: "slk",
            SLV: "slv",
            SPA: "spa",
            SPA_OLD: "spa_old",
            SQI: "sqi",
            SRP: "srp",
            SRP_LATN: "srp_latn",
            SWA: "swa",
            SWE: "swe",
            SYR: "syr",
            TAM: "tam",
            TEL: "tel",
            TGK: "tgk",
            TGL: "tgl",
            THA: "tha",
            TIR: "tir",
            TUR: "tur",
            UIG: "uig",
            UKR: "ukr",
            URD: "urd",
            UZB: "uzb",
            UZB_CYRL: "uzb_cyrl",
            VIE: "vie",
            YID: "yid",
          };
        },
        106: (t, e, r) => {
          var n = r(313),
            o = 0;
          t.exports = function (t) {
            var e = t.id,
              r = t.action,
              i = t.payload,
              a = void 0 === i ? {} : i,
              c = e;
            return (
              void 0 === c && ((c = n("Job", o)), (o += 1)),
              { id: c, action: r, payload: a }
            );
          };
        },
        936: function (t, e, r) {
          function n(t) {
            return (
              (n =
                "function" == typeof Symbol &&
                "symbol" == typeof Symbol.iterator
                  ? function (t) {
                      return typeof t;
                    }
                  : function (t) {
                      return t &&
                        "function" == typeof Symbol &&
                        t.constructor === Symbol &&
                        t !== Symbol.prototype
                        ? "symbol"
                        : typeof t;
                    }),
              n(t)
            );
          }
          var o = this;
          function i() {
            "use strict";
            i = function () {
              return t;
            };
            var t = {},
              e = Object.prototype,
              r = e.hasOwnProperty,
              o =
                Object.defineProperty ||
                function (t, e, r) {
                  t[e] = r.value;
                },
              a = "function" == typeof Symbol ? Symbol : {},
              c = a.iterator || "@@iterator",
              u = a.asyncIterator || "@@asyncIterator",
              s = a.toStringTag || "@@toStringTag";
            function l(t, e, r) {
              return (
                Object.defineProperty(t, e, {
                  value: r,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                }),
                t[e]
              );
            }
            try {
              l({}, "");
            } catch (t) {
              l = function (t, e, r) {
                return (t[e] = r);
              };
            }
            function f(t, e, r, n) {
              var i = e && e.prototype instanceof y ? e : y,
                a = Object.create(i.prototype),
                c = new k(n || []);
              return o(a, "_invoke", { value: O(t, r, c) }), a;
            }
            function p(t, e, r) {
              try {
                return { type: "normal", arg: t.call(e, r) };
              } catch (t) {
                return { type: "throw", arg: t };
              }
            }
            t.wrap = f;
            var h = {};
            function y() {}
            function d() {}
            function v() {}
            var g = {};
            l(g, c, function () {
              return this;
            });
            var m = Object.getPrototypeOf,
              b = m && m(m(P([])));
            b && b !== e && r.call(b, c) && (g = b);
            var w = (v.prototype = y.prototype = Object.create(g));
            function x(t) {
              ["next", "throw", "return"].forEach(function (e) {
                l(t, e, function (t) {
                  return this._invoke(e, t);
                });
              });
            }
            function L(t, e) {
              function i(o, a, c, u) {
                var s = p(t[o], t, a);
                if ("throw" !== s.type) {
                  var l = s.arg,
                    f = l.value;
                  return f && "object" == n(f) && r.call(f, "__await")
                    ? e.resolve(f.__await).then(
                        function (t) {
                          i("next", t, c, u);
                        },
                        function (t) {
                          i("throw", t, c, u);
                        }
                      )
                    : e.resolve(f).then(
                        function (t) {
                          (l.value = t), c(l);
                        },
                        function (t) {
                          return i("throw", t, c, u);
                        }
                      );
                }
                u(s.arg);
              }
              var a;
              o(this, "_invoke", {
                value: function (t, r) {
                  function n() {
                    return new e(function (e, n) {
                      i(t, r, e, n);
                    });
                  }
                  return (a = a ? a.then(n, n) : n());
                },
              });
            }
            function O(t, e, r) {
              var n = "suspendedStart";
              return function (o, i) {
                if ("executing" === n)
                  throw new Error("Generator is already running");
                if ("completed" === n) {
                  if ("throw" === o) throw i;
                  return { value: void 0, done: !0 };
                }
                for (r.method = o, r.arg = i; ; ) {
                  var a = r.delegate;
                  if (a) {
                    var c = E(a, r);
                    if (c) {
                      if (c === h) continue;
                      return c;
                    }
                  }
                  if ("next" === r.method) r.sent = r._sent = r.arg;
                  else if ("throw" === r.method) {
                    if ("suspendedStart" === n)
                      throw ((n = "completed"), r.arg);
                    r.dispatchException(r.arg);
                  } else "return" === r.method && r.abrupt("return", r.arg);
                  n = "executing";
                  var u = p(t, e, r);
                  if ("normal" === u.type) {
                    if (
                      ((n = r.done ? "completed" : "suspendedYield"),
                      u.arg === h)
                    )
                      continue;
                    return { value: u.arg, done: r.done };
                  }
                  "throw" === u.type &&
                    ((n = "completed"), (r.method = "throw"), (r.arg = u.arg));
                }
              };
            }
            function E(t, e) {
              var r = e.method,
                n = t.iterator[r];
              if (void 0 === n)
                return (
                  (e.delegate = null),
                  ("throw" === r &&
                    t.iterator.return &&
                    ((e.method = "return"),
                    (e.arg = void 0),
                    E(t, e),
                    "throw" === e.method)) ||
                    ("return" !== r &&
                      ((e.method = "throw"),
                      (e.arg = new TypeError(
                        "The iterator does not provide a '" + r + "' method"
                      )))),
                  h
                );
              var o = p(n, t.iterator, e.arg);
              if ("throw" === o.type)
                return (
                  (e.method = "throw"), (e.arg = o.arg), (e.delegate = null), h
                );
              var i = o.arg;
              return i
                ? i.done
                  ? ((e[t.resultName] = i.value),
                    (e.next = t.nextLoc),
                    "return" !== e.method &&
                      ((e.method = "next"), (e.arg = void 0)),
                    (e.delegate = null),
                    h)
                  : i
                : ((e.method = "throw"),
                  (e.arg = new TypeError("iterator result is not an object")),
                  (e.delegate = null),
                  h);
            }
            function j(t) {
              var e = { tryLoc: t[0] };
              1 in t && (e.catchLoc = t[1]),
                2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
                this.tryEntries.push(e);
            }
            function S(t) {
              var e = t.completion || {};
              (e.type = "normal"), delete e.arg, (t.completion = e);
            }
            function k(t) {
              (this.tryEntries = [{ tryLoc: "root" }]),
                t.forEach(j, this),
                this.reset(!0);
            }
            function P(t) {
              if (t) {
                var e = t[c];
                if (e) return e.call(t);
                if ("function" == typeof t.next) return t;
                if (!isNaN(t.length)) {
                  var n = -1,
                    o = function e() {
                      for (; ++n < t.length; )
                        if (r.call(t, n))
                          return (e.value = t[n]), (e.done = !1), e;
                      return (e.value = void 0), (e.done = !0), e;
                    };
                  return (o.next = o);
                }
              }
              return { next: _ };
            }
            function _() {
              return { value: void 0, done: !0 };
            }
            return (
              (d.prototype = v),
              o(w, "constructor", { value: v, configurable: !0 }),
              o(v, "constructor", { value: d, configurable: !0 }),
              (d.displayName = l(v, s, "GeneratorFunction")),
              (t.isGeneratorFunction = function (t) {
                var e = "function" == typeof t && t.constructor;
                return (
                  !!e &&
                  (e === d || "GeneratorFunction" === (e.displayName || e.name))
                );
              }),
              (t.mark = function (t) {
                return (
                  Object.setPrototypeOf
                    ? Object.setPrototypeOf(t, v)
                    : ((t.__proto__ = v), l(t, s, "GeneratorFunction")),
                  (t.prototype = Object.create(w)),
                  t
                );
              }),
              (t.awrap = function (t) {
                return { __await: t };
              }),
              x(L.prototype),
              l(L.prototype, u, function () {
                return this;
              }),
              (t.AsyncIterator = L),
              (t.async = function (e, r, n, o, i) {
                void 0 === i && (i = Promise);
                var a = new L(f(e, r, n, o), i);
                return t.isGeneratorFunction(r)
                  ? a
                  : a.next().then(function (t) {
                      return t.done ? t.value : a.next();
                    });
              }),
              x(w),
              l(w, s, "Generator"),
              l(w, c, function () {
                return this;
              }),
              l(w, "toString", function () {
                return "[object Generator]";
              }),
              (t.keys = function (t) {
                var e = Object(t),
                  r = [];
                for (var n in e) r.push(n);
                return (
                  r.reverse(),
                  function t() {
                    for (; r.length; ) {
                      var n = r.pop();
                      if (n in e) return (t.value = n), (t.done = !1), t;
                    }
                    return (t.done = !0), t;
                  }
                );
              }),
              (t.values = P),
              (k.prototype = {
                constructor: k,
                reset: function (t) {
                  if (
                    ((this.prev = 0),
                    (this.next = 0),
                    (this.sent = this._sent = void 0),
                    (this.done = !1),
                    (this.delegate = null),
                    (this.method = "next"),
                    (this.arg = void 0),
                    this.tryEntries.forEach(S),
                    !t)
                  )
                    for (var e in this)
                      "t" === e.charAt(0) &&
                        r.call(this, e) &&
                        !isNaN(+e.slice(1)) &&
                        (this[e] = void 0);
                },
                stop: function () {
                  this.done = !0;
                  var t = this.tryEntries[0].completion;
                  if ("throw" === t.type) throw t.arg;
                  return this.rval;
                },
                dispatchException: function (t) {
                  if (this.done) throw t;
                  var e = this;
                  function n(r, n) {
                    return (
                      (a.type = "throw"),
                      (a.arg = t),
                      (e.next = r),
                      n && ((e.method = "next"), (e.arg = void 0)),
                      !!n
                    );
                  }
                  for (var o = this.tryEntries.length - 1; o >= 0; --o) {
                    var i = this.tryEntries[o],
                      a = i.completion;
                    if ("root" === i.tryLoc) return n("end");
                    if (i.tryLoc <= this.prev) {
                      var c = r.call(i, "catchLoc"),
                        u = r.call(i, "finallyLoc");
                      if (c && u) {
                        if (this.prev < i.catchLoc) return n(i.catchLoc, !0);
                        if (this.prev < i.finallyLoc) return n(i.finallyLoc);
                      } else if (c) {
                        if (this.prev < i.catchLoc) return n(i.catchLoc, !0);
                      } else {
                        if (!u)
                          throw new Error(
                            "try statement without catch or finally"
                          );
                        if (this.prev < i.finallyLoc) return n(i.finallyLoc);
                      }
                    }
                  }
                },
                abrupt: function (t, e) {
                  for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                    var o = this.tryEntries[n];
                    if (
                      o.tryLoc <= this.prev &&
                      r.call(o, "finallyLoc") &&
                      this.prev < o.finallyLoc
                    ) {
                      var i = o;
                      break;
                    }
                  }
                  i &&
                    ("break" === t || "continue" === t) &&
                    i.tryLoc <= e &&
                    e <= i.finallyLoc &&
                    (i = null);
                  var a = i ? i.completion : {};
                  return (
                    (a.type = t),
                    (a.arg = e),
                    i
                      ? ((this.method = "next"), (this.next = i.finallyLoc), h)
                      : this.complete(a)
                  );
                },
                complete: function (t, e) {
                  if ("throw" === t.type) throw t.arg;
                  return (
                    "break" === t.type || "continue" === t.type
                      ? (this.next = t.arg)
                      : "return" === t.type
                      ? ((this.rval = this.arg = t.arg),
                        (this.method = "return"),
                        (this.next = "end"))
                      : "normal" === t.type && e && (this.next = e),
                    h
                  );
                },
                finish: function (t) {
                  for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var r = this.tryEntries[e];
                    if (r.finallyLoc === t)
                      return this.complete(r.completion, r.afterLoc), S(r), h;
                  }
                },
                catch: function (t) {
                  for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var r = this.tryEntries[e];
                    if (r.tryLoc === t) {
                      var n = r.completion;
                      if ("throw" === n.type) {
                        var o = n.arg;
                        S(r);
                      }
                      return o;
                    }
                  }
                  throw new Error("illegal catch attempt");
                },
                delegateYield: function (t, e, r) {
                  return (
                    (this.delegate = {
                      iterator: P(t),
                      resultName: e,
                      nextLoc: r,
                    }),
                    "next" === this.method && (this.arg = void 0),
                    h
                  );
                },
              }),
              t
            );
          }
          function a(t, e) {
            (null == e || e > t.length) && (e = t.length);
            for (var r = 0, n = new Array(e); r < e; r++) n[r] = t[r];
            return n;
          }
          function c(t, e, r, n, o, i, a) {
            try {
              var c = t[i](a),
                u = c.value;
            } catch (t) {
              return void r(t);
            }
            c.done ? e(u) : Promise.resolve(u).then(n, o);
          }
          function u(t) {
            return function () {
              var e = this,
                r = arguments;
              return new Promise(function (n, o) {
                var i = t.apply(e, r);
                function a(t) {
                  c(i, n, o, a, u, "next", t);
                }
                function u(t) {
                  c(i, n, o, a, u, "throw", t);
                }
                a(void 0);
              });
            };
          }
          var s = r(106),
            l = r(185).log,
            f = r(313),
            p = 0;
          t.exports = function () {
            var t = f("Scheduler", p),
              e = {},
              r = {},
              n = [];
            p += 1;
            var c = function () {
                return Object.keys(e).length;
              },
              h = function () {
                if (0 !== n.length)
                  for (var t = Object.keys(e), o = 0; o < t.length; o += 1)
                    if (void 0 === r[t[o]]) {
                      n[0](e[t[o]]);
                      break;
                    }
              },
              y = function (e, c) {
                return new Promise(function (f, p) {
                  var y = s({ action: e, payload: c });
                  n.push(
                    (function () {
                      var t = u(
                        i().mark(function t(u) {
                          return i().wrap(
                            function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    return (
                                      n.shift(),
                                      (r[u.id] = y),
                                      (t.prev = 2),
                                      (t.t0 = f),
                                      (t.next = 6),
                                      u[e].apply(
                                        o,
                                        [].concat(
                                          (function (t) {
                                            if (Array.isArray(t)) return a(t);
                                          })((i = c)) ||
                                            (function (t) {
                                              if (
                                                ("undefined" != typeof Symbol &&
                                                  null != t[Symbol.iterator]) ||
                                                null != t["@@iterator"]
                                              )
                                                return Array.from(t);
                                            })(i) ||
                                            (function (t, e) {
                                              if (t) {
                                                if ("string" == typeof t)
                                                  return a(t, e);
                                                var r =
                                                  Object.prototype.toString
                                                    .call(t)
                                                    .slice(8, -1);
                                                return (
                                                  "Object" === r &&
                                                    t.constructor &&
                                                    (r = t.constructor.name),
                                                  "Map" === r || "Set" === r
                                                    ? Array.from(t)
                                                    : "Arguments" === r ||
                                                      /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(
                                                        r
                                                      )
                                                    ? a(t, e)
                                                    : void 0
                                                );
                                              }
                                            })(i) ||
                                            (function () {
                                              throw new TypeError(
                                                "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
                                              );
                                            })(),
                                          [y.id]
                                        )
                                      )
                                    );
                                  case 6:
                                    (t.t1 = t.sent),
                                      (0, t.t0)(t.t1),
                                      (t.next = 13);
                                    break;
                                  case 10:
                                    (t.prev = 10), (t.t2 = t.catch(2)), p(t.t2);
                                  case 13:
                                    return (
                                      (t.prev = 13),
                                      delete r[u.id],
                                      h(),
                                      t.finish(13)
                                    );
                                  case 17:
                                  case "end":
                                    return t.stop();
                                }
                              var i;
                            },
                            t,
                            null,
                            [[2, 10, 13, 17]]
                          );
                        })
                      );
                      return function (e) {
                        return t.apply(this, arguments);
                      };
                    })()
                  ),
                    l("[".concat(t, "]: Add ").concat(y.id, " to JobQueue")),
                    l("[".concat(t, "]: JobQueue length=").concat(n.length)),
                    h();
                });
              },
              d = (function () {
                var e = u(
                  i().mark(function e(r) {
                    var n,
                      o,
                      a,
                      u = arguments;
                    return i().wrap(function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            if (0 !== c()) {
                              e.next = 2;
                              break;
                            }
                            throw Error(
                              "[".concat(
                                t,
                                "]: You need to have at least one worker before adding jobs"
                              )
                            );
                          case 2:
                            for (
                              n = u.length,
                                o = new Array(n > 1 ? n - 1 : 0),
                                a = 1;
                              a < n;
                              a++
                            )
                              o[a - 1] = u[a];
                            return e.abrupt("return", y(r, o));
                          case 4:
                          case "end":
                            return e.stop();
                        }
                    }, e);
                  })
                );
                return function (t) {
                  return e.apply(this, arguments);
                };
              })(),
              v = (function () {
                var t = u(
                  i().mark(function t() {
                    return i().wrap(function (t) {
                      for (;;)
                        switch ((t.prev = t.next)) {
                          case 0:
                            Object.keys(e).forEach(
                              (function () {
                                var t = u(
                                  i().mark(function t(r) {
                                    return i().wrap(function (t) {
                                      for (;;)
                                        switch ((t.prev = t.next)) {
                                          case 0:
                                            return (
                                              (t.next = 2), e[r].terminate()
                                            );
                                          case 2:
                                          case "end":
                                            return t.stop();
                                        }
                                    }, t);
                                  })
                                );
                                return function (e) {
                                  return t.apply(this, arguments);
                                };
                              })()
                            ),
                              (n = []);
                          case 2:
                          case "end":
                            return t.stop();
                        }
                    }, t);
                  })
                );
                return function () {
                  return t.apply(this, arguments);
                };
              })();
            return {
              addWorker: function (r) {
                return (
                  (e[r.id] = r),
                  l("[".concat(t, "]: Add ").concat(r.id)),
                  l("[".concat(t, "]: Number of workers=").concat(c())),
                  h(),
                  r.id
                );
              },
              addJob: d,
              terminate: v,
              getQueueLen: function () {
                return n.length;
              },
              getNumWorkers: c,
            };
          };
        },
        311: (t, e, r) => {
          function n(t) {
            return (
              (n =
                "function" == typeof Symbol &&
                "symbol" == typeof Symbol.iterator
                  ? function (t) {
                      return typeof t;
                    }
                  : function (t) {
                      return t &&
                        "function" == typeof Symbol &&
                        t.constructor === Symbol &&
                        t !== Symbol.prototype
                        ? "symbol"
                        : typeof t;
                    }),
              n(t)
            );
          }
          var o = ["logger", "errorHandler"];
          function i() {
            "use strict";
            i = function () {
              return t;
            };
            var t = {},
              e = Object.prototype,
              r = e.hasOwnProperty,
              o =
                Object.defineProperty ||
                function (t, e, r) {
                  t[e] = r.value;
                },
              a = "function" == typeof Symbol ? Symbol : {},
              c = a.iterator || "@@iterator",
              u = a.asyncIterator || "@@asyncIterator",
              s = a.toStringTag || "@@toStringTag";
            function l(t, e, r) {
              return (
                Object.defineProperty(t, e, {
                  value: r,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                }),
                t[e]
              );
            }
            try {
              l({}, "");
            } catch (t) {
              l = function (t, e, r) {
                return (t[e] = r);
              };
            }
            function f(t, e, r, n) {
              var i = e && e.prototype instanceof y ? e : y,
                a = Object.create(i.prototype),
                c = new k(n || []);
              return o(a, "_invoke", { value: O(t, r, c) }), a;
            }
            function p(t, e, r) {
              try {
                return { type: "normal", arg: t.call(e, r) };
              } catch (t) {
                return { type: "throw", arg: t };
              }
            }
            t.wrap = f;
            var h = {};
            function y() {}
            function d() {}
            function v() {}
            var g = {};
            l(g, c, function () {
              return this;
            });
            var m = Object.getPrototypeOf,
              b = m && m(m(P([])));
            b && b !== e && r.call(b, c) && (g = b);
            var w = (v.prototype = y.prototype = Object.create(g));
            function x(t) {
              ["next", "throw", "return"].forEach(function (e) {
                l(t, e, function (t) {
                  return this._invoke(e, t);
                });
              });
            }
            function L(t, e) {
              function i(o, a, c, u) {
                var s = p(t[o], t, a);
                if ("throw" !== s.type) {
                  var l = s.arg,
                    f = l.value;
                  return f && "object" == n(f) && r.call(f, "__await")
                    ? e.resolve(f.__await).then(
                        function (t) {
                          i("next", t, c, u);
                        },
                        function (t) {
                          i("throw", t, c, u);
                        }
                      )
                    : e.resolve(f).then(
                        function (t) {
                          (l.value = t), c(l);
                        },
                        function (t) {
                          return i("throw", t, c, u);
                        }
                      );
                }
                u(s.arg);
              }
              var a;
              o(this, "_invoke", {
                value: function (t, r) {
                  function n() {
                    return new e(function (e, n) {
                      i(t, r, e, n);
                    });
                  }
                  return (a = a ? a.then(n, n) : n());
                },
              });
            }
            function O(t, e, r) {
              var n = "suspendedStart";
              return function (o, i) {
                if ("executing" === n)
                  throw new Error("Generator is already running");
                if ("completed" === n) {
                  if ("throw" === o) throw i;
                  return { value: void 0, done: !0 };
                }
                for (r.method = o, r.arg = i; ; ) {
                  var a = r.delegate;
                  if (a) {
                    var c = E(a, r);
                    if (c) {
                      if (c === h) continue;
                      return c;
                    }
                  }
                  if ("next" === r.method) r.sent = r._sent = r.arg;
                  else if ("throw" === r.method) {
                    if ("suspendedStart" === n)
                      throw ((n = "completed"), r.arg);
                    r.dispatchException(r.arg);
                  } else "return" === r.method && r.abrupt("return", r.arg);
                  n = "executing";
                  var u = p(t, e, r);
                  if ("normal" === u.type) {
                    if (
                      ((n = r.done ? "completed" : "suspendedYield"),
                      u.arg === h)
                    )
                      continue;
                    return { value: u.arg, done: r.done };
                  }
                  "throw" === u.type &&
                    ((n = "completed"), (r.method = "throw"), (r.arg = u.arg));
                }
              };
            }
            function E(t, e) {
              var r = e.method,
                n = t.iterator[r];
              if (void 0 === n)
                return (
                  (e.delegate = null),
                  ("throw" === r &&
                    t.iterator.return &&
                    ((e.method = "return"),
                    (e.arg = void 0),
                    E(t, e),
                    "throw" === e.method)) ||
                    ("return" !== r &&
                      ((e.method = "throw"),
                      (e.arg = new TypeError(
                        "The iterator does not provide a '" + r + "' method"
                      )))),
                  h
                );
              var o = p(n, t.iterator, e.arg);
              if ("throw" === o.type)
                return (
                  (e.method = "throw"), (e.arg = o.arg), (e.delegate = null), h
                );
              var i = o.arg;
              return i
                ? i.done
                  ? ((e[t.resultName] = i.value),
                    (e.next = t.nextLoc),
                    "return" !== e.method &&
                      ((e.method = "next"), (e.arg = void 0)),
                    (e.delegate = null),
                    h)
                  : i
                : ((e.method = "throw"),
                  (e.arg = new TypeError("iterator result is not an object")),
                  (e.delegate = null),
                  h);
            }
            function j(t) {
              var e = { tryLoc: t[0] };
              1 in t && (e.catchLoc = t[1]),
                2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
                this.tryEntries.push(e);
            }
            function S(t) {
              var e = t.completion || {};
              (e.type = "normal"), delete e.arg, (t.completion = e);
            }
            function k(t) {
              (this.tryEntries = [{ tryLoc: "root" }]),
                t.forEach(j, this),
                this.reset(!0);
            }
            function P(t) {
              if (t) {
                var e = t[c];
                if (e) return e.call(t);
                if ("function" == typeof t.next) return t;
                if (!isNaN(t.length)) {
                  var n = -1,
                    o = function e() {
                      for (; ++n < t.length; )
                        if (r.call(t, n))
                          return (e.value = t[n]), (e.done = !1), e;
                      return (e.value = void 0), (e.done = !0), e;
                    };
                  return (o.next = o);
                }
              }
              return { next: _ };
            }
            function _() {
              return { value: void 0, done: !0 };
            }
            return (
              (d.prototype = v),
              o(w, "constructor", { value: v, configurable: !0 }),
              o(v, "constructor", { value: d, configurable: !0 }),
              (d.displayName = l(v, s, "GeneratorFunction")),
              (t.isGeneratorFunction = function (t) {
                var e = "function" == typeof t && t.constructor;
                return (
                  !!e &&
                  (e === d || "GeneratorFunction" === (e.displayName || e.name))
                );
              }),
              (t.mark = function (t) {
                return (
                  Object.setPrototypeOf
                    ? Object.setPrototypeOf(t, v)
                    : ((t.__proto__ = v), l(t, s, "GeneratorFunction")),
                  (t.prototype = Object.create(w)),
                  t
                );
              }),
              (t.awrap = function (t) {
                return { __await: t };
              }),
              x(L.prototype),
              l(L.prototype, u, function () {
                return this;
              }),
              (t.AsyncIterator = L),
              (t.async = function (e, r, n, o, i) {
                void 0 === i && (i = Promise);
                var a = new L(f(e, r, n, o), i);
                return t.isGeneratorFunction(r)
                  ? a
                  : a.next().then(function (t) {
                      return t.done ? t.value : a.next();
                    });
              }),
              x(w),
              l(w, s, "Generator"),
              l(w, c, function () {
                return this;
              }),
              l(w, "toString", function () {
                return "[object Generator]";
              }),
              (t.keys = function (t) {
                var e = Object(t),
                  r = [];
                for (var n in e) r.push(n);
                return (
                  r.reverse(),
                  function t() {
                    for (; r.length; ) {
                      var n = r.pop();
                      if (n in e) return (t.value = n), (t.done = !1), t;
                    }
                    return (t.done = !0), t;
                  }
                );
              }),
              (t.values = P),
              (k.prototype = {
                constructor: k,
                reset: function (t) {
                  if (
                    ((this.prev = 0),
                    (this.next = 0),
                    (this.sent = this._sent = void 0),
                    (this.done = !1),
                    (this.delegate = null),
                    (this.method = "next"),
                    (this.arg = void 0),
                    this.tryEntries.forEach(S),
                    !t)
                  )
                    for (var e in this)
                      "t" === e.charAt(0) &&
                        r.call(this, e) &&
                        !isNaN(+e.slice(1)) &&
                        (this[e] = void 0);
                },
                stop: function () {
                  this.done = !0;
                  var t = this.tryEntries[0].completion;
                  if ("throw" === t.type) throw t.arg;
                  return this.rval;
                },
                dispatchException: function (t) {
                  if (this.done) throw t;
                  var e = this;
                  function n(r, n) {
                    return (
                      (a.type = "throw"),
                      (a.arg = t),
                      (e.next = r),
                      n && ((e.method = "next"), (e.arg = void 0)),
                      !!n
                    );
                  }
                  for (var o = this.tryEntries.length - 1; o >= 0; --o) {
                    var i = this.tryEntries[o],
                      a = i.completion;
                    if ("root" === i.tryLoc) return n("end");
                    if (i.tryLoc <= this.prev) {
                      var c = r.call(i, "catchLoc"),
                        u = r.call(i, "finallyLoc");
                      if (c && u) {
                        if (this.prev < i.catchLoc) return n(i.catchLoc, !0);
                        if (this.prev < i.finallyLoc) return n(i.finallyLoc);
                      } else if (c) {
                        if (this.prev < i.catchLoc) return n(i.catchLoc, !0);
                      } else {
                        if (!u)
                          throw new Error(
                            "try statement without catch or finally"
                          );
                        if (this.prev < i.finallyLoc) return n(i.finallyLoc);
                      }
                    }
                  }
                },
                abrupt: function (t, e) {
                  for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                    var o = this.tryEntries[n];
                    if (
                      o.tryLoc <= this.prev &&
                      r.call(o, "finallyLoc") &&
                      this.prev < o.finallyLoc
                    ) {
                      var i = o;
                      break;
                    }
                  }
                  i &&
                    ("break" === t || "continue" === t) &&
                    i.tryLoc <= e &&
                    e <= i.finallyLoc &&
                    (i = null);
                  var a = i ? i.completion : {};
                  return (
                    (a.type = t),
                    (a.arg = e),
                    i
                      ? ((this.method = "next"), (this.next = i.finallyLoc), h)
                      : this.complete(a)
                  );
                },
                complete: function (t, e) {
                  if ("throw" === t.type) throw t.arg;
                  return (
                    "break" === t.type || "continue" === t.type
                      ? (this.next = t.arg)
                      : "return" === t.type
                      ? ((this.rval = this.arg = t.arg),
                        (this.method = "return"),
                        (this.next = "end"))
                      : "normal" === t.type && e && (this.next = e),
                    h
                  );
                },
                finish: function (t) {
                  for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var r = this.tryEntries[e];
                    if (r.finallyLoc === t)
                      return this.complete(r.completion, r.afterLoc), S(r), h;
                  }
                },
                catch: function (t) {
                  for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var r = this.tryEntries[e];
                    if (r.tryLoc === t) {
                      var n = r.completion;
                      if ("throw" === n.type) {
                        var o = n.arg;
                        S(r);
                      }
                      return o;
                    }
                  }
                  throw new Error("illegal catch attempt");
                },
                delegateYield: function (t, e, r) {
                  return (
                    (this.delegate = {
                      iterator: P(t),
                      resultName: e,
                      nextLoc: r,
                    }),
                    "next" === this.method && (this.arg = void 0),
                    h
                  );
                },
              }),
              t
            );
          }
          function a(t, e) {
            var r = Object.keys(t);
            if (Object.getOwnPropertySymbols) {
              var n = Object.getOwnPropertySymbols(t);
              e &&
                (n = n.filter(function (e) {
                  return Object.getOwnPropertyDescriptor(t, e).enumerable;
                })),
                r.push.apply(r, n);
            }
            return r;
          }
          function c(t) {
            for (var e = 1; e < arguments.length; e++) {
              var r = null != arguments[e] ? arguments[e] : {};
              e % 2
                ? a(Object(r), !0).forEach(function (e) {
                    u(t, e, r[e]);
                  })
                : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    t,
                    Object.getOwnPropertyDescriptors(r)
                  )
                : a(Object(r)).forEach(function (e) {
                    Object.defineProperty(
                      t,
                      e,
                      Object.getOwnPropertyDescriptor(r, e)
                    );
                  });
            }
            return t;
          }
          function u(t, e, r) {
            return (
              (e = (function (t) {
                var e = (function (t, e) {
                  if ("object" !== n(t) || null === t) return t;
                  var r = t[Symbol.toPrimitive];
                  if (void 0 !== r) {
                    var o = r.call(t, "string");
                    if ("object" !== n(o)) return o;
                    throw new TypeError(
                      "@@toPrimitive must return a primitive value."
                    );
                  }
                  return String(t);
                })(t);
                return "symbol" === n(e) ? e : String(e);
              })(e)) in t
                ? Object.defineProperty(t, e, {
                    value: r,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                  })
                : (t[e] = r),
              t
            );
          }
          function s(t, e) {
            if (null == t) return {};
            var r,
              n,
              o = (function (t, e) {
                if (null == t) return {};
                var r,
                  n,
                  o = {},
                  i = Object.keys(t);
                for (n = 0; n < i.length; n++)
                  (r = i[n]), e.indexOf(r) >= 0 || (o[r] = t[r]);
                return o;
              })(t, e);
            if (Object.getOwnPropertySymbols) {
              var i = Object.getOwnPropertySymbols(t);
              for (n = 0; n < i.length; n++)
                (r = i[n]),
                  e.indexOf(r) >= 0 ||
                    (Object.prototype.propertyIsEnumerable.call(t, r) &&
                      (o[r] = t[r]));
            }
            return o;
          }
          function l(t, e, r, n, o, i, a) {
            try {
              var c = t[i](a),
                u = c.value;
            } catch (t) {
              return void r(t);
            }
            c.done ? e(u) : Promise.resolve(u).then(n, o);
          }
          function f(t) {
            return function () {
              var e = this,
                r = arguments;
              return new Promise(function (n, o) {
                var i = t.apply(e, r);
                function a(t) {
                  l(i, n, o, a, c, "next", t);
                }
                function c(t) {
                  l(i, n, o, a, c, "throw", t);
                }
                a(void 0);
              });
            };
          }
          var p = r(187),
            h = r(549),
            y = r(106),
            d = r(185).log,
            v = r(313),
            g = r(847),
            m = r(581),
            b = m.defaultOptions,
            w = m.spawnWorker,
            x = m.terminateWorker,
            L = m.onMessage,
            O = m.loadImage,
            E = m.send,
            j = 0;
          t.exports = f(
            i().mark(function t() {
              var e,
                r,
                n,
                a,
                u,
                l,
                m,
                S,
                k,
                P,
                _,
                T,
                N,
                A,
                G,
                I,
                F,
                R,
                D,
                M,
                C,
                U,
                Y,
                z,
                B,
                H,
                K,
                W,
                J,
                V,
                Z,
                q,
                Q,
                X,
                $,
                tt,
                et,
                rt,
                nt,
                ot,
                it = arguments;
              return i().wrap(function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      return (
                        (e = it.length > 0 && void 0 !== it[0] ? it[0] : "eng"),
                        (r =
                          it.length > 1 && void 0 !== it[1]
                            ? it[1]
                            : g.LSTM_ONLY),
                        (n = it.length > 2 && void 0 !== it[2] ? it[2] : {}),
                        (a = it.length > 3 && void 0 !== it[3] ? it[3] : {}),
                        (u = v("Worker", j)),
                        (l = p(c(c({}, b), n))),
                        (m = l.logger),
                        (S = l.errorHandler),
                        (k = s(l, o)),
                        (P = {}),
                        (_ = {}),
                        (T = "string" == typeof e ? e.split("+") : e),
                        (N = r),
                        (A = a),
                        (G =
                          [g.DEFAULT, g.LSTM_ONLY].includes(r) &&
                          !k.legacyCore),
                        (R = new Promise(function (t, e) {
                          (F = t), (I = e);
                        })),
                        (D = function (t) {
                          I(t.message);
                        }),
                        ((M = w(k)).onerror = D),
                        (j += 1),
                        (C = function (t, e) {
                          P[t] = e;
                        }),
                        (U = function (t, e) {
                          _[t] = e;
                        }),
                        (Y = function (t) {
                          var e = t.id,
                            r = t.action,
                            n = t.payload;
                          return new Promise(function (t, o) {
                            d(
                              "["
                                .concat(u, "]: Start ")
                                .concat(e, ", action=")
                                .concat(r)
                            ),
                              C(r, t),
                              U(r, o),
                              E(M, {
                                workerId: u,
                                jobId: e,
                                action: r,
                                payload: n,
                              });
                          });
                        }),
                        (z = function () {
                          return console.warn(
                            "`load` is depreciated and should be removed from code (workers now come pre-loaded)"
                          );
                        }),
                        (B = function (t) {
                          return Y(
                            y({
                              id: t,
                              action: "load",
                              payload: {
                                options: {
                                  lstmOnly: G,
                                  corePath: k.corePath,
                                  logging: k.logging,
                                },
                              },
                            })
                          );
                        }),
                        (H = function (t, e, r) {
                          return Y(
                            y({
                              id: r,
                              action: "FS",
                              payload: { method: "writeFile", args: [t, e] },
                            })
                          );
                        }),
                        (K = function (t, e) {
                          return Y(
                            y({
                              id: e,
                              action: "FS",
                              payload: {
                                method: "readFile",
                                args: [t, { encoding: "utf8" }],
                              },
                            })
                          );
                        }),
                        (W = function (t, e) {
                          return Y(
                            y({
                              id: e,
                              action: "FS",
                              payload: { method: "unlink", args: [t] },
                            })
                          );
                        }),
                        (J = function (t, e, r) {
                          return Y(
                            y({
                              id: r,
                              action: "FS",
                              payload: { method: t, args: e },
                            })
                          );
                        }),
                        (V = function () {
                          return console.warn(
                            "`loadLanguage` is depreciated and should be removed from code (workers now come with language pre-loaded)"
                          );
                        }),
                        (Z = function (t, e) {
                          return Y(
                            y({
                              id: e,
                              action: "loadLanguage",
                              payload: {
                                langs: t,
                                options: {
                                  langPath: k.langPath,
                                  dataPath: k.dataPath,
                                  cachePath: k.cachePath,
                                  cacheMethod: k.cacheMethod,
                                  gzip: k.gzip,
                                  lstmOnly:
                                    [
                                      g.LSTM_ONLY,
                                      g.TESSERACT_LSTM_COMBINED,
                                    ].includes(N) && !k.legacyLang,
                                },
                              },
                            })
                          );
                        }),
                        (q = function () {
                          return console.warn(
                            "`initialize` is depreciated and should be removed from code (workers now come pre-initialized)"
                          );
                        }),
                        (Q = function (t, e, r, n) {
                          return Y(
                            y({
                              id: n,
                              action: "initialize",
                              payload: { langs: t, oem: e, config: r },
                            })
                          );
                        }),
                        (X = function () {
                          var t =
                              arguments.length > 0 && void 0 !== arguments[0]
                                ? arguments[0]
                                : "eng",
                            e = arguments.length > 1 ? arguments[1] : void 0,
                            r = arguments.length > 2 ? arguments[2] : void 0,
                            n = arguments.length > 3 ? arguments[3] : void 0;
                          if (
                            G &&
                            [
                              g.TESSERACT_ONLY,
                              g.TESSERACT_LSTM_COMBINED,
                            ].includes(e)
                          )
                            throw Error(
                              "Legacy model requested but code missing."
                            );
                          var o = e || N;
                          N = o;
                          var i = r || A;
                          A = i;
                          var a = (
                            "string" == typeof t ? t.split("+") : t
                          ).filter(function (t) {
                            return !T.includes(t);
                          });
                          return (
                            T.push(a),
                            Z(a, n).then(function () {
                              return Q(t, o, i, n);
                            })
                          );
                        }),
                        ($ = function () {
                          return Y(
                            y({
                              id: arguments.length > 1 ? arguments[1] : void 0,
                              action: "setParameters",
                              payload: {
                                params:
                                  arguments.length > 0 &&
                                  void 0 !== arguments[0]
                                    ? arguments[0]
                                    : {},
                              },
                            })
                          );
                        }),
                        (tt = (function () {
                          var t = f(
                            i().mark(function t(e) {
                              var r,
                                n,
                                o,
                                a = arguments;
                              return i().wrap(function (t) {
                                for (;;)
                                  switch ((t.prev = t.next)) {
                                    case 0:
                                      return (
                                        (r =
                                          a.length > 1 && void 0 !== a[1]
                                            ? a[1]
                                            : {}),
                                        (n =
                                          a.length > 2 && void 0 !== a[2]
                                            ? a[2]
                                            : {
                                                blocks: !0,
                                                text: !0,
                                                hocr: !0,
                                                tsv: !0,
                                              }),
                                        (o = a.length > 3 ? a[3] : void 0),
                                        (t.t0 = Y),
                                        (t.t1 = y),
                                        (t.t2 = o),
                                        (t.next = 8),
                                        O(e)
                                      );
                                    case 8:
                                      return (
                                        (t.t3 = t.sent),
                                        (t.t4 = r),
                                        (t.t5 = n),
                                        (t.t6 = {
                                          image: t.t3,
                                          options: t.t4,
                                          output: t.t5,
                                        }),
                                        (t.t7 = {
                                          id: t.t2,
                                          action: "recognize",
                                          payload: t.t6,
                                        }),
                                        (t.t8 = (0, t.t1)(t.t7)),
                                        t.abrupt("return", (0, t.t0)(t.t8))
                                      );
                                    case 15:
                                    case "end":
                                      return t.stop();
                                  }
                              }, t);
                            })
                          );
                          return function (e) {
                            return t.apply(this, arguments);
                          };
                        })()),
                        (et = function () {
                          var t =
                              arguments.length > 0 && void 0 !== arguments[0]
                                ? arguments[0]
                                : "Tesseract OCR Result",
                            e =
                              arguments.length > 1 &&
                              void 0 !== arguments[1] &&
                              arguments[1],
                            r = arguments.length > 2 ? arguments[2] : void 0;
                          return (
                            console.log(
                              "`getPDF` function is depreciated. `recognize` option `savePDF` should be used instead."
                            ),
                            Y(
                              y({
                                id: r,
                                action: "getPDF",
                                payload: { title: t, textonly: e },
                              })
                            )
                          );
                        }),
                        (rt = (function () {
                          var t = f(
                            i().mark(function t(e, r) {
                              return i().wrap(function (t) {
                                for (;;)
                                  switch ((t.prev = t.next)) {
                                    case 0:
                                      if (!G) {
                                        t.next = 2;
                                        break;
                                      }
                                      throw Error(
                                        "`worker.detect` requires Legacy model, which was not loaded."
                                      );
                                    case 2:
                                      return (
                                        (t.t0 = Y),
                                        (t.t1 = y),
                                        (t.t2 = r),
                                        (t.next = 7),
                                        O(e)
                                      );
                                    case 7:
                                      return (
                                        (t.t3 = t.sent),
                                        (t.t4 = { image: t.t3 }),
                                        (t.t5 = {
                                          id: t.t2,
                                          action: "detect",
                                          payload: t.t4,
                                        }),
                                        (t.t6 = (0, t.t1)(t.t5)),
                                        t.abrupt("return", (0, t.t0)(t.t6))
                                      );
                                    case 12:
                                    case "end":
                                      return t.stop();
                                  }
                              }, t);
                            })
                          );
                          return function (e, r) {
                            return t.apply(this, arguments);
                          };
                        })()),
                        (nt = (function () {
                          var t = f(
                            i().mark(function t() {
                              return i().wrap(function (t) {
                                for (;;)
                                  switch ((t.prev = t.next)) {
                                    case 0:
                                      return (
                                        null !== M && (x(M), (M = null)),
                                        t.abrupt("return", Promise.resolve())
                                      );
                                    case 2:
                                    case "end":
                                      return t.stop();
                                  }
                              }, t);
                            })
                          );
                          return function () {
                            return t.apply(this, arguments);
                          };
                        })()),
                        L(M, function (t) {
                          var e = t.workerId,
                            r = t.jobId,
                            n = t.status,
                            o = t.action,
                            i = t.data;
                          if ("resolve" === n) {
                            d("[".concat(e, "]: Complete ").concat(r));
                            var a = i;
                            "recognize" === o
                              ? (a = h(i))
                              : "getPDF" === o &&
                                (a = Array.from(
                                  c(
                                    c({}, i),
                                    {},
                                    { length: Object.keys(i).length }
                                  )
                                )),
                              P[o]({ jobId: r, data: a });
                          } else if ("reject" === n) {
                            if ((_[o](i), "load" === o && I(i), !S))
                              throw Error(i);
                            S(i);
                          } else
                            "progress" === n &&
                              m(c(c({}, i), {}, { userJobId: r }));
                        }),
                        (ot = {
                          id: u,
                          worker: M,
                          setResolve: C,
                          setReject: U,
                          load: z,
                          writeText: H,
                          readText: K,
                          removeFile: W,
                          FS: J,
                          loadLanguage: V,
                          initialize: q,
                          reinitialize: X,
                          setParameters: $,
                          recognize: tt,
                          getPDF: et,
                          detect: rt,
                          terminate: nt,
                        }),
                        B()
                          .then(function () {
                            return Z(e);
                          })
                          .then(function () {
                            return Q(e, r, a);
                          })
                          .then(function () {
                            return F(ot);
                          })
                          .catch(function () {}),
                        t.abrupt("return", R)
                      );
                    case 40:
                    case "end":
                      return t.stop();
                  }
              }, t);
            })
          );
        },
        352: (t, e, r) => {
          function n(t) {
            return (
              (n =
                "function" == typeof Symbol &&
                "symbol" == typeof Symbol.iterator
                  ? function (t) {
                      return typeof t;
                    }
                  : function (t) {
                      return t &&
                        "function" == typeof Symbol &&
                        t.constructor === Symbol &&
                        t !== Symbol.prototype
                        ? "symbol"
                        : typeof t;
                    }),
              n(t)
            );
          }
          function o(t, e) {
            var r = Object.keys(t);
            if (Object.getOwnPropertySymbols) {
              var n = Object.getOwnPropertySymbols(t);
              e &&
                (n = n.filter(function (e) {
                  return Object.getOwnPropertyDescriptor(t, e).enumerable;
                })),
                r.push.apply(r, n);
            }
            return r;
          }
          function i(t, e, r) {
            return (
              (e = (function (t) {
                var e = (function (t, e) {
                  if ("object" !== n(t) || null === t) return t;
                  var r = t[Symbol.toPrimitive];
                  if (void 0 !== r) {
                    var o = r.call(t, "string");
                    if ("object" !== n(o)) return o;
                    throw new TypeError(
                      "@@toPrimitive must return a primitive value."
                    );
                  }
                  return String(t);
                })(t);
                return "symbol" === n(e) ? e : String(e);
              })(e)) in t
                ? Object.defineProperty(t, e, {
                    value: r,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                  })
                : (t[e] = r),
              t
            );
          }
          r(760);
          var a = r(936),
            c = r(311),
            u = r(793),
            s = r(5),
            l = r(847),
            f = r(711),
            p = r(185).setLogging;
          t.exports = (function (t) {
            for (var e = 1; e < arguments.length; e++) {
              var r = null != arguments[e] ? arguments[e] : {};
              e % 2
                ? o(Object(r), !0).forEach(function (e) {
                    i(t, e, r[e]);
                  })
                : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    t,
                    Object.getOwnPropertyDescriptors(r)
                  )
                : o(Object(r)).forEach(function (e) {
                    Object.defineProperty(
                      t,
                      e,
                      Object.getOwnPropertyDescriptor(r, e)
                    );
                  });
            }
            return t;
          })(
            {
              languages: s,
              OEM: l,
              PSM: f,
              createScheduler: a,
              createWorker: c,
              setLogging: p,
            },
            u
          );
        },
        549: (t) => {
          function e(t) {
            return (
              (e =
                "function" == typeof Symbol &&
                "symbol" == typeof Symbol.iterator
                  ? function (t) {
                      return typeof t;
                    }
                  : function (t) {
                      return t &&
                        "function" == typeof Symbol &&
                        t.constructor === Symbol &&
                        t !== Symbol.prototype
                        ? "symbol"
                        : typeof t;
                    }),
              e(t)
            );
          }
          function r(t, e) {
            var r = Object.keys(t);
            if (Object.getOwnPropertySymbols) {
              var n = Object.getOwnPropertySymbols(t);
              e &&
                (n = n.filter(function (e) {
                  return Object.getOwnPropertyDescriptor(t, e).enumerable;
                })),
                r.push.apply(r, n);
            }
            return r;
          }
          function n(t) {
            for (var e = 1; e < arguments.length; e++) {
              var n = null != arguments[e] ? arguments[e] : {};
              e % 2
                ? r(Object(n), !0).forEach(function (e) {
                    o(t, e, n[e]);
                  })
                : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    t,
                    Object.getOwnPropertyDescriptors(n)
                  )
                : r(Object(n)).forEach(function (e) {
                    Object.defineProperty(
                      t,
                      e,
                      Object.getOwnPropertyDescriptor(n, e)
                    );
                  });
            }
            return t;
          }
          function o(t, r, n) {
            return (
              (r = (function (t) {
                var r = (function (t, r) {
                  if ("object" !== e(t) || null === t) return t;
                  var n = t[Symbol.toPrimitive];
                  if (void 0 !== n) {
                    var o = n.call(t, "string");
                    if ("object" !== e(o)) return o;
                    throw new TypeError(
                      "@@toPrimitive must return a primitive value."
                    );
                  }
                  return String(t);
                })(t);
                return "symbol" === e(r) ? r : String(r);
              })(r)) in t
                ? Object.defineProperty(t, r, {
                    value: n,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                  })
                : (t[r] = n),
              t
            );
          }
          t.exports = function (t) {
            var e = [],
              r = [],
              o = [],
              i = [],
              a = [];
            return (
              t.blocks &&
                t.blocks.forEach(function (c) {
                  c.paragraphs.forEach(function (e) {
                    e.lines.forEach(function (r) {
                      r.words.forEach(function (o) {
                        o.symbols.forEach(function (i) {
                          a.push(
                            n(
                              n({}, i),
                              {},
                              {
                                page: t,
                                block: c,
                                paragraph: e,
                                line: r,
                                word: o,
                              }
                            )
                          );
                        }),
                          i.push(
                            n(
                              n({}, o),
                              {},
                              { page: t, block: c, paragraph: e, line: r }
                            )
                          );
                      }),
                        o.push(
                          n(n({}, r), {}, { page: t, block: c, paragraph: e })
                        );
                    }),
                      r.push(n(n({}, e), {}, { page: t, block: c }));
                  }),
                    e.push(n(n({}, c), {}, { page: t }));
                }),
              n(
                n({}, t),
                {},
                { blocks: e, paragraphs: r, lines: o, words: i, symbols: a }
              )
            );
          };
        },
        129: (t, e, r) => {
          function n(t) {
            return (
              (n =
                "function" == typeof Symbol &&
                "symbol" == typeof Symbol.iterator
                  ? function (t) {
                      return typeof t;
                    }
                  : function (t) {
                      return t &&
                        "function" == typeof Symbol &&
                        t.constructor === Symbol &&
                        t !== Symbol.prototype
                        ? "symbol"
                        : typeof t;
                    }),
              n(t)
            );
          }
          var o = r(670);
          t.exports = function (t) {
            var e = {};
            return (
              "undefined" != typeof WorkerGlobalScope
                ? (e.type = "webworker")
                : o()
                ? (e.type = "electron")
                : "object" ===
                  ("undefined" == typeof document ? "undefined" : n(document))
                ? (e.type = "browser")
                : "object" ===
                    ("undefined" == typeof process
                      ? "undefined"
                      : n(process)) && (e.type = "node"),
              void 0 === t ? e : e[t]
            );
          };
        },
        313: (t) => {
          t.exports = function (t, e) {
            return ""
              .concat(t, "-")
              .concat(e, "-")
              .concat(Math.random().toString(16).slice(3, 8));
          };
        },
        185: function (t, e) {
          var r = this,
            n = !1;
          (e.logging = n),
            (e.setLogging = function (t) {
              n = t;
            }),
            (e.log = function () {
              for (
                var t = arguments.length, e = new Array(t), o = 0;
                o < t;
                o++
              )
                e[o] = arguments[o];
              return n ? console.log.apply(r, e) : null;
            });
        },
        187: (t, e, r) => {
          function n(t) {
            return (
              (n =
                "function" == typeof Symbol &&
                "symbol" == typeof Symbol.iterator
                  ? function (t) {
                      return typeof t;
                    }
                  : function (t) {
                      return t &&
                        "function" == typeof Symbol &&
                        t.constructor === Symbol &&
                        t !== Symbol.prototype
                        ? "symbol"
                        : typeof t;
                    }),
              n(t)
            );
          }
          function o(t, e) {
            var r = Object.keys(t);
            if (Object.getOwnPropertySymbols) {
              var n = Object.getOwnPropertySymbols(t);
              e &&
                (n = n.filter(function (e) {
                  return Object.getOwnPropertyDescriptor(t, e).enumerable;
                })),
                r.push.apply(r, n);
            }
            return r;
          }
          function i(t, e, r) {
            return (
              (e = (function (t) {
                var e = (function (t, e) {
                  if ("object" !== n(t) || null === t) return t;
                  var r = t[Symbol.toPrimitive];
                  if (void 0 !== r) {
                    var o = r.call(t, "string");
                    if ("object" !== n(o)) return o;
                    throw new TypeError(
                      "@@toPrimitive must return a primitive value."
                    );
                  }
                  return String(t);
                })(t);
                return "symbol" === n(e) ? e : String(e);
              })(e)) in t
                ? Object.defineProperty(t, e, {
                    value: r,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                  })
                : (t[e] = r),
              t
            );
          }
          var a =
            "browser" === r(129)("type")
              ? function (t) {
                  return new URL(t, window.location.href).href;
                }
              : function (t) {
                  return t;
                };
          t.exports = function (t) {
            var e = (function (t) {
              for (var e = 1; e < arguments.length; e++) {
                var r = null != arguments[e] ? arguments[e] : {};
                e % 2
                  ? o(Object(r), !0).forEach(function (e) {
                      i(t, e, r[e]);
                    })
                  : Object.getOwnPropertyDescriptors
                  ? Object.defineProperties(
                      t,
                      Object.getOwnPropertyDescriptors(r)
                    )
                  : o(Object(r)).forEach(function (e) {
                      Object.defineProperty(
                        t,
                        e,
                        Object.getOwnPropertyDescriptor(r, e)
                      );
                    });
              }
              return t;
            })({}, t);
            return (
              ["corePath", "workerPath", "langPath"].forEach(function (r) {
                t[r] && (e[r] = a(e[r]));
              }),
              e
            );
          };
        },
        854: (t, e, r) => {
          function n(t) {
            return (
              (n =
                "function" == typeof Symbol &&
                "symbol" == typeof Symbol.iterator
                  ? function (t) {
                      return typeof t;
                    }
                  : function (t) {
                      return t &&
                        "function" == typeof Symbol &&
                        t.constructor === Symbol &&
                        t !== Symbol.prototype
                        ? "symbol"
                        : typeof t;
                    }),
              n(t)
            );
          }
          function o(t, e) {
            var r = Object.keys(t);
            if (Object.getOwnPropertySymbols) {
              var n = Object.getOwnPropertySymbols(t);
              e &&
                (n = n.filter(function (e) {
                  return Object.getOwnPropertyDescriptor(t, e).enumerable;
                })),
                r.push.apply(r, n);
            }
            return r;
          }
          function i(t) {
            for (var e = 1; e < arguments.length; e++) {
              var r = null != arguments[e] ? arguments[e] : {};
              e % 2
                ? o(Object(r), !0).forEach(function (e) {
                    a(t, e, r[e]);
                  })
                : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    t,
                    Object.getOwnPropertyDescriptors(r)
                  )
                : o(Object(r)).forEach(function (e) {
                    Object.defineProperty(
                      t,
                      e,
                      Object.getOwnPropertyDescriptor(r, e)
                    );
                  });
            }
            return t;
          }
          function a(t, e, r) {
            return (
              (e = (function (t) {
                var e = (function (t, e) {
                  if ("object" !== n(t) || null === t) return t;
                  var r = t[Symbol.toPrimitive];
                  if (void 0 !== r) {
                    var o = r.call(t, "string");
                    if ("object" !== n(o)) return o;
                    throw new TypeError(
                      "@@toPrimitive must return a primitive value."
                    );
                  }
                  return String(t);
                })(t);
                return "symbol" === n(e) ? e : String(e);
              })(e)) in t
                ? Object.defineProperty(t, e, {
                    value: r,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                  })
                : (t[e] = r),
              t
            );
          }
          var c = r(147).version,
            u = r(341);
          t.exports = i(
            i({}, u),
            {},
            {
              workerPath: "https://cdn.jsdelivr.net/npm/tesseract.js@v".concat(
                c,
                "/dist/worker.min.js"
              ),
            }
          );
        },
        581: (t, e, r) => {
          var n = r(854),
            o = r(676),
            i = r(100),
            a = r(202),
            c = r(772),
            u = r(931);
          t.exports = {
            defaultOptions: n,
            spawnWorker: o,
            terminateWorker: i,
            onMessage: a,
            send: c,
            loadImage: u,
          };
        },
        931: (t) => {
          function e(t) {
            return (
              (e =
                "function" == typeof Symbol &&
                "symbol" == typeof Symbol.iterator
                  ? function (t) {
                      return typeof t;
                    }
                  : function (t) {
                      return t &&
                        "function" == typeof Symbol &&
                        t.constructor === Symbol &&
                        t !== Symbol.prototype
                        ? "symbol"
                        : typeof t;
                    }),
              e(t)
            );
          }
          function r() {
            "use strict";
            r = function () {
              return t;
            };
            var t = {},
              n = Object.prototype,
              o = n.hasOwnProperty,
              i =
                Object.defineProperty ||
                function (t, e, r) {
                  t[e] = r.value;
                },
              a = "function" == typeof Symbol ? Symbol : {},
              c = a.iterator || "@@iterator",
              u = a.asyncIterator || "@@asyncIterator",
              s = a.toStringTag || "@@toStringTag";
            function l(t, e, r) {
              return (
                Object.defineProperty(t, e, {
                  value: r,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                }),
                t[e]
              );
            }
            try {
              l({}, "");
            } catch (t) {
              l = function (t, e, r) {
                return (t[e] = r);
              };
            }
            function f(t, e, r, n) {
              var o = e && e.prototype instanceof y ? e : y,
                a = Object.create(o.prototype),
                c = new k(n || []);
              return i(a, "_invoke", { value: O(t, r, c) }), a;
            }
            function p(t, e, r) {
              try {
                return { type: "normal", arg: t.call(e, r) };
              } catch (t) {
                return { type: "throw", arg: t };
              }
            }
            t.wrap = f;
            var h = {};
            function y() {}
            function d() {}
            function v() {}
            var g = {};
            l(g, c, function () {
              return this;
            });
            var m = Object.getPrototypeOf,
              b = m && m(m(P([])));
            b && b !== n && o.call(b, c) && (g = b);
            var w = (v.prototype = y.prototype = Object.create(g));
            function x(t) {
              ["next", "throw", "return"].forEach(function (e) {
                l(t, e, function (t) {
                  return this._invoke(e, t);
                });
              });
            }
            function L(t, r) {
              function n(i, a, c, u) {
                var s = p(t[i], t, a);
                if ("throw" !== s.type) {
                  var l = s.arg,
                    f = l.value;
                  return f && "object" == e(f) && o.call(f, "__await")
                    ? r.resolve(f.__await).then(
                        function (t) {
                          n("next", t, c, u);
                        },
                        function (t) {
                          n("throw", t, c, u);
                        }
                      )
                    : r.resolve(f).then(
                        function (t) {
                          (l.value = t), c(l);
                        },
                        function (t) {
                          return n("throw", t, c, u);
                        }
                      );
                }
                u(s.arg);
              }
              var a;
              i(this, "_invoke", {
                value: function (t, e) {
                  function o() {
                    return new r(function (r, o) {
                      n(t, e, r, o);
                    });
                  }
                  return (a = a ? a.then(o, o) : o());
                },
              });
            }
            function O(t, e, r) {
              var n = "suspendedStart";
              return function (o, i) {
                if ("executing" === n)
                  throw new Error("Generator is already running");
                if ("completed" === n) {
                  if ("throw" === o) throw i;
                  return { value: void 0, done: !0 };
                }
                for (r.method = o, r.arg = i; ; ) {
                  var a = r.delegate;
                  if (a) {
                    var c = E(a, r);
                    if (c) {
                      if (c === h) continue;
                      return c;
                    }
                  }
                  if ("next" === r.method) r.sent = r._sent = r.arg;
                  else if ("throw" === r.method) {
                    if ("suspendedStart" === n)
                      throw ((n = "completed"), r.arg);
                    r.dispatchException(r.arg);
                  } else "return" === r.method && r.abrupt("return", r.arg);
                  n = "executing";
                  var u = p(t, e, r);
                  if ("normal" === u.type) {
                    if (
                      ((n = r.done ? "completed" : "suspendedYield"),
                      u.arg === h)
                    )
                      continue;
                    return { value: u.arg, done: r.done };
                  }
                  "throw" === u.type &&
                    ((n = "completed"), (r.method = "throw"), (r.arg = u.arg));
                }
              };
            }
            function E(t, e) {
              var r = e.method,
                n = t.iterator[r];
              if (void 0 === n)
                return (
                  (e.delegate = null),
                  ("throw" === r &&
                    t.iterator.return &&
                    ((e.method = "return"),
                    (e.arg = void 0),
                    E(t, e),
                    "throw" === e.method)) ||
                    ("return" !== r &&
                      ((e.method = "throw"),
                      (e.arg = new TypeError(
                        "The iterator does not provide a '" + r + "' method"
                      )))),
                  h
                );
              var o = p(n, t.iterator, e.arg);
              if ("throw" === o.type)
                return (
                  (e.method = "throw"), (e.arg = o.arg), (e.delegate = null), h
                );
              var i = o.arg;
              return i
                ? i.done
                  ? ((e[t.resultName] = i.value),
                    (e.next = t.nextLoc),
                    "return" !== e.method &&
                      ((e.method = "next"), (e.arg = void 0)),
                    (e.delegate = null),
                    h)
                  : i
                : ((e.method = "throw"),
                  (e.arg = new TypeError("iterator result is not an object")),
                  (e.delegate = null),
                  h);
            }
            function j(t) {
              var e = { tryLoc: t[0] };
              1 in t && (e.catchLoc = t[1]),
                2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
                this.tryEntries.push(e);
            }
            function S(t) {
              var e = t.completion || {};
              (e.type = "normal"), delete e.arg, (t.completion = e);
            }
            function k(t) {
              (this.tryEntries = [{ tryLoc: "root" }]),
                t.forEach(j, this),
                this.reset(!0);
            }
            function P(t) {
              if (t) {
                var e = t[c];
                if (e) return e.call(t);
                if ("function" == typeof t.next) return t;
                if (!isNaN(t.length)) {
                  var r = -1,
                    n = function e() {
                      for (; ++r < t.length; )
                        if (o.call(t, r))
                          return (e.value = t[r]), (e.done = !1), e;
                      return (e.value = void 0), (e.done = !0), e;
                    };
                  return (n.next = n);
                }
              }
              return { next: _ };
            }
            function _() {
              return { value: void 0, done: !0 };
            }
            return (
              (d.prototype = v),
              i(w, "constructor", { value: v, configurable: !0 }),
              i(v, "constructor", { value: d, configurable: !0 }),
              (d.displayName = l(v, s, "GeneratorFunction")),
              (t.isGeneratorFunction = function (t) {
                var e = "function" == typeof t && t.constructor;
                return (
                  !!e &&
                  (e === d || "GeneratorFunction" === (e.displayName || e.name))
                );
              }),
              (t.mark = function (t) {
                return (
                  Object.setPrototypeOf
                    ? Object.setPrototypeOf(t, v)
                    : ((t.__proto__ = v), l(t, s, "GeneratorFunction")),
                  (t.prototype = Object.create(w)),
                  t
                );
              }),
              (t.awrap = function (t) {
                return { __await: t };
              }),
              x(L.prototype),
              l(L.prototype, u, function () {
                return this;
              }),
              (t.AsyncIterator = L),
              (t.async = function (e, r, n, o, i) {
                void 0 === i && (i = Promise);
                var a = new L(f(e, r, n, o), i);
                return t.isGeneratorFunction(r)
                  ? a
                  : a.next().then(function (t) {
                      return t.done ? t.value : a.next();
                    });
              }),
              x(w),
              l(w, s, "Generator"),
              l(w, c, function () {
                return this;
              }),
              l(w, "toString", function () {
                return "[object Generator]";
              }),
              (t.keys = function (t) {
                var e = Object(t),
                  r = [];
                for (var n in e) r.push(n);
                return (
                  r.reverse(),
                  function t() {
                    for (; r.length; ) {
                      var n = r.pop();
                      if (n in e) return (t.value = n), (t.done = !1), t;
                    }
                    return (t.done = !0), t;
                  }
                );
              }),
              (t.values = P),
              (k.prototype = {
                constructor: k,
                reset: function (t) {
                  if (
                    ((this.prev = 0),
                    (this.next = 0),
                    (this.sent = this._sent = void 0),
                    (this.done = !1),
                    (this.delegate = null),
                    (this.method = "next"),
                    (this.arg = void 0),
                    this.tryEntries.forEach(S),
                    !t)
                  )
                    for (var e in this)
                      "t" === e.charAt(0) &&
                        o.call(this, e) &&
                        !isNaN(+e.slice(1)) &&
                        (this[e] = void 0);
                },
                stop: function () {
                  this.done = !0;
                  var t = this.tryEntries[0].completion;
                  if ("throw" === t.type) throw t.arg;
                  return this.rval;
                },
                dispatchException: function (t) {
                  if (this.done) throw t;
                  var e = this;
                  function r(r, n) {
                    return (
                      (a.type = "throw"),
                      (a.arg = t),
                      (e.next = r),
                      n && ((e.method = "next"), (e.arg = void 0)),
                      !!n
                    );
                  }
                  for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                    var i = this.tryEntries[n],
                      a = i.completion;
                    if ("root" === i.tryLoc) return r("end");
                    if (i.tryLoc <= this.prev) {
                      var c = o.call(i, "catchLoc"),
                        u = o.call(i, "finallyLoc");
                      if (c && u) {
                        if (this.prev < i.catchLoc) return r(i.catchLoc, !0);
                        if (this.prev < i.finallyLoc) return r(i.finallyLoc);
                      } else if (c) {
                        if (this.prev < i.catchLoc) return r(i.catchLoc, !0);
                      } else {
                        if (!u)
                          throw new Error(
                            "try statement without catch or finally"
                          );
                        if (this.prev < i.finallyLoc) return r(i.finallyLoc);
                      }
                    }
                  }
                },
                abrupt: function (t, e) {
                  for (var r = this.tryEntries.length - 1; r >= 0; --r) {
                    var n = this.tryEntries[r];
                    if (
                      n.tryLoc <= this.prev &&
                      o.call(n, "finallyLoc") &&
                      this.prev < n.finallyLoc
                    ) {
                      var i = n;
                      break;
                    }
                  }
                  i &&
                    ("break" === t || "continue" === t) &&
                    i.tryLoc <= e &&
                    e <= i.finallyLoc &&
                    (i = null);
                  var a = i ? i.completion : {};
                  return (
                    (a.type = t),
                    (a.arg = e),
                    i
                      ? ((this.method = "next"), (this.next = i.finallyLoc), h)
                      : this.complete(a)
                  );
                },
                complete: function (t, e) {
                  if ("throw" === t.type) throw t.arg;
                  return (
                    "break" === t.type || "continue" === t.type
                      ? (this.next = t.arg)
                      : "return" === t.type
                      ? ((this.rval = this.arg = t.arg),
                        (this.method = "return"),
                        (this.next = "end"))
                      : "normal" === t.type && e && (this.next = e),
                    h
                  );
                },
                finish: function (t) {
                  for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var r = this.tryEntries[e];
                    if (r.finallyLoc === t)
                      return this.complete(r.completion, r.afterLoc), S(r), h;
                  }
                },
                catch: function (t) {
                  for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var r = this.tryEntries[e];
                    if (r.tryLoc === t) {
                      var n = r.completion;
                      if ("throw" === n.type) {
                        var o = n.arg;
                        S(r);
                      }
                      return o;
                    }
                  }
                  throw new Error("illegal catch attempt");
                },
                delegateYield: function (t, e, r) {
                  return (
                    (this.delegate = {
                      iterator: P(t),
                      resultName: e,
                      nextLoc: r,
                    }),
                    "next" === this.method && (this.arg = void 0),
                    h
                  );
                },
              }),
              t
            );
          }
          function n(t, e, r, n, o, i, a) {
            try {
              var c = t[i](a),
                u = c.value;
            } catch (t) {
              return void r(t);
            }
            c.done ? e(u) : Promise.resolve(u).then(n, o);
          }
          function o(t) {
            return function () {
              var e = this,
                r = arguments;
              return new Promise(function (o, i) {
                var a = t.apply(e, r);
                function c(t) {
                  n(a, o, i, c, u, "next", t);
                }
                function u(t) {
                  n(a, o, i, c, u, "throw", t);
                }
                c(void 0);
              });
            };
          }
          var i = function (t) {
              return new Promise(function (e, r) {
                var n = new FileReader();
                (n.onload = function () {
                  e(n.result);
                }),
                  (n.onerror = function (t) {
                    var e = t.target.error.code;
                    r(Error("File could not be read! Code=".concat(e)));
                  }),
                  n.readAsArrayBuffer(t);
              });
            },
            a = (function () {
              var t = o(
                r().mark(function t(e) {
                  var n, c, u;
                  return r().wrap(function (t) {
                    for (;;)
                      switch ((t.prev = t.next)) {
                        case 0:
                          if (((n = e), void 0 !== e)) {
                            t.next = 3;
                            break;
                          }
                          return t.abrupt("return", "undefined");
                        case 3:
                          if ("string" != typeof e) {
                            t.next = 16;
                            break;
                          }
                          if (
                            !/data:image\/([a-zA-Z]*);base64,([^"]*)/.test(e)
                          ) {
                            t.next = 8;
                            break;
                          }
                          (n = atob(e.split(",")[1])
                            .split("")
                            .map(function (t) {
                              return t.charCodeAt(0);
                            })),
                            (t.next = 14);
                          break;
                        case 8:
                          return (t.next = 10), fetch(e);
                        case 10:
                          return (c = t.sent), (t.next = 13), c.arrayBuffer();
                        case 13:
                          n = t.sent;
                        case 14:
                          t.next = 43;
                          break;
                        case 16:
                          if (
                            !(
                              "undefined" != typeof HTMLElement &&
                              e instanceof HTMLElement
                            )
                          ) {
                            t.next = 30;
                            break;
                          }
                          if ("IMG" !== e.tagName) {
                            t.next = 21;
                            break;
                          }
                          return (t.next = 20), a(e.src);
                        case 20:
                          n = t.sent;
                        case 21:
                          if ("VIDEO" !== e.tagName) {
                            t.next = 25;
                            break;
                          }
                          return (t.next = 24), a(e.poster);
                        case 24:
                          n = t.sent;
                        case 25:
                          if ("CANVAS" !== e.tagName) {
                            t.next = 28;
                            break;
                          }
                          return (
                            (t.next = 28),
                            new Promise(function (t) {
                              e.toBlob(
                                (function () {
                                  var e = o(
                                    r().mark(function e(o) {
                                      return r().wrap(function (e) {
                                        for (;;)
                                          switch ((e.prev = e.next)) {
                                            case 0:
                                              return (e.next = 2), i(o);
                                            case 2:
                                              (n = e.sent), t();
                                            case 4:
                                            case "end":
                                              return e.stop();
                                          }
                                      }, e);
                                    })
                                  );
                                  return function (t) {
                                    return e.apply(this, arguments);
                                  };
                                })()
                              );
                            })
                          );
                        case 28:
                          t.next = 43;
                          break;
                        case 30:
                          if (
                            !(
                              "undefined" != typeof OffscreenCanvas &&
                              e instanceof OffscreenCanvas
                            )
                          ) {
                            t.next = 39;
                            break;
                          }
                          return (t.next = 33), e.convertToBlob();
                        case 33:
                          return (u = t.sent), (t.next = 36), i(u);
                        case 36:
                          (n = t.sent), (t.next = 43);
                          break;
                        case 39:
                          if (!(e instanceof File || e instanceof Blob)) {
                            t.next = 43;
                            break;
                          }
                          return (t.next = 42), i(e);
                        case 42:
                          n = t.sent;
                        case 43:
                          return t.abrupt("return", new Uint8Array(n));
                        case 44:
                        case "end":
                          return t.stop();
                      }
                  }, t);
                })
              );
              return function (e) {
                return t.apply(this, arguments);
              };
            })();
          t.exports = a;
        },
        202: (t) => {
          t.exports = function (t, e) {
            t.onmessage = function (t) {
              var r = t.data;
              e(r);
            };
          };
        },
        772: (t) => {
          function e(t) {
            return (
              (e =
                "function" == typeof Symbol &&
                "symbol" == typeof Symbol.iterator
                  ? function (t) {
                      return typeof t;
                    }
                  : function (t) {
                      return t &&
                        "function" == typeof Symbol &&
                        t.constructor === Symbol &&
                        t !== Symbol.prototype
                        ? "symbol"
                        : typeof t;
                    }),
              e(t)
            );
          }
          function r() {
            "use strict";
            r = function () {
              return t;
            };
            var t = {},
              n = Object.prototype,
              o = n.hasOwnProperty,
              i =
                Object.defineProperty ||
                function (t, e, r) {
                  t[e] = r.value;
                },
              a = "function" == typeof Symbol ? Symbol : {},
              c = a.iterator || "@@iterator",
              u = a.asyncIterator || "@@asyncIterator",
              s = a.toStringTag || "@@toStringTag";
            function l(t, e, r) {
              return (
                Object.defineProperty(t, e, {
                  value: r,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                }),
                t[e]
              );
            }
            try {
              l({}, "");
            } catch (t) {
              l = function (t, e, r) {
                return (t[e] = r);
              };
            }
            function f(t, e, r, n) {
              var o = e && e.prototype instanceof y ? e : y,
                a = Object.create(o.prototype),
                c = new k(n || []);
              return i(a, "_invoke", { value: O(t, r, c) }), a;
            }
            function p(t, e, r) {
              try {
                return { type: "normal", arg: t.call(e, r) };
              } catch (t) {
                return { type: "throw", arg: t };
              }
            }
            t.wrap = f;
            var h = {};
            function y() {}
            function d() {}
            function v() {}
            var g = {};
            l(g, c, function () {
              return this;
            });
            var m = Object.getPrototypeOf,
              b = m && m(m(P([])));
            b && b !== n && o.call(b, c) && (g = b);
            var w = (v.prototype = y.prototype = Object.create(g));
            function x(t) {
              ["next", "throw", "return"].forEach(function (e) {
                l(t, e, function (t) {
                  return this._invoke(e, t);
                });
              });
            }
            function L(t, r) {
              function n(i, a, c, u) {
                var s = p(t[i], t, a);
                if ("throw" !== s.type) {
                  var l = s.arg,
                    f = l.value;
                  return f && "object" == e(f) && o.call(f, "__await")
                    ? r.resolve(f.__await).then(
                        function (t) {
                          n("next", t, c, u);
                        },
                        function (t) {
                          n("throw", t, c, u);
                        }
                      )
                    : r.resolve(f).then(
                        function (t) {
                          (l.value = t), c(l);
                        },
                        function (t) {
                          return n("throw", t, c, u);
                        }
                      );
                }
                u(s.arg);
              }
              var a;
              i(this, "_invoke", {
                value: function (t, e) {
                  function o() {
                    return new r(function (r, o) {
                      n(t, e, r, o);
                    });
                  }
                  return (a = a ? a.then(o, o) : o());
                },
              });
            }
            function O(t, e, r) {
              var n = "suspendedStart";
              return function (o, i) {
                if ("executing" === n)
                  throw new Error("Generator is already running");
                if ("completed" === n) {
                  if ("throw" === o) throw i;
                  return { value: void 0, done: !0 };
                }
                for (r.method = o, r.arg = i; ; ) {
                  var a = r.delegate;
                  if (a) {
                    var c = E(a, r);
                    if (c) {
                      if (c === h) continue;
                      return c;
                    }
                  }
                  if ("next" === r.method) r.sent = r._sent = r.arg;
                  else if ("throw" === r.method) {
                    if ("suspendedStart" === n)
                      throw ((n = "completed"), r.arg);
                    r.dispatchException(r.arg);
                  } else "return" === r.method && r.abrupt("return", r.arg);
                  n = "executing";
                  var u = p(t, e, r);
                  if ("normal" === u.type) {
                    if (
                      ((n = r.done ? "completed" : "suspendedYield"),
                      u.arg === h)
                    )
                      continue;
                    return { value: u.arg, done: r.done };
                  }
                  "throw" === u.type &&
                    ((n = "completed"), (r.method = "throw"), (r.arg = u.arg));
                }
              };
            }
            function E(t, e) {
              var r = e.method,
                n = t.iterator[r];
              if (void 0 === n)
                return (
                  (e.delegate = null),
                  ("throw" === r &&
                    t.iterator.return &&
                    ((e.method = "return"),
                    (e.arg = void 0),
                    E(t, e),
                    "throw" === e.method)) ||
                    ("return" !== r &&
                      ((e.method = "throw"),
                      (e.arg = new TypeError(
                        "The iterator does not provide a '" + r + "' method"
                      )))),
                  h
                );
              var o = p(n, t.iterator, e.arg);
              if ("throw" === o.type)
                return (
                  (e.method = "throw"), (e.arg = o.arg), (e.delegate = null), h
                );
              var i = o.arg;
              return i
                ? i.done
                  ? ((e[t.resultName] = i.value),
                    (e.next = t.nextLoc),
                    "return" !== e.method &&
                      ((e.method = "next"), (e.arg = void 0)),
                    (e.delegate = null),
                    h)
                  : i
                : ((e.method = "throw"),
                  (e.arg = new TypeError("iterator result is not an object")),
                  (e.delegate = null),
                  h);
            }
            function j(t) {
              var e = { tryLoc: t[0] };
              1 in t && (e.catchLoc = t[1]),
                2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
                this.tryEntries.push(e);
            }
            function S(t) {
              var e = t.completion || {};
              (e.type = "normal"), delete e.arg, (t.completion = e);
            }
            function k(t) {
              (this.tryEntries = [{ tryLoc: "root" }]),
                t.forEach(j, this),
                this.reset(!0);
            }
            function P(t) {
              if (t) {
                var e = t[c];
                if (e) return e.call(t);
                if ("function" == typeof t.next) return t;
                if (!isNaN(t.length)) {
                  var r = -1,
                    n = function e() {
                      for (; ++r < t.length; )
                        if (o.call(t, r))
                          return (e.value = t[r]), (e.done = !1), e;
                      return (e.value = void 0), (e.done = !0), e;
                    };
                  return (n.next = n);
                }
              }
              return { next: _ };
            }
            function _() {
              return { value: void 0, done: !0 };
            }
            return (
              (d.prototype = v),
              i(w, "constructor", { value: v, configurable: !0 }),
              i(v, "constructor", { value: d, configurable: !0 }),
              (d.displayName = l(v, s, "GeneratorFunction")),
              (t.isGeneratorFunction = function (t) {
                var e = "function" == typeof t && t.constructor;
                return (
                  !!e &&
                  (e === d || "GeneratorFunction" === (e.displayName || e.name))
                );
              }),
              (t.mark = function (t) {
                return (
                  Object.setPrototypeOf
                    ? Object.setPrototypeOf(t, v)
                    : ((t.__proto__ = v), l(t, s, "GeneratorFunction")),
                  (t.prototype = Object.create(w)),
                  t
                );
              }),
              (t.awrap = function (t) {
                return { __await: t };
              }),
              x(L.prototype),
              l(L.prototype, u, function () {
                return this;
              }),
              (t.AsyncIterator = L),
              (t.async = function (e, r, n, o, i) {
                void 0 === i && (i = Promise);
                var a = new L(f(e, r, n, o), i);
                return t.isGeneratorFunction(r)
                  ? a
                  : a.next().then(function (t) {
                      return t.done ? t.value : a.next();
                    });
              }),
              x(w),
              l(w, s, "Generator"),
              l(w, c, function () {
                return this;
              }),
              l(w, "toString", function () {
                return "[object Generator]";
              }),
              (t.keys = function (t) {
                var e = Object(t),
                  r = [];
                for (var n in e) r.push(n);
                return (
                  r.reverse(),
                  function t() {
                    for (; r.length; ) {
                      var n = r.pop();
                      if (n in e) return (t.value = n), (t.done = !1), t;
                    }
                    return (t.done = !0), t;
                  }
                );
              }),
              (t.values = P),
              (k.prototype = {
                constructor: k,
                reset: function (t) {
                  if (
                    ((this.prev = 0),
                    (this.next = 0),
                    (this.sent = this._sent = void 0),
                    (this.done = !1),
                    (this.delegate = null),
                    (this.method = "next"),
                    (this.arg = void 0),
                    this.tryEntries.forEach(S),
                    !t)
                  )
                    for (var e in this)
                      "t" === e.charAt(0) &&
                        o.call(this, e) &&
                        !isNaN(+e.slice(1)) &&
                        (this[e] = void 0);
                },
                stop: function () {
                  this.done = !0;
                  var t = this.tryEntries[0].completion;
                  if ("throw" === t.type) throw t.arg;
                  return this.rval;
                },
                dispatchException: function (t) {
                  if (this.done) throw t;
                  var e = this;
                  function r(r, n) {
                    return (
                      (a.type = "throw"),
                      (a.arg = t),
                      (e.next = r),
                      n && ((e.method = "next"), (e.arg = void 0)),
                      !!n
                    );
                  }
                  for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                    var i = this.tryEntries[n],
                      a = i.completion;
                    if ("root" === i.tryLoc) return r("end");
                    if (i.tryLoc <= this.prev) {
                      var c = o.call(i, "catchLoc"),
                        u = o.call(i, "finallyLoc");
                      if (c && u) {
                        if (this.prev < i.catchLoc) return r(i.catchLoc, !0);
                        if (this.prev < i.finallyLoc) return r(i.finallyLoc);
                      } else if (c) {
                        if (this.prev < i.catchLoc) return r(i.catchLoc, !0);
                      } else {
                        if (!u)
                          throw new Error(
                            "try statement without catch or finally"
                          );
                        if (this.prev < i.finallyLoc) return r(i.finallyLoc);
                      }
                    }
                  }
                },
                abrupt: function (t, e) {
                  for (var r = this.tryEntries.length - 1; r >= 0; --r) {
                    var n = this.tryEntries[r];
                    if (
                      n.tryLoc <= this.prev &&
                      o.call(n, "finallyLoc") &&
                      this.prev < n.finallyLoc
                    ) {
                      var i = n;
                      break;
                    }
                  }
                  i &&
                    ("break" === t || "continue" === t) &&
                    i.tryLoc <= e &&
                    e <= i.finallyLoc &&
                    (i = null);
                  var a = i ? i.completion : {};
                  return (
                    (a.type = t),
                    (a.arg = e),
                    i
                      ? ((this.method = "next"), (this.next = i.finallyLoc), h)
                      : this.complete(a)
                  );
                },
                complete: function (t, e) {
                  if ("throw" === t.type) throw t.arg;
                  return (
                    "break" === t.type || "continue" === t.type
                      ? (this.next = t.arg)
                      : "return" === t.type
                      ? ((this.rval = this.arg = t.arg),
                        (this.method = "return"),
                        (this.next = "end"))
                      : "normal" === t.type && e && (this.next = e),
                    h
                  );
                },
                finish: function (t) {
                  for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var r = this.tryEntries[e];
                    if (r.finallyLoc === t)
                      return this.complete(r.completion, r.afterLoc), S(r), h;
                  }
                },
                catch: function (t) {
                  for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var r = this.tryEntries[e];
                    if (r.tryLoc === t) {
                      var n = r.completion;
                      if ("throw" === n.type) {
                        var o = n.arg;
                        S(r);
                      }
                      return o;
                    }
                  }
                  throw new Error("illegal catch attempt");
                },
                delegateYield: function (t, e, r) {
                  return (
                    (this.delegate = {
                      iterator: P(t),
                      resultName: e,
                      nextLoc: r,
                    }),
                    "next" === this.method && (this.arg = void 0),
                    h
                  );
                },
              }),
              t
            );
          }
          function n(t, e, r, n, o, i, a) {
            try {
              var c = t[i](a),
                u = c.value;
            } catch (t) {
              return void r(t);
            }
            c.done ? e(u) : Promise.resolve(u).then(n, o);
          }
          t.exports = (function () {
            var t,
              e =
                ((t = r().mark(function t(e, n) {
                  return r().wrap(function (t) {
                    for (;;)
                      switch ((t.prev = t.next)) {
                        case 0:
                          e.postMessage(n);
                        case 1:
                        case "end":
                          return t.stop();
                      }
                  }, t);
                })),
                function () {
                  var e = this,
                    r = arguments;
                  return new Promise(function (o, i) {
                    var a = t.apply(e, r);
                    function c(t) {
                      n(a, o, i, c, u, "next", t);
                    }
                    function u(t) {
                      n(a, o, i, c, u, "throw", t);
                    }
                    c(void 0);
                  });
                });
            return function (t, r) {
              return e.apply(this, arguments);
            };
          })();
        },
        676: (t) => {
          t.exports = function (t) {
            var e,
              r = t.workerPath,
              n = t.workerBlobURL;
            if (Blob && URL && n) {
              var o = new Blob(['importScripts("'.concat(r, '");')], {
                type: "application/javascript",
              });
              e = new Worker(URL.createObjectURL(o));
            } else e = new Worker(r);
            return e;
          };
        },
        100: (t) => {
          t.exports = function (t) {
            t.terminate();
          };
        },
        147: (t) => {
          "use strict";
          t.exports = JSON.parse(
            '{"name":"tesseract.js","version":"5.0.1","description":"Pure Javascript Multilingual OCR","main":"src/index.js","types":"src/index.d.ts","unpkg":"dist/tesseract.min.js","jsdelivr":"dist/tesseract.min.js","scripts":{"start":"node scripts/server.js","build":"rimraf dist && webpack --config scripts/webpack.config.prod.js && rollup -c scripts/rollup.esm.mjs","profile:tesseract":"webpack-bundle-analyzer dist/tesseract-stats.json","profile:worker":"webpack-bundle-analyzer dist/worker-stats.json","prepublishOnly":"npm run build","wait":"rimraf dist && wait-on http://localhost:3000/dist/tesseract.min.js","test":"npm-run-all -p -r start test:all","test:all":"npm-run-all wait test:browser:* test:node:all","test:node":"nyc mocha --exit --bail --require ./scripts/test-helper.js","test:node:all":"npm run test:node -- ./tests/*.test.js","test:browser-tpl":"mocha-headless-chrome -a incognito -a no-sandbox -a disable-setuid-sandbox -a disable-logging -t 300000","test:browser:detect":"npm run test:browser-tpl -- -f ./tests/detect.test.html","test:browser:recognize":"npm run test:browser-tpl -- -f ./tests/recognize.test.html","test:browser:scheduler":"npm run test:browser-tpl -- -f ./tests/scheduler.test.html","test:browser:FS":"npm run test:browser-tpl -- -f ./tests/FS.test.html","lint":"eslint src","lint:fix":"eslint --fix src","postinstall":"opencollective-postinstall || true"},"browser":{"./src/worker/node/index.js":"./src/worker/browser/index.js"},"author":"","contributors":["jeromewu"],"license":"Apache-2.0","devDependencies":{"@babel/core":"^7.21.4","@babel/eslint-parser":"^7.21.3","@babel/preset-env":"^7.21.4","@rollup/plugin-commonjs":"^24.1.0","acorn":"^8.8.2","babel-loader":"^9.1.2","buffer":"^6.0.3","cors":"^2.8.5","eslint":"^7.32.0","eslint-config-airbnb-base":"^14.2.1","eslint-plugin-import":"^2.27.5","expect.js":"^0.3.1","express":"^4.18.2","mocha":"^10.2.0","mocha-headless-chrome":"^4.0.0","npm-run-all":"^4.1.5","nyc":"^15.1.0","rimraf":"^5.0.0","rollup":"^3.20.7","wait-on":"^7.0.1","webpack":"^5.79.0","webpack-bundle-analyzer":"^4.8.0","webpack-cli":"^5.0.1","webpack-dev-middleware":"^6.0.2","rollup-plugin-sourcemaps":"^0.6.3"},"dependencies":{"bmp-js":"^0.1.0","idb-keyval":"^6.2.0","is-electron":"^2.2.2","is-url":"^1.2.4","node-fetch":"^2.6.9","opencollective-postinstall":"^2.0.3","regenerator-runtime":"^0.13.3","tesseract.js-core":"^5.0.0","wasm-feature-detect":"^1.2.11","zlibjs":"^0.3.1"},"overrides":{"@rollup/pluginutils":"^5.0.2"},"repository":{"type":"git","url":"https://github.com/naptha/tesseract.js.git"},"bugs":{"url":"https://github.com/naptha/tesseract.js/issues"},"homepage":"https://github.com/naptha/tesseract.js","collective":{"type":"opencollective","url":"https://opencollective.com/tesseractjs"}}'
          );
        },
      },
      e = {};
    function r(n) {
      var o = e[n];
      if (void 0 !== o) return o.exports;
      var i = (e[n] = { id: n, loaded: !1, exports: {} });
      return t[n].call(i.exports, i, i.exports, r), (i.loaded = !0), i.exports;
    }
    return (
      (r.nmd = (t) => ((t.paths = []), t.children || (t.children = []), t)),
      r(352)
    );
  })()
);
//# sourceMappingURL=tesseract.min.js.map
