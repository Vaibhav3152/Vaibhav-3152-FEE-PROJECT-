import { useState, useId } from "react";

// TABS: give it a list like [{ id, label, content }] and it shows one
// panel at a time. The tab buttons use the proper ARIA roles so a
// screen reader announces them as tabs.
export default function Tabs({ tabs, startTab }) {
  const baseId = useId();
  const [activeId, setActiveId] = useState(startTab || tabs[0].id);

  const activeTab = tabs.find((tab) => tab.id === activeId) || tabs[0];

  return (
    <div>
      <div className="ui-tabs" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={baseId + "-tab-" + tab.id}
            aria-selected={tab.id === activeTab.id}
            aria-controls={baseId + "-panel-" + tab.id}
            className={"ui-tab" + (tab.id === activeTab.id ? " ui-tab--active" : "")}
            onClick={() => setActiveId(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={baseId + "-panel-" + activeTab.id}
        aria-labelledby={baseId + "-tab-" + activeTab.id}
        className="ui-tabpanel"
      >
        {activeTab.content}
      </div>
    </div>
  );
}
