import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";
import { useLingoContext } from "@lingo.dev/compiler/react";
import {
  getDefaultLanguage,
  getDefaultSpec,
  getAvailableLanguages,
  getSpecIndex,
  loadSpec,
} from "./utils/specLoader";
import Sidebar from "./components/Sidebar";
import EndpointDetail from "./components/EndpointDetail";
import LanguageSwitcher from "./components/LanguageSwitcher";

function App() {
  const { locale: uiLocale, setLocale: setUILocale } = useLingoContext(); // UI language from compiler

  const [spec, setSpec] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentSpecFile, setCurrentSpecFile] = useState(null);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [availableSpecs, setAvailableSpecs] = useState([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Initialize on mount
  useEffect(() => {
    async function init() {
      try {
        setLoading(true);

        const defaultLang = await getDefaultLanguage();
        const defaultSpec = await getDefaultSpec();
        const languages = await getAvailableLanguages();
        const index = await getSpecIndex();

        // Set UI language to match default API spec language
        setUILocale(defaultLang);

        setCurrentSpecFile(defaultSpec);
        setAvailableLanguages(languages.all);
        setAvailableSpecs(index[defaultLang] || []);

        const loadedSpec = await loadSpec(defaultLang, defaultSpec);
        setSpec(loadedSpec);

        if (loadedSpec.paths) {
          const firstPath = Object.keys(loadedSpec.paths)[0];
          const firstMethod = Object.keys(loadedSpec.paths[firstPath])[0];
          setSelectedEndpoint({ path: firstPath, method: firstMethod });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [setUILocale]);

  // Reload spec when UI language changes
  useEffect(() => {
    if (!uiLocale || !currentSpecFile) return;

    async function reload() {
      try {
        setLoading(true);
        const loadedSpec = await loadSpec(uiLocale, currentSpecFile);
        setSpec(loadedSpec);

        if (loadedSpec.paths) {
          const firstPath = Object.keys(loadedSpec.paths)[0];
          const firstMethod = Object.keys(loadedSpec.paths[firstPath])[0];
          setSelectedEndpoint({ path: firstPath, method: firstMethod });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    reload();
  }, [uiLocale, currentSpecFile]);

  // Update available specs when language changes
  useEffect(() => {
    if (!uiLocale) return;

    async function updateSpecs() {
      const index = await getSpecIndex();
      setAvailableSpecs(index[uiLocale] || []);
    }

    updateSpecs();
  }, [uiLocale]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading API documentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Failed to load documentation
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Make sure you've run `glossia generate` first.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {spec?.info?.title || "API Documentation"}
            </h1>

            {availableSpecs.length > 1 && (
              <select
                value={currentSpecFile}
                onChange={(e) => setCurrentSpecFile(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {availableSpecs.map((specFile) => (
                  <option key={specFile} value={specFile}>
                    {specFile}
                  </option>
                ))}
              </select>
            )}
          </div>

          <LanguageSwitcher availableLanguages={availableLanguages} />
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          spec={spec}
          selectedEndpoint={selectedEndpoint}
          onSelectEndpoint={setSelectedEndpoint}
        />

        <main className="flex-1 overflow-y-auto">
          {spec?.info?.description && !selectedEndpoint && (
            <div className="p-8 max-w-5xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Overview
              </h2>
              <div className="prose prose-slate max-w-none">
                <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-6 border border-slate-200">
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => (
                        <p
                          className="text-gray-700 leading-relaxed mb-3 last:mb-0"
                          {...props}
                        />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="space-y-2 my-3 ml-4" {...props} />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="text-gray-700 flex items-start">
                          <span className="text-blue-600 mr-2 mt-0.5">•</span>
                          <span>{props.children}</span>
                        </li>
                      ),
                      strong: ({ node, ...props }) => (
                        <strong
                          className="font-semibold text-gray-900"
                          {...props}
                        />
                      ),
                    }}
                  >
                    {spec.info.description}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          )}

          {selectedEndpoint && (
            <EndpointDetail
              spec={spec}
              path={selectedEndpoint.path}
              method={selectedEndpoint.method}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
