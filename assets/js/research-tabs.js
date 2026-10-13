(function () {
  "use strict";

  var tabList = document.querySelector(".research-tabs");
  var panelsContainer = document.querySelector(".research-panels");

  if (!tabList || !panelsContainer) {
    return;
  }

  var tabs = Array.prototype.slice.call(
    tabList.querySelectorAll("[data-research-tab]")
  );
  var panels = Array.prototype.slice.call(
    panelsContainer.querySelectorAll("[data-research-panel]")
  );

  function selectTab(panelId, moveFocus, updateHash) {
    var selectedTab = tabs.find(function (tab) {
      return tab.getAttribute("data-research-tab") === panelId;
    });

    if (!selectedTab) {
      return;
    }

    tabs.forEach(function (tab) {
      var selected = tab === selectedTab;
      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });

    panels.forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-research-panel") !== panelId;
    });

    if (moveFocus) {
      selectedTab.focus();
    }

    if (updateHash && window.history && window.history.replaceState) {
      window.history.replaceState(null, "", "#" + panelId);
    }
  }

  tabList.classList.add("is-enhanced");
  panelsContainer.classList.add("is-enhanced");

  var initialPanel = window.location.hash.slice(1);
  var initialMatch = panels.some(function (panel) {
    return panel.getAttribute("data-research-panel") === initialPanel;
  });
  selectTab(initialMatch ? initialPanel : "working-papers", false, false);

  tabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
      selectTab(tab.getAttribute("data-research-tab"), false, true);
    });

    tab.addEventListener("keydown", function (event) {
      var nextIndex;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        nextIndex = (index + 1) % tabs.length;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = tabs.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      selectTab(
        tabs[nextIndex].getAttribute("data-research-tab"),
        true,
        true
      );
    });
  });

  window.addEventListener("hashchange", function () {
    var panelId = window.location.hash.slice(1);
    selectTab(panelId, false, false);
  });
})();
