/* Progressive enhancement only: every page works without this file. */
(function () {
  "use strict";
  var calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Reveal on scroll.
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !calm) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // The story: the step nearest the middle of the viewport owns the display.
  var steps = Array.prototype.slice.call(document.querySelectorAll(".step[data-step]"));
  var layers = document.querySelectorAll(".lcd-layer");
  if (steps.length && layers.length && "IntersectionObserver" in window) {
    var show = function (n) {
      layers.forEach(function (l, i) { l.classList.toggle("on", i === n); });
      steps.forEach(function (s, i) { s.classList.toggle("active", i === n); });
    };
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) show(steps.indexOf(e.target)); });
    }, { rootMargin: "-45% 0px -45% 0px" });
    steps.forEach(function (s) { so.observe(s); });
    show(0);
  }

  // The rack: pick an effect and its display comes up; it also drifts on by itself until you take over.
  var rack = document.querySelector("[data-rack]");
  if (rack) {
    var items = Array.prototype.slice.call(rack.querySelectorAll(".rk-item"));
    var fxl = rack.querySelectorAll(".fx-layer");
    var cur = 0, timer = null, taken = false;
    var pick = function (n) {
      cur = n;
      fxl.forEach(function (l, i) { l.classList.toggle("on", i === n); });
      items.forEach(function (b, i) { b.classList.toggle("active", i === n); b.setAttribute("aria-pressed", i === n ? "true" : "false"); });
    };
    items.forEach(function (b, i) {
      b.addEventListener("click", function () { taken = true; stop(); pick(i); });
      b.addEventListener("pointerenter", function () { if (matchMedia("(hover: hover)").matches) { taken = true; stop(); pick(i); } });
    });
    var stop = function () { if (timer) { clearInterval(timer); timer = null; } };
    var go = function () { if (!timer && !taken && !calm) timer = setInterval(function () { pick((cur + 1) % items.length); }, 3800); };
    pick(0);
    if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { e[0].isIntersecting ? go() : stop(); }).observe(rack);
  }

  // A little depth: the keyboard leans toward the pointer. Mouse only, never with reduced motion.
  var tilt = document.querySelector("[data-tilt]");
  if (tilt && !calm && matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var stage = tilt.parentNode;
    stage.addEventListener("pointermove", function (e) {
      var r = stage.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.transform = "rotateY(" + (x * 6).toFixed(2) + "deg) rotateX(" + (-y * 4).toFixed(2) + "deg)";
    });
    stage.addEventListener("pointerleave", function () { tilt.style.transform = ""; });
  }
})();
