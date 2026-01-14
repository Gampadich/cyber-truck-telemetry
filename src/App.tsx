import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TabletPage } from "./pages/forAtablet/tabletPage";
import { PhonePage } from "./pages/forPhone/phonePage";
import { MainPage } from "./pages/MainPage/mainPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/phone" element={<PhonePage />} />
        <Route path="/tablet" element={<TabletPage />} />
        <Route path="/" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}
