/* Progressive enhancement only: everything works without this file. */
(function () {
  "use strict";

  // Scroll reveal.
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // Flavour filter chips.
  var table = document.querySelector("[data-flavour-table]");
  var chips = document.querySelector("[data-flavour-filter]");
  if (table && chips) {
    chips.hidden = false;
    var rows = Array.prototype.slice.call(table.querySelectorAll("tbody tr"));
    chips.addEventListener("click", function (ev) {
      var b = ev.target.closest("button[data-tag]");
      if (!b) return;
      var tag = b.getAttribute("data-tag");
      chips.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      rows.forEach(function (r) {
        var tags = (r.getAttribute("data-tags") || "").split(" ");
        r.hidden = tag !== "all" && tags.indexOf(tag) < 0;
      });
    });
  }

  // Flavour rows light their controls on the faceplate.
  var plate = document.querySelector(".faceplate");
  if (plate && table) {
    var groups = { pads: "pad", knobs: "enc", faders: "fader" };
    var base = [];
    plate.querySelectorAll("[id^=pad-],[id^=enc-],[id^=fader-]").forEach(function (el) {
      base.push([el, el.getAttribute("class")]);
    });
    var restore = function () { base.forEach(function (p) { p[0].setAttribute("class", p[1]); }); };
    var light = function (row) {
      restore();
      var id = row.getAttribute("data-flavour");
      base.forEach(function (p) {
        var cls = p[1].replace(/\s*\blit(-\w+)?\b/g, "");
        p[0].setAttribute("class", cls);
      });
      Object.keys(groups).forEach(function (g) {
        (row.getAttribute("data-" + g) || "").split(",").forEach(function (n) {
          if (n === "") return;
          var el = plate.querySelector("#" + groups[g] + "-" + n);
          if (el) el.setAttribute("class", el.getAttribute("class") + " lit lit-" + id);
        });
      });
    };
    table.querySelectorAll("tbody tr[data-flavour]").forEach(function (row) {
      row.setAttribute("tabindex", "0");
      row.addEventListener("mouseenter", function () { light(row); });
      row.addEventListener("focus", function () { light(row); });
    });
    table.addEventListener("mouseleave", restore);
    table.addEventListener("focusout", function (e) { if (!table.contains(e.relatedTarget)) restore(); });
  }
})();
