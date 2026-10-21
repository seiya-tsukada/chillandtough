import React from 'react';
import { useCommerce } from '../context/CommerceContext';
import { ExperientialStory } from '../types';

export const StoriesBar: React.FC = () => {
  const { stories, setActiveStory } = useCommerce();

  return (
    <div className="border-b border-neutral-200 bg-white py-3 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-1">
          {stories.map((story: ExperientialStory) => (
            <button
              key={story.id}
              onClick={() => setActiveStory(story)}
              className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 rounded-lg p-1"
            >
              <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 transition-transform group-hover:scale-105 duration-200">
                <div className="p-0.5 bg-white rounded-full">
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover"
                  />
                </div>
              </div>
              <span className="text-xs font-medium text-neutral-800 max-w-[70px] truncate text-center">
                {story.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
