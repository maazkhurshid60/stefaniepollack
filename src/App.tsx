import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import Header from "./components/feature/Header";
import Footer from "./components/feature/Footer";
import ScrollToTop from "./components/feature/ScrollToTop";
import Cursor from "./components/feature/Cursor";
import AuthModal from "./components/feature/AuthModal";
import { AuthProvider } from "./hooks/useAuth";

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <BrowserRouter basename={__BASE_PATH__}>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <AppRoutes />
            </main>
            <Footer />
            <ScrollToTop />
            <Cursor />
            <AuthModal />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </I18nextProvider>
  );
}

export default App;