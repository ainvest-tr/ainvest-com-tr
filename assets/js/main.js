(function () {
  "use strict";

  var nav = document.getElementById("site-nav");
  var toggle = document.getElementById("nav-toggle");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setNavOpen(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = !nav.classList.contains("is-open");
      setNavOpen(open);
    });

    nav.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 900px)").matches) {
          setNavOpen(false);
        }
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setNavOpen(false);
    });
  }

  if (!reduceMotion && "IntersectionObserver" in window) {
    var els = document.querySelectorAll(".reveal");
    if (els.length) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("reveal--visible");
              io.unobserve(entry.target);
            }
          });
        },
        { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
      els.forEach(function (el) {
        io.observe(el);
      });
    }
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("reveal--visible");
    });
  }

  var TV_CFG = {
    autosize: true,
    symbol: "BIST:XU100",
    interval: "D",
    timezone: "Europe/Istanbul",
    theme: "dark",
    style: "1",
    locale: "tr",
    enable_publishing: false,
    allow_symbol_change: false,
    calendar: false,
    hide_volume: false,
    support_host: "https://www.tradingview.com",
  };

  function mountTradingView(container) {
    if (!container || container.getAttribute("data-tv-mounted") === "1") return;
    container.setAttribute("data-tv-mounted", "1");
    container.innerHTML =
      '<div class="tradingview-widget-container">' +
      '<div class="tradingview-widget-container__widget"></div>' +
      '<div class="tradingview-widget-copyright">' +
      '<a href="https://www.tradingview.com/symbols/BIST-XU100/" rel="noopener nofollow noreferrer" target="_blank">' +
      "<span>BIST 100 — TradingView</span></a></div></div>";

    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.textContent = JSON.stringify(TV_CFG);
    container.querySelector(".tradingview-widget-container").appendChild(script);
  }

  var chartHost = document.getElementById("tv-mount");
  var loadBtn = document.getElementById("load-chart-btn");

  if (chartHost && loadBtn) {
    loadBtn.addEventListener("click", function () {
      var ph = document.getElementById("chart-placeholder");
      if (ph) ph.hidden = true;
      chartHost.hidden = false;
      loadBtn.hidden = true;
      mountTradingView(chartHost);
    });
  }
})();
