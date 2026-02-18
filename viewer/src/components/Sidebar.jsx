export default function Sidebar({ spec, selectedEndpoint, onSelectEndpoint }) {
  if (!spec || !spec.paths) {
    return (
      <aside className="w-64 bg-white border-r border-gray-200 p-4">
        <p className="text-gray-500 text-sm">No endpoints found</p>
      </aside>
    );
  }

  // Group endpoints by tag if available
  const endpointsByTag = {};

  Object.entries(spec.paths).forEach(([path, pathItem]) => {
    Object.entries(pathItem).forEach(([method, operation]) => {
      if (method === "parameters" || method === "servers") return; // Skip non-methods

      const tags = operation.tags || ["Default"];
      tags.forEach((tag) => {
        if (!endpointsByTag[tag]) {
          endpointsByTag[tag] = [];
        }
        endpointsByTag[tag].push({ path, method, operation });
      });
    });
  });

  return (
    <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Endpoints
        </h2>

        {Object.entries(endpointsByTag).map(([tag, endpoints]) => (
          <div key={tag} className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">{tag}</h3>

            <div className="space-y-1">
              {endpoints.map(({ path, method, operation }) => {
                const isSelected =
                  selectedEndpoint?.path === path &&
                  selectedEndpoint?.method === method;

                return (
                  <button
                    key={`${method}-${path}`}
                    onClick={() => onSelectEndpoint({ path, method })}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      isSelected
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${getMethodColor(method)}`}
                      >
                        {method}
                      </span>
                      <span className="truncate">{path}</span>
                    </div>
                    {operation.summary && (
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {operation.summary}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

function getMethodColor(method) {
  const colors = {
    get: "bg-blue-100 text-blue-800",
    post: "bg-green-100 text-green-800",
    put: "bg-yellow-100 text-yellow-800",
    delete: "bg-red-100 text-red-800",
    patch: "bg-purple-100 text-purple-800",
  };

  return colors[method.toLowerCase()] || "bg-gray-100 text-gray-800";
}
