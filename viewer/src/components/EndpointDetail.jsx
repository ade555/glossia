import ReactMarkdown from "react-markdown";

export default function EndpointDetail({ spec, path, method }) {
  if (!spec || !path || !method) return null;

  const operation = spec.paths[path]?.[method];
  if (!operation) return null;

  return (
    <div className="p-8 max-w-5xl">
      {/* Method and Path */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <span
            className={`px-3 py-1 rounded text-sm font-semibold uppercase ${getMethodColor(method)}`}
          >
            {method}
          </span>
          <code className="text-xl font-mono text-gray-900 bg-gray-100 px-3 py-1 rounded">
            {path}
          </code>
        </div>

        {operation.summary && (
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {operation.summary}
          </h1>
        )}

        {operation.description && (
          <div className="prose prose-sm max-w-none text-gray-600 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <ReactMarkdown>{operation.description}</ReactMarkdown>
          </div>
        )}
      </div>

      {/* Parameters */}
      {operation.parameters && operation.parameters.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            Parameters
          </h2>

          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    In
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Required
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {operation.parameters.map((param, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">
                      <code className="font-mono text-blue-600 font-medium">
                        {param.name}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="text-gray-600 font-mono text-xs">
                        {param.schema?.type || "any"}
                        {param.schema?.format && (
                          <span className="text-gray-400">
                            {" "}
                            ({param.schema.format})
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                        {param.in}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {param.required ? (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold">
                          Required
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">Optional</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="text-gray-600 max-w-md">
                        {param.description ? (
                          <div className="prose prose-sm max-w-none">
                            <ReactMarkdown>{param.description}</ReactMarkdown>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                        {param.schema?.example && (
                          <div className="mt-1">
                            <span className="text-xs text-gray-500">
                              Example:
                            </span>{" "}
                            <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
                              {JSON.stringify(param.schema.example)}
                            </code>
                          </div>
                        )}
                        {param.schema?.default !== undefined && (
                          <div className="mt-1">
                            <span className="text-xs text-gray-500">
                              Default:
                            </span>
                            <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
                              {JSON.stringify(param.schema.default)}
                            </code>
                          </div>
                        )}
                      </div>
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            Request Body
          </h2>

          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            {operation.requestBody.description && (
              <div className="prose prose-sm max-w-none text-gray-600 mb-4">
                <ReactMarkdown>
                  {operation.requestBody.description}
                </ReactMarkdown>
              </div>
            )}

            <div className="flex items-center space-x-3 mb-3">
              {operation.requestBody.required && (
                <span className="inline-block px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                  Required
                </span>
              )}
            </div>

            {operation.requestBody.content && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Content Types:
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(operation.requestBody.content).map(
                    (contentType) => (
                      <code
                        key={contentType}
                        className="px-3 py-1 bg-gray-50 border border-gray-300 rounded text-sm font-mono text-gray-700"
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            Responses
          </h2>

          <div className="space-y-4">
            {Object.entries(operation.responses).map(
              ([statusCode, response]) => (
                <div
                  key={statusCode}
                  className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <span
                      className={`px-3 py-1.5 rounded font-bold text-sm ${getStatusColor(statusCode)}`}
                    >
                      {statusCode}
                    </span>
                    <span className="text-gray-900 font-medium text-base">
                      {response.description}
                    </span>
                  </div>

                  {response.content && (
                    <div className="mt-4 pl-4 border-l-2 border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Content Types:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {Object.keys(response.content).map((contentType) => (
                          <code
                            key={contentType}
                            className="px-3 py-1 bg-gray-50 border border-gray-200 rounded text-sm font-mono text-gray-700"
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

      {/* Operation ID and Tags (metadata) */}
      {(operation.operationId || operation.tags) && (
        <section className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            {operation.operationId && (
              <div>
                <span className="font-medium text-gray-700">Operation ID:</span>{" "}
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {operation.operationId}
                </code>
              </div>
            )}
            {operation.tags && operation.tags.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-700">Tags:</span>
                {operation.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function getMethodColor(method) {
  const colors = {
    get: "bg-blue-100 text-blue-800 border border-blue-200",
    post: "bg-green-100 text-green-800 border border-green-200",
    put: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    delete: "bg-red-100 text-red-800 border border-red-200",
    patch: "bg-purple-100 text-purple-800 border border-purple-200",
  };

  return (
    colors[method.toLowerCase()] ||
    "bg-gray-100 text-gray-800 border border-gray-200"
  );
}

function getStatusColor(status) {
  const code = parseInt(status);
  if (code >= 200 && code < 300)
    return "bg-green-100 text-green-800 border border-green-300";
  if (code >= 300 && code < 400)
    return "bg-blue-100 text-blue-800 border border-blue-300";
  if (code >= 400 && code < 500)
    return "bg-yellow-100 text-yellow-800 border border-yellow-300";
  if (code >= 500) return "bg-red-100 text-red-800 border border-red-300";
  return "bg-gray-100 text-gray-800 border border-gray-300";
}
