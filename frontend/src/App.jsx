import { BrowserRouter as Router } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function App() {
  const { t } = useTranslation();

  return (
    <Router>
      <div className="min-h-screen">
        <h1 className="text-4xl font-bold text-center py-10">
          {t('nav.home')} - FarmEasy
        </h1>
        <p className="text-center text-gray-600">
          Frontend setup complete. Building pages next...
        </p>
      </div>
    </Router>
  );
}

export default App;