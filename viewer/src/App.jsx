import { useState, useEffect } from "react";
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
  const [spec, setSpec] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentLanguage, setCurrentLanguage] = useState(null);
  const [currentSpecFile, setCurrentSpecFile] = useState(null);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [availableSpecs, setAvailableSpecs] = useState([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);

  // Initialize on mount
  useEffect(() => {
    async function init() {
      try {
        setLoading(true);

        // Get defaults
        const defaultLang = await getDefaultLanguage();
        const defaultSpec = await getDefaultSpec();
        const languages = await getAvailableLanguages();
        const index = await getSpecIndex();

        setCurrentLanguage(defaultLang);
        setCurrentSpecFile(defaultSpec);
        setAvailableLanguages(languages.all);
        setAvailableSpecs(index[defaultLang] || []);

        // Load the default spec
        const loadedSpec = await loadSpec(defaultLang, defaultSpec);
        setSpec(loadedSpec);

        // Auto-select first endpoint
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
  }, []);

  // Reload spec when language or file changes
  useEffect(() => {
    if (!currentLanguage || !currentSpecFile) return;

    async function reload() {
      try {
        setLoading(true);
        const loadedSpec = await loadSpec(currentLanguage, currentSpecFile);
        setSpec(loadedSpec);

        // Reselect first endpoint in new spec
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
  }, [currentLanguage, currentSpecFile]);

  // Update available specs when language changes
  useEffect(() => {
    if (!currentLanguage) return;

    async function updateSpecs() {
      const index = await getSpecIndex();
      setAvailableSpecs(index[currentLanguage] || []);
    }

    updateSpecs();
  }, [currentLanguage]);

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
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {spec?.info?.title || "API Documentation"}
            </h1>

            {/* Spec selector (if multiple specs) */}
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

          <LanguageSwitcher
            currentLanguage={currentLanguage}
            availableLanguages={availableLanguages}
            onLanguageChange={setCurrentLanguage}
          />
        </div>

        {spec?.info?.description && (
          <p className="text-gray-600 mt-2 text-sm">{spec.info.description}</p>
        )}
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          spec={spec}
          selectedEndpoint={selectedEndpoint}
          onSelectEndpoint={setSelectedEndpoint}
        />

        <main className="flex-1 overflow-y-auto">
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
