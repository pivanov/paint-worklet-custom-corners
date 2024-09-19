import { useCallback, useState } from "react";
import { cn } from "./utils";

const tabs = [
  { title: 'Tab 1', content: 'Content 1' },
  { title: 'Tab 2', content: 'Content 2' },
  { title: 'Tab 3', content: 'Content 3' },
  { title: 'Tab 4', content: 'Content 4' },
];

export const App = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const index = Number(e.currentTarget.dataset.index!);
    setActiveTab(index);
  }, []);

  return (
    <div className="flex flex-col w-screen h-screen">
      <div className="h-20 flex flex-col justify-end bg-gray-200">
        <div className="flex gap-x-2 justify-center">
          {
            tabs.map((tab, index) => (
              <div
                key={index}
                data-index={index}
                onClick={handleTabChange}
                className={cn(
                  'tab',
                  'flex items-center',
                  'px-5',
                  'min-w-60 h-8',
                  'text-xs text-gray-400',
                  {
                    ['active text-gray-600']: activeTab === index,
                  }
                )}
              >
                {tab.title}
              </div>
            ))
          }
        </div>
      </div>
      <div
        key={activeTab}
        className="flex-1 flex items-center justify-center p-5 animate-fade-in animation-delay-300 opacity-0">
        {
          tabs[activeTab].content
        }
      </div>
    </div>
  );
};

App.displayName = 'App';
