import {
  _ as se,
  e as ne,
  r as k,
  j as H,
  l as D,
  D as A,
  o as _,
  d as v,
  q as s,
  t as V,
  I as Ie,
  E as N,
  af as ve,
  h as K,
  P as Pe,
  c as ae,
  G as F,
  y as oe,
  z as E,
  i as Oe,
  b as n,
  A as we,
  B as ye,
  f as re,
  n as Re,
  F as J,
  v as $,
  s as fe,
  x as le,
  R as $e,
  k as xe,
  S as Ae,
  U as Ee,
  u as De,
  a as Ne,
  W as Ze,
  X as Fe,
  Y as Ve,
  a2 as me,
  Z as qe,
  a0 as Ge,
  ag as We,
  aa as X,
  a1 as ze,
  a3 as Ue,
  ah as Xe,
} from "./DzIV7Ypb.js";
import { T as pe, I as je, E as te } from "./BwkFD7S1.js";
function Ye(l) {
  var h = l.canvas || document.createElement("canvas"),
    c = (h.width = l.width),
    g = (h.height = l.height),
    e = h.getContext("2d"),
    u = l.img || new Image(),
    o = l.dpr || Math.min(2, window.devicePixelRatio),
    d = l.frames || 1,
    f = 0;
  h.imageSmoothingEnabled = !1;
  var r = 0,
    y = -1,
    T = null,
    b = !1,
    L = l.err,
    Z = new Error("Animation is already playing"),
    I = new RangeError("Parameter must be between 1 and " + d),
    B,
    C,
    G;
  function j() {
    ((f = Math.floor(u.width / c)),
      e.drawImage(u, 0 * c, 0, c, g, 0, 0, c, g),
      (h.width = c * o),
      (h.height = g * o),
      (h.style.width = c / o + "px"),
      (h.style.height = g / o + "px"));
  }
  (l.img ? j() : ((u.src = l.src), (u.onload = j)),
    (this.canvas = h),
    (this.play = function (i) {
      if (b && L) {
        console.error(Z);
        return;
      }
      if (i.to > d && L) {
        console.error(I);
        return;
      }
      if (i.from < 1 && L) {
        console.error(I);
        return;
      }
      (i.fps == null && (i.fps = 60),
        i.from == null && (i.from = 1),
        i.to == null && (i.to = d),
        i.n == null && (i.n = 1),
        (G == null || !G || C !== C || C == null) &&
          (i.to > i.from && (C = 0), i.from > i.to && (C = 1)));
      var w = 1e3 / i.fps;
      ((r = i.from - 1),
        i.from--,
        i.to--,
        (b = !0),
        (B = requestAnimationFrame(
          W.bind(null, i.from, i.to, i.n, w, i.step, i.loop),
        )));
    }),
    (this.pause = function () {
      if (!b && L) throw Z;
      (cancelAnimationFrame(B), (b = !1), (G = !0), (y = -1));
    }),
    (this.reset = function (i) {
      (i == null && (i = 0),
        cancelAnimationFrame(B),
        (b = !1),
        (y = -1),
        (r = i - 1),
        e.clearRect(0, 0, c, g),
        e.drawImage(u, --i * c, 0, c, g, 0, 0, c * o, g * o));
    }),
    (this.frame = function () {
      return r + 1;
    }));
  var Q = this,
    W = function (i, w, x, P, R, O, z) {
      if (
        ((B = requestAnimationFrame(W.bind(null, i, w, x, P, R, O))), f != 0)
      ) {
        T === null && (T = z);
        var U = Math.floor((z - T) / P);
        if (U > y) {
          ((y = U),
            C >= x && r == w && x !== 0 && ((b = !1), (G = !1)),
            e.clearRect(0, 0, c * o, g * o));
          var M = (r % f) * c,
            ee = Math.floor(r / f) * g;
          (e.drawImage(u, M, ee, c, g, 0, 0, c * o, g * o),
            w > i
              ? (r >= w
                  ? (typeof R == "function" && R(r + 1), (r = i))
                  : (typeof R == "function" && R(r + 1), r++),
                r == w &&
                  (typeof O == "function" && O(C), O === !1 && Q.pause(), C++))
              : i > w &&
                (r <= w
                  ? (typeof R == "function" && R(r + 1), (r = i))
                  : (typeof R == "function" && R(r + 1), r--),
                r == i &&
                  (typeof O == "function" && O(C),
                  O === !1 && Q.pause(),
                  C++)));
        }
      }
    };
}
const Je = { class: "focusButton_text" },
  Ke = Ie(
    '<svg class="focusButton_line focusButton_line-1" width="127" height="2" viewBox="0 0 127 2" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-1d4fc38d><path d="M0 1H127" data-v-1d4fc38d></path></svg><svg class="focusButton_line focusButton_line-2" width="127" height="2" viewBox="0 0 127 2" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-1d4fc38d><path d="M0 1H127" data-v-1d4fc38d></path></svg><svg class="focusButton_line focusButton_line-3" width="127" height="2" viewBox="0 0 127 2" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-1d4fc38d><path d="M0 1H127" data-v-1d4fc38d></path></svg><svg class="focusButton_line focusButton_line-2-out" width="127" height="2" viewBox="0 0 127 2" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-1d4fc38d><path d="M0 1H127" data-v-1d4fc38d></path></svg><svg class="focusButton_line focusButton_line-3-out" width="127" height="2" viewBox="0 0 127 2" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-1d4fc38d><path d="M0 1H127" data-v-1d4fc38d></path></svg>',
    5,
  ),
  Qe = {
    __name: "FocusBtn",
    props: {
      text: { type: String, default: null },
      index: { type: Number, default: null },
    },
    setup(l) {
      const { event: h } = ve(),
        c = ne(),
        g = k(),
        e = l;
      let u;
      H(
        () => g.value,
        (r) => {
          if ((u == null || u.kill(), r)) {
            const y = D.timeline();
            (y.timeScale(2),
              (e.index === 1 || e.index === 3) && A.device.desktop
                ? y.fromTo(
                    r,
                    { x: 30, y: -30 },
                    { x: 0, y: 0, duration: 2, ease: "power4.out" },
                    0.95,
                  )
                : y.fromTo(
                    r,
                    { x: -30, y: -30 },
                    { x: 0, y: 0, duration: 2, ease: "power4.out" },
                    0.95,
                  ),
              y.fromTo(
                r,
                { opacity: 0 },
                { opacity: 1, duration: 2, ease: "power4.out" },
                1,
              ),
              (u = y));
          }
        },
      );
      const o = () => {
          (A.isTouch || N.play("HoverCTA_In"), c.setIsHover(!0));
        },
        d = () => {
          (A.isTouch || N.play("HoverCTA_Out"), c.setIsHover(!1));
        },
        f = () => {
          (h("click_section_cta", { section: c.home.section }),
            N.play("ClickUI"),
            c.home.interactionController &&
              c.home.interactionController.clickZoom());
        };
      return (r, y) => (
        _(),
        v(
          "div",
          {
            ref_key: "focusButtonRef",
            ref: g,
            class: "focusButton",
            onMouseenter: o,
            onMouseleave: d,
            onClick: f,
          },
          [s("button", Je, V(l.text), 1), Ke],
          544,
        )
      );
    },
  },
  et = se(Qe, [["__scopeId", "data-v-1d4fc38d"]]),
  Y = (l) => (we("data-v-d67fcc62"), (l = l()), ye(), l),
  tt = { key: 0, class: "gradientBtn_arrow" },
  ot = Y(() =>
    s(
      "path",
      {
        d: "M4.31914 2.2168L8.75195 2.2168V6.64961",
        stroke: "white",
        "stroke-width": "0.754557",
      },
      null,
      -1,
    ),
  ),
  st = Y(() =>
    s(
      "path",
      {
        d: "M8.75381 4.15625L6.81445 4.15625L6.81445 2.21689",
        stroke: "white",
        "stroke-width": "0.754557",
      },
      null,
      -1,
    ),
  ),
  nt = Y(() =>
    s(
      "rect",
      {
        width: "0.754557",
        height: "6.76588",
        transform:
          "matrix(-0.707107 -0.707107 -0.707107 0.707107 7.19727 4.16602)",
        fill: "white",
      },
      null,
      -1,
    ),
  ),
  it = [ot, st, nt],
  at = Y(() =>
    s(
      "path",
      {
        d: "M4.31914 2.2168L8.75195 2.2168V6.64961",
        stroke: "white",
        "stroke-width": "0.754557",
      },
      null,
      -1,
    ),
  ),
  lt = Y(() =>
    s(
      "path",
      {
        d: "M8.75381 4.15625L6.81445 4.15625L6.81445 2.21689",
        stroke: "white",
        "stroke-width": "0.754557",
      },
      null,
      -1,
    ),
  ),
  rt = Y(() =>
    s(
      "rect",
      {
        width: "0.754557",
        height: "6.76588",
        transform:
          "matrix(-0.707107 -0.707107 -0.707107 0.707107 7.19727 4.16602)",
        fill: "white",
      },
      null,
      -1,
    ),
  ),
  ct = [at, lt, rt],
  _e = 0.35,
  ut = {
    __name: "GradientBtn",
    props: {
      text: { type: String, default: null },
      url: { type: String, default: null },
      highlightIndex: { type: Number, required: !0 },
      color: { type: String, required: !0 },
    },
    setup(l) {
      const h = k(),
        c = k(),
        g = k(),
        e = k(),
        u = k(),
        o = l,
        d = ne(),
        f = K(() => (o.url ? Pe : "span")),
        r = () => {
          if (!A.isTouch) {
            ((d.home.highlightedPlanet = o.highlightIndex), d.setIsHover(!0));
            const T = D.timeline();
            (T.to(c.value, { opacity: 0, duration: 0 }, 0),
              T.to(
                c.value,
                { opacity: 1, duration: _e, ease: "power1.inOut" },
                0,
              ),
              T.to(g.value, { opacity: 1, duration: 0 }, 0),
              T.to(
                g.value,
                { opacity: 0, duration: _e, ease: "power1.inOut" },
                0,
              ),
              e.value &&
                (T.fromTo(
                  e.value,
                  {
                    clipPath: "inset(0% 0% 0% 0%)",
                    transform: "translate(0px, 0px) scale(1)",
                  },
                  {
                    clipPath: "inset(0% 0% 0% 100%)",
                    transform: "translate(6px, -6px) scale(2)",
                    duration: 0.125,
                    ease: "sine.in",
                  },
                  0,
                ),
                T.fromTo(
                  u.value,
                  {
                    clipPath: "inset(0% 100% 0% 0%)",
                    transform: "translate(-6px, 6px) scale(1)",
                  },
                  {
                    clipPath: "inset(0% 0% 0% 0%)",
                    transform: "translate(0px, 0px) scale(1)",
                    duration: 0.125,
                    ease: "power2.out",
                  },
                  0.125,
                )),
              N.play("HoverUI_In"));
          }
        },
        y = () => {
          ((d.home.highlightedPlanet = -1), d.setIsHover(!1));
        };
      return (T, b) => (
        _(),
        ae(
          Oe(n(f)),
          {
            ref_key: "gradientBtnRef",
            ref: h,
            class: "gradientBtn",
            url: l.url,
            onMouseenter: r,
            onMouseleave: y,
          },
          {
            default: F(() => [
              s(
                "span",
                {
                  ref_key: "textDefaultRef",
                  ref: c,
                  class: oe(["textDefault", { [l.color]: !0 }]),
                },
                V(l.text),
                3,
              ),
              s(
                "span",
                { ref_key: "textHoverRef", ref: g, class: "textHover" },
                V(l.text),
                513,
              ),
              o.url
                ? (_(),
                  v("div", tt, [
                    (_(),
                    v(
                      "svg",
                      {
                        ref_key: "arrowDefaultRef",
                        ref: e,
                        class: "gradientBtn_arrow-default",
                        width: "11",
                        height: "11",
                        viewBox: "0 0 11 11",
                        fill: "none",
                        xmlns: "http://www.w3.org/2000/svg",
                      },
                      it,
                      512,
                    )),
                    (_(),
                    v(
                      "svg",
                      {
                        ref_key: "arrowHoverRef",
                        ref: u,
                        class: "gradientBtn_arrow-hover",
                        width: "11",
                        height: "11",
                        viewBox: "0 0 11 11",
                        fill: "none",
                        xmlns: "http://www.w3.org/2000/svg",
                      },
                      ct,
                      512,
                    )),
                  ]))
                : E("", !0),
            ]),
            _: 1,
          },
          40,
          ["url"],
        )
      );
    },
  },
  ge = se(ut, [["__scopeId", "data-v-d67fcc62"]]),
  dt = ["innerHTML"],
  ht = ["innerHTML"],
  ft = ["innerHTML"],
  mt = 3e3,
  pt = 0,
  _t = {
    __name: "BlockchainBlock",
    props: { phaseContent: { type: Object, required: !0 } },
    setup(l) {
      const h = l,
        c = ["yellow", "green", "purple", "red"],
        g = ne(),
        e = k(),
        u = k(!1),
        o = k(pt + 1),
        d = /\[\b.*\b\]/,
        f = K(() => (h.phaseContent.desc || "").split(d)),
        r = K(() => {
          const L = (h.phaseContent.desc || "").match(d);
          return L ? L[0].substring(1, L[0].length - 1) : null;
        });
      let y;
      re(() => {
        y == null || y.kill();
        const L = D.timeline();
        (L.timeScale(2),
          L.fromTo(
            e.value,
            { x: -15, y: -15 },
            { x: 0, y: 0, duration: 2, ease: "power4.out" },
            1,
          ),
          L.fromTo(
            e.value,
            { opacity: 0 },
            { opacity: 1, duration: 2, ease: "power4.out" },
            1,
          ),
          (y = L),
          H(
            [o, u],
            ([I, B]) => {
              B ||
                Re(() => {
                  g.home.highlightedPlanet = I - 1;
                });
            },
            { immediate: !0, flush: "post" },
          ));
        let Z;
        H(
          u,
          (I) => {
            if (I) clearTimeout(Z);
            else {
              const B = () => {
                Z = setTimeout(() => {
                  ((o.value = (o.value + 1) % 6), B());
                }, mt);
              };
              B();
            }
          },
          { immediate: !0 },
        );
      });
      const T = () => {
          A.isTouch || (u.value = !0);
        },
        b = () => {
          A.isTouch || ((u.value = !1), (o.value = 0));
        };
      return (L, Z) => (
        _(),
        v(
          "p",
          { ref_key: "phaseCtaRef", ref: e, class: "phase_cta" },
          [
            n(r)
              ? (_(),
                v(
                  J,
                  { key: 0 },
                  [
                    s("span", { innerHTML: n(f)[0] }, null, 8, dt),
                    $(
                      ge,
                      {
                        color: "blue",
                        "highlight-index": 4,
                        text: n(r),
                        style: fe({
                          opacity:
                            !n(u) && n(o) - 1 !== 5 && n(o) !== 0 ? 0.5 : null,
                        }),
                        onMouseenter: T,
                        onMouseleave: b,
                      },
                      null,
                      8,
                      ["text", "style"],
                    ),
                    s("span", { innerHTML: n(f)[1] + " " }, null, 8, ht),
                  ],
                  64,
                ))
              : (_(),
                v("span", { key: 1, innerHTML: n(f)[0] + " " }, null, 8, ft)),
            (_(!0),
            v(
              J,
              null,
              le(
                h.phaseContent.descLinks,
                (I, B) => (
                  _(),
                  v(
                    J,
                    null,
                    [
                      $(
                        ge,
                        {
                          class: "cta",
                          text: I.label,
                          url: I.url,
                          color: c[B],
                          "highlight-index": B,
                          style: fe({
                            opacity:
                              !n(u) && n(o) - 1 !== B && n(o) !== 0
                                ? 0.5
                                : null,
                          }),
                          onMouseenter: T,
                          onMouseleave: b,
                        },
                        null,
                        8,
                        ["text", "url", "color", "highlight-index", "style"],
                      ),
                      $e(
                        V(
                          B + 1 === h.phaseContent.descLinks.length
                            ? "."
                            : ", ",
                        ),
                        1,
                      ),
                    ],
                    64,
                  )
                ),
              ),
              256,
            )),
          ],
          512,
        )
      );
    },
  },
  gt = _t,
  vt = { class: "glitch-title" },
  wt = {
    __name: "GlitchTitleElt",
    props: {
      content: { type: String, default: "" },
      index: { type: Number, default: 0 },
    },
    setup(l) {
      const h = l,
        c = k();
      let g;
      const e = () => {
        g = new Ae(c.value, { type: "words" });
        const u = D.timeline({ delay: 0.85 });
        u.timeScale(2);
        const o = [...g.words].reverse();
        for (let d = 0; d < o.length; d++) {
          const f = o[d];
          f.style.willChange = "transform";
        }
        (h.index === 1 || h.index === 3) && A.device.desktop
          ? u.from(
              o,
              { x: 30, y: -30, stagger: 0.04, duration: 2, ease: "power4.out" },
              0,
            )
          : u.from(
              o,
              {
                x: -30,
                y: -30,
                stagger: 0.04,
                duration: 2,
                ease: "power4.out",
              },
              0,
            );
        for (let d = 0; d < o.length; d++) {
          const f = o[d];
          u.call(
            () => {
              f.classList.add("yellow");
            },
            null,
            0,
          );
        }
        for (let d = 0; d < o.length; d++) {
          const f = o[d];
          u.call(
            () => {
              f.classList.remove("yellow");
            },
            null,
            0.4 + 0.02 * d,
          );
        }
        (u.from(o, { opacity: 0, duration: 0.01, stagger: 0.02 }, 0.2),
          u.call(
            () => {
              for (let d = 0; d < o.length; d++) {
                const f = o[d];
                f.style.willChange = "";
              }
            },
            null,
            "+=0.5",
          ));
      };
      return (
        re(() => {
          e();
        }),
        xe(() => {}),
        (u, o) => (
          _(),
          v("div", vt, [
            s(
              "div",
              { ref_key: "text", ref: c, class: "glitch-title_text" },
              V(h.content),
              513,
            ),
          ])
        )
      );
    },
  },
  yt = se(wt, [["__scopeId", "data-v-eadd9900"]]),
  S = (l) => (we("data-v-374831df"), (l = l()), ye(), l),
  xt = S(() => s("div", { class: "lenis-section" }, null, -1)),
  kt = S(() => s("div", { class: "lenis-section" }, null, -1)),
  St = S(() => s("div", { class: "lenis-section" }, null, -1)),
  Tt = S(() => s("div", { class: "lenis-section" }, null, -1)),
  Lt = S(() => s("div", { class: "lenis-section" }, null, -1)),
  Bt = S(() => s("div", { class: "lenis-section" }, null, -1)),
  Mt = S(() => s("div", { class: "lenis-section" }, null, -1)),
  bt = S(() => s("div", { class: "lenis-section" }, null, -1)),
  Ct = S(() => s("div", { class: "lenis-section" }, null, -1)),
  Ht = S(() => s("div", { class: "lenis-section" }, null, -1)),
  It = S(() => s("div", { class: "lenis-section" }, null, -1)),
  Pt = S(() => s("div", { class: "lenis-section" }, null, -1)),
  Ot = S(() => s("div", { class: "lenis-section" }, null, -1)),
  Rt = S(() => s("div", { class: "lenis-section" }, null, -1)),
  $t = S(() => s("div", { class: "lenis-section" }, null, -1)),
  At = S(() => s("div", { class: "lenis-section" }, null, -1)),
  Et = [xt, kt, St, Tt, Lt, Bt, Mt, bt, Ct, Ht, It, Pt, Ot, Rt, $t, At],
  Dt = { class: "phase_legend-container" },
  Nt = { key: 0, class: "content-container" },
  Zt = { class: "phase_content" },
  Ft = ["data-index"],
  Vt = ["data-index"],
  qt = { key: 0, class: "phase_bottom-video" },
  Gt = ["data-index"],
  Wt = ["data-index"],
  zt = { key: 0, class: "scroll-prompt" },
  Ut = S(() =>
    s(
      "svg",
      {
        class: "scroll-prompt_arrow",
        width: "10",
        height: "11",
        viewBox: "0 0 10 11",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
      },
      [
        s("path", {
          d: "M0.830386 6.16924L4.99988 10.3387L9.16937 6.16924",
          "stroke-width": "0.7",
        }),
        s("path", {
          d: "M6.8244 8.51452L5.00024 6.69037L3.17609 8.51452",
          "stroke-width": "0.7",
        }),
        s("rect", { x: "4.6499", width: "0.7", height: "9" }),
      ],
      -1,
    ),
  ),
  Xt = { class: "scroll-prompt_text" },
  jt = { key: 0, class: "pagination" },
  Yt = { class: "pagination_items" },
  Jt = ["onClick"],
  Kt = S(() => s("div", { class: "pagination_dot" }, null, -1)),
  Qt = [Kt],
  eo = { key: 0, class: "zoom_container" },
  to = {
    __name: "HomePage",
    props: { page: { type: Object, default: null } },
    setup(l) {
      let h = console.log.bind(
        console,
        "%c - HomePage.%s() - ",
        "background-color: lightyellow; color: black",
      );
      me.isProduction && (h = () => {});
      const c = l,
        g = Ee(),
        e = ne(),
        u = De(),
        o = Ne(),
        { $webglApp: d } = Ue(),
        { event: f } = ve(),
        [r, y] = Ze(null),
        T = k(null),
        b = k(null),
        L = k(),
        Z = k(),
        I = k(),
        B = k(!1),
        C = K(() => c.page.url),
        G = K(() => !e.menu.isOpen && e.home.isZoom),
        j = k(!1),
        Q = new Xe(),
        W = k("");
      let i = [],
        w,
        x,
        P;
      const R = [
        {
          src: "/images/icons/egg1_sprite.png",
          width: 100,
          height: 120,
          frames: 126,
        },
        {
          src: "/images/icons/egg2_sprite.png",
          width: 100,
          height: 120,
          frames: 126,
        },
        {
          src: "/images/icons/griffin_sprite.png",
          width: 120,
          height: 150,
          frames: 126,
        },
        {
          src: "/images/icons/shield_sprite.png",
          width: 120,
          height: 120,
          frames: 126,
        },
        {
          src: "/images/icons/universe_sprite.png",
          width: 100,
          height: 100,
          frames: 126,
        },
      ];
      let O;
      H(
        () => {
          var t;
          return (t = L.value) == null ? void 0 : t[0];
        },
        (t) => {
          if ((O == null || O.kill(), t)) {
            const m = D.timeline();
            m.timeScale(2);
            const p = Number(t.dataset.index);
            ((p === 1 || p === 3) && A.device.desktop
              ? m.fromTo(
                  t,
                  { x: 30, y: -30 },
                  { x: 0, y: 0, duration: 2, ease: "power4.out" },
                  0.9,
                )
              : m.fromTo(
                  t,
                  { x: -30, y: -30 },
                  { x: 0, y: 0, duration: 2, ease: "power4.out" },
                  0.9,
                ),
              m.fromTo(
                t,
                { opacity: 0 },
                { opacity: 1, duration: 2, ease: "power4.out" },
                0.9,
              ),
              (O = m));
          }
        },
      );
      let z;
      H(
        () => {
          var t;
          return (t = Z.value) == null ? void 0 : t[0];
        },
        (t) => {
          if ((z == null || z.kill(), t)) {
            const m = D.timeline();
            m.timeScale(2);
            const p = Number(t.dataset.index);
            ((p === 1 || p === 3) && A.device.desktop
              ? m.fromTo(
                  t,
                  { x: 30, y: -30 },
                  { x: 0, y: 0, duration: 2, ease: "power4.out" },
                  0.95,
                )
              : m.fromTo(
                  t,
                  { x: -30, y: -30 },
                  { x: 0, y: 0, duration: 2, ease: "power4.out" },
                  0.95,
                ),
              m.fromTo(
                t,
                { opacity: 0 },
                { opacity: 1, duration: 2, ease: "power4.out" },
                0.95,
              ),
              (z = m));
          }
        },
      );
      let U;
      (H(
        () => {
          var t;
          return (t = I.value) == null ? void 0 : t[0];
        },
        (t) => {
          if ((U == null || U.kill(), t)) {
            const m = D.timeline();
            m.timeScale(2);
            const p = Number(t.dataset.index),
              a = R[p],
              q = new Ye({
                src: a.src,
                canvas: t,
                width: a.width,
                height: a.height,
                frames: a.frames,
              });
            (q.pause(),
              m.call(
                (de) => {
                  de.play({ from: 1, to: a.frames, loop: !1 });
                },
                [q],
                1.1,
              ),
              (U = m));
          }
        },
      ),
        H(() => g.ready, ee),
        Fe(() => {
          g.ready && ee();
        }));
      let M = null;
      (re(() => {
        (h("onMounted", "showFailed", j.value),
          Ve.addViewAssetsToPreload("home"),
          e.updateMainLoader({ hideOnComplete: !1 }),
          j.value && ie(),
          Be(),
          pe.add(ue, 30),
          H(
            [() => e.home.section, () => e.mainLoader.loaded],
            ([t, m]) => {
              var a;
              if (!m) return;
              M && (M == null || M.unload());
              const p =
                (a = c.page.phases[e.home.section].audio) == null
                  ? void 0
                  : a.url;
              p &&
                (M = N.load({
                  src: [p],
                  loop: !1,
                  html5: !0,
                  autoplay: !1,
                  onend: ce,
                }));
            },
            { immediate: !0 },
          ),
          H(G, (t) => {
            M && (t ? M.play() : M.stop());
          }));
      }),
        xe(() => {
          (be(), pe.remove(ue), M == null || M.unload());
        }));
      function ee() {
        var t;
        (h("onWebglReady"),
          (w = (t = d.viewManager.get("home")) == null ? void 0 : t.instance),
          (w.viewPath = C.value),
          me.params.skipLoader && ie());
      }
      function ie() {
        if (!r.value || !w)
          return (
            (j.value = !0),
            h("showFailed", "pageElt", !!r.value, "homeView", !!w),
            D.timeline()
          );
        (h("show"), qe.setDomTarget(r.value.$el, C.value));
        const t = D.timeline();
        return (
          t.fromTo(
            r.value.$el,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.25, ease: "sine.inOut" },
            0,
          ),
          t
        );
      }
      function ke() {
        h("hide");
        const t = D.timeline();
        return (
          t.to(
            r.value.$el,
            { autoAlpha: 0, duration: 0.15, ease: "sine.inOut" },
            0,
          ),
          t.call(Le),
          t
        );
      }
      const Se = () => {
          (A.isTouch || N.play("HoverCTA_In"), e.setIsHover(!0));
        },
        Te = () => {
          (A.isTouch || N.play("HoverCTA_Out"), e.setIsHover(!1));
        };
      function Le() {
        (h("onHideComplete"), y());
      }
      Ge({
        enter: ie,
        leave: ke,
        mode: "out-in",
        name: o == null ? void 0 : o.path,
        type: "page",
      });
      function Be() {
        ((x = new je(T.value, b.value, document.querySelector("#__nuxt"))),
          (P = x.lenis),
          (e.home.interactionController = We(x)),
          (e.home.progress = P.progress),
          (e.home.section = 0),
          (e.home.isHold = !1),
          (e.home.isZoom = !1),
          P.on("scroll", () => {
            e.home.progress = P.progress;
          }),
          x.on(te.START_HOLD, ({ quickZoom: t }) => {
            (t || f("section_hold", { type: "start" }), (e.home.isHold = !0));
          }),
          x.on(te.CANCEL_HOLD, ({ quickZoom: t }) => {
            (t || f("section_hold", { type: "cancel" }), (e.home.isHold = !1));
          }),
          x.on(te.ENTER_ZOOM, ({ quickZoom: t }) => {
            (t || f("section_hold", { type: "complete" }),
              f("open_section", { section: e.home.section }),
              (e.home.isHold = !1),
              (e.home.isZoom = !0),
              Me());
          }),
          x.on(te.EXIT_ZOOM, ({ quickZoom: t }) => {
            (t || f("section_hold", { type: "exit" }),
              f("exit_section", { section: e.home.section }),
              (e.home.isZoom = !1));
          }),
          H(
            () => e.menu.isOpen || !e.mainLoader.hidding || e.valuePopup.isOpen,
            (t) => {
              t
                ? x.pause()
                : setTimeout(() => {
                    x.resume();
                  }, 100);
            },
            { immediate: !0 },
          ),
          H(
            () => e.home.section,
            (t) => {
              f("section_change", { section: t });
            },
          ),
          H(
            () => e.home.isBetweenSections,
            (t) => {
              x.setIsPreventHold(t);
            },
          ),
          H(
            () => e.home.isZoom,
            (t) => {
              t ? N.play("MenuSFX_Out") : N.play("MenuSFX_In");
            },
          ));
      }
      function Me() {
        var m;
        const t =
          (m = c.page.phases[e.home.section].subtitles) == null
            ? void 0
            : m.url;
        if (!t) return console.warn("No subtitles found for this section");
        fetch(t)
          .then((p) => p.text())
          .then((p) => {
            i = Q.fromSrt(p);
          });
      }
      function ce() {
        (x.exitZoom(), M && M.stop(), (W.value = ""), (i = []));
      }
      function be() {
        ((e.home.interactionController = null), x.destroy());
      }
      function Ce(t) {
        (f("section_navigation", { to: t }), N.play("ClickUI"));
        const m = t === 0 ? 0 : e.home.autoplaySectionLimits[(t - 1) * 2 + 1],
          p = P.limit * m;
        P.scrollTo(p, {
          offset: t ? 100 : 0,
          force: !0,
          lock: !0,
          duration: 2,
        });
      }
      function He() {
        if (
          !w ||
          e.bg.isHiding ||
          e.bg.isShowing ||
          x._isPaused ||
          e.menu.isOpen
        )
          return;
        let t = 0;
        (e.home.sectionLimits.forEach((a, q) => {
          w.easeProgress >= a && (t = q);
        }),
          (e.home.section = t));
        let m = !1;
        for (let a = 0; a < e.sectionsInBetween.length; a += 2)
          if (
            !(w.easeProgress < e.sectionsInBetween[a]) &&
            !(w.easeProgress >= e.sectionsInBetween[a + 1])
          ) {
            m = !0;
            break;
          }
        e.home.isBetweenSections = m;
        let p = !1;
        for (let a = 0; a < e.home.autoplaySectionLimits.length; a += 2)
          if (
            !(e.home.progress < e.home.autoplaySectionLimits[a]) &&
            !(e.home.progress >= e.home.autoplaySectionLimits[a + 1])
          ) {
            p = !0;
            break;
          }
        e.home.isAutoplaySection = p;
      }
      function ue(t, m) {
        var p, a;
        (e.home.isAutoplaySection &&
          P.velocity >= 0 &&
          !(e.home.isHold || e.home.isZoom) &&
          P.scrollTo(P.targetScroll + 40, {}),
          (e.home.holdProgress = x.holdProgress),
          (B.value =
            (((a =
              (p = w == null ? void 0 : w._components) == null
                ? void 0
                : p.planets) == null
              ? void 0
              : a._linkProgress) || 0) > 0.1),
          He(),
          i.length &&
            (!M ||
              !G.value ||
              i.every((q, de) => {
                const he = M.seek();
                return he >= q.startSeconds && he <= q.endSeconds
                  ? ((W.value = q.text), !1)
                  : !0;
              })));
      }
      return (t, m) => (
        _(),
        ae(
          ze,
          {
            ref_key: "pageElt",
            ref: r,
            class: oe({ homePage: !0 }),
            page: l.page,
          },
          {
            default: F(() => [
              s(
                "div",
                {
                  ref_key: "lenisContainerElt",
                  ref: T,
                  class: "lenis-scroll-container",
                },
                [
                  s(
                    "div",
                    {
                      ref_key: "lenisContentElt",
                      ref: b,
                      class: "lenis-scroll-content",
                    },
                    Et,
                    512,
                  ),
                ],
                512,
              ),
              s("div", Dt, [
                $(
                  X,
                  { name: "global" },
                  {
                    default: F(() => [
                      !n(e).mainLoader.visible &&
                      !n(e).home.isZoom &&
                      !n(e).menu.isOpen
                        ? (_(),
                          v(
                            "p",
                            {
                              key: n(e).home.section,
                              class: "phase_legend_text",
                            },
                            V(l.page.phases[n(e).home.section].legend),
                            1,
                          ))
                        : E("", !0),
                    ]),
                    _: 1,
                  },
                ),
              ]),
              $(
                X,
                { name: "phases" },
                {
                  default: F(() => [
                    !n(e).menu.isOpen &&
                    !n(e).home.isZoom &&
                    !n(e).mainLoader.visible
                      ? (_(),
                        v("div", Nt, [
                          (_(!0),
                          v(
                            J,
                            null,
                            le(
                              l.page.phases,
                              (p, a) => (
                                _(),
                                v("section", { key: a }, [
                                  $(
                                    X,
                                    { name: "phasesContent" },
                                    {
                                      default: F(() => [
                                        n(e).home.section === a &&
                                        !n(e).home.isBetweenSections
                                          ? (_(),
                                            v(
                                              "div",
                                              {
                                                key: 0,
                                                class: oe([
                                                  "phase",
                                                  { [`phase--${a + 1}`]: !0 },
                                                ]),
                                              },
                                              [
                                                s("div", Zt, [
                                                  (_(),
                                                  v(
                                                    "div",
                                                    {
                                                      key: p.caption,
                                                      ref_for: !0,
                                                      ref_key:
                                                        "phaseCaptionRef",
                                                      ref: L,
                                                      "data-index": a,
                                                      class:
                                                        "phase_content_caption",
                                                    },
                                                    V(p.caption),
                                                    9,
                                                    Ft,
                                                  )),
                                                  $(
                                                    yt,
                                                    {
                                                      content: p.title,
                                                      index: a,
                                                      class:
                                                        "phase_content_title",
                                                    },
                                                    null,
                                                    8,
                                                    ["content", "index"],
                                                  ),
                                                  s(
                                                    "div",
                                                    {
                                                      "data-index": a,
                                                      class: "phase_bottom",
                                                    },
                                                    [
                                                      !n(e).mainLoader
                                                        .visible &&
                                                      !n(e).home.isZoom &&
                                                      !n(e).menu.isOpen &&
                                                      !n(e).home
                                                        .isBetweenSections
                                                        ? (_(),
                                                          v("div", qt, [
                                                            s(
                                                              "div",
                                                              {
                                                                ref_for: !0,
                                                                ref_key:
                                                                  "phaseVideo",
                                                                ref: Z,
                                                                "data-index": a,
                                                                class: "icon",
                                                              },
                                                              [
                                                                n(e).mainLoader
                                                                  .loaded
                                                                  ? (_(),
                                                                    v(
                                                                      "canvas",
                                                                      {
                                                                        key: 0,
                                                                        ref_for:
                                                                          !0,
                                                                        ref_key:
                                                                          "iconVideo",
                                                                        ref: I,
                                                                        "data-index":
                                                                          a,
                                                                      },
                                                                      null,
                                                                      8,
                                                                      Wt,
                                                                    ))
                                                                  : E("", !0),
                                                              ],
                                                              8,
                                                              Gt,
                                                            ),
                                                          ]))
                                                        : E("", !0),
                                                      $(
                                                        et,
                                                        {
                                                          class:
                                                            "phase_bottom-focus",
                                                          index: a,
                                                          text: n(u).globalTexts
                                                            .clickToDiscover,
                                                        },
                                                        null,
                                                        8,
                                                        ["index", "text"],
                                                      ),
                                                    ],
                                                    8,
                                                    Vt,
                                                  ),
                                                ]),
                                                a === 4 && n(B)
                                                  ? (_(),
                                                    ae(
                                                      gt,
                                                      {
                                                        key: 0,
                                                        class: "phase_cta",
                                                        "phase-content":
                                                          c.page.phases[4],
                                                      },
                                                      null,
                                                      8,
                                                      ["phase-content"],
                                                    ))
                                                  : E("", !0),
                                              ],
                                              2,
                                            ))
                                          : E("", !0),
                                      ]),
                                      _: 2,
                                    },
                                    1024,
                                  ),
                                ])
                              ),
                            ),
                            128,
                          )),
                        ]))
                      : E("", !0),
                  ]),
                  _: 1,
                },
              ),
              $(
                X,
                { name: "global" },
                {
                  default: F(() => [
                    !n(e).mainLoader.visible &&
                    !n(e).home.isZoom &&
                    !n(e).menu.isOpen &&
                    n(e).home.progress < 0.05
                      ? (_(),
                        v("div", zt, [
                          Ut,
                          s("div", Xt, V(l.page.scrollToDiscover), 1),
                        ]))
                      : E("", !0),
                  ]),
                  _: 1,
                },
              ),
              $(
                X,
                { name: "global" },
                {
                  default: F(() => [
                    !n(e).mainLoader.visible &&
                    !n(e).home.isZoom &&
                    !n(e).menu.isOpen
                      ? (_(),
                        v("div", jt, [
                          s("div", Yt, [
                            (_(!0),
                            v(
                              J,
                              null,
                              le(
                                l.page.phases,
                                (p, a) => (
                                  _(),
                                  v(
                                    "button",
                                    {
                                      key: a,
                                      class: oe([
                                        "pagination_item",
                                        {
                                          "pagination_item--active":
                                            a === n(e).home.section,
                                        },
                                      ]),
                                      onClick: () => Ce(a),
                                      onMouseenter: Se,
                                      onMouseleave: Te,
                                    },
                                    Qt,
                                    42,
                                    Jt,
                                  )
                                ),
                              ),
                              128,
                            )),
                          ]),
                        ]))
                      : E("", !0),
                  ]),
                  _: 1,
                },
              ),
              $(X, null, {
                default: F(() => [
                  !n(e).menu.isOpen && n(e).home.isZoom
                    ? (_(),
                      v("div", eo, [
                        $(X, null, {
                          default: F(() => [
                            (_(),
                            v(
                              "div",
                              { key: n(W), class: "zoom_subtitles" },
                              V(n(W)),
                              1,
                            )),
                          ]),
                          _: 1,
                        }),
                        s("div", { class: "zoom_click-catcher", onClick: ce }),
                      ]))
                    : E("", !0),
                ]),
                _: 1,
              }),
            ]),
            _: 1,
          },
          8,
          ["page"],
        )
      );
    },
  },
  no = se(to, [["__scopeId", "data-v-374831df"]]);
export { no as H };
