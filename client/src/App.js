import Canvas from "./components/Canvas";
import Settingbar from "./components/Settingbar";
import Toolbar from "./components/Toolbar";
import "./styles/app.scss";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route
            path="/:id"
            element={
              <>
                <Toolbar />
                <Settingbar />
                <Canvas />
              </>
            }
          />
          <Route path="*" element={<Navigate to={`f${(+new Date).toString(16)}`} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
