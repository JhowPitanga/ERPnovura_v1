
import { NavLink } from "react-router-dom";

interface NavigationItem {
  title: string;
  path: string;
  description?: string;
}

interface CleanNavigationProps {
  items: NavigationItem[];
  basePath?: string;
}

export function CleanNavigation({ items, basePath = "" }: CleanNavigationProps) {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="flex items-center space-x-8 px-6 py-4">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={`${basePath}${item.path}`}
            className={({ isActive }) =>
              `relative flex flex-col items-start pb-4 transition-colors duration-200 ${
                isActive
                  ? "text-novura-primary"
                  : "text-gray-600 hover:text-gray-900"
              } group`
            }
          >
            {({ isActive }) => (
              <>
                <span className="font-medium text-sm">{item.title}</span>
                {item.description && (
                  <span className="text-xs text-gray-500 mt-1">
                    {item.description}
                  </span>
                )}
                <div
                  className={`absolute bottom-0 left-0 h-0.5 bg-novura-primary transition-all duration-200 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
