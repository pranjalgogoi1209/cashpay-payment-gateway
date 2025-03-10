import { BrowserRouter, Routes, Route } from "react-router-dom";

import CreateOrder from "../pages/CreateOrder";
import Status from "../pages/Status";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateOrder />} />
        <Route path="/check-status" element={<Status />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
