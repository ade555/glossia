export default function EndpointDetail({ spec, path, method }) {
  if (!spec || !path || !method) return null;

  const operation = spec.paths[path]?.[method];
  if (!operation) return null;

  return (
    <div className="p-8 max-w-4xl">
      {/* Method and Path */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <span
            className={`px-3 py-1 rounded text-sm font-semibold uppercase ${getMethodColor(method)}`}
          >
            {method}
          </span>
          <code className="text-lg font-mono text-gray-900">{path}</code>
        </div>

        {operation.summary && (
          <h1 className="text-2xl font-bold text-gray-900 mt-4">
            {operation.summary}
          </h1>
        )}

        {operation.description && (
          <p className="text-gray-600 mt-2 whitespace-pre-wrap">
            {operation.description}
          </p>
        )}
      </div>

      {/* Parameters */}
      {operation.parameters && operation.parameters.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Parameters
          </h2>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    In
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Required
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {operation.parameters.map((param, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 text-sm font-mono text-gray-900">
                      {param.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {param.schema?.type || "any"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {param.in}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {param.required ? (
                        <span className="text-red-600 font-semibold">Yes</span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {param.description || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Request Body */}
      {operation.requestBody && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Request Body
          </h2>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            {operation.requestBody.description && (
              <p className="text-gray-600 mb-3">
                {operation.requestBody.description}
              </p>
            )}

            {operation.requestBody.required && (
              <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded mb-3">
                Required
              </span>
            )}

            {/* Content types */}
            {operation.requestBody.content && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-2">Content Types:</p>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(operation.requestBody.content).map(
                    (contentType) => (
                      <code
                        key={contentType}
                        className="px-2 py-1 bg-white border border-gray-300 rounded text-xs"
                      >
                        {contentType}
                      </code>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Responses */}
      {operation.responses && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Responses
          </h2>

          <div className="space-y-4">
            {Object.entries(operation.responses).map(
              ([statusCode, response]) => (
                <div
                  key={statusCode}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <span
                      className={`px-3 py-1 rounded font-semibold text-sm ${getStatusColor(statusCode)}`}
                    >
                      {statusCode}
                    </span>
                    <span className="text-gray-900 font-medium">
                      {response.description}
                    </span>
                  </div>

                  {/* Response content types */}
                  {response.content && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-500 mb-2">
                        Content Types:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {Object.keys(response.content).map((contentType) => (
                          <code
                            key={contentType}
                            className="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs"
                          >
                            {contentType}
                          </code>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
        </section>
      )}
    </div>
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

function getStatusColor(status) {
  const code = parseInt(status);
  if (code >= 200 && code < 300) return "bg-green-100 text-green-800";
  if (code >= 300 && code < 400) return "bg-blue-100 text-blue-800";
  if (code >= 400 && code < 500) return "bg-yellow-100 text-yellow-800";
  if (code >= 500) return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-800";
}
