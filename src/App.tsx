import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import ChatPanel from "./components/ChatPanel/ChatPanel";
import { ClientProvider } from "./providers/ClientProvider";
import RoomView from "./components/RoomView/RoomView";
import { PresenceProvider } from "./providers/PresenceProvider";
import { Provider } from "react-redux";
import { store } from "./redux/app/store";
import "./App.css";
import { UseModelProvider } from "providers/useModalProvider";
import { MatrixSyncProvider } from "providers/CallProvider";
import Login from "components/Login/Login";
import "react-toastify/dist/ReactToastify.css";
import CallHistoryComponent from "components/CallHistory/CallHistory";

function App() {
  return (
    <div className="app-container">
      <Provider store={store}>
        <ClientProvider>
          <PresenceProvider>
            <UseModelProvider>
              <MatrixSyncProvider>
                <Suspense fallback={"Hello"}>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={Layout}>
                      <Route path="/chat" element={<ChatPanel />}>
                        <Route path="/chat:id" element={<RoomView />} />
                      </Route>
                      <Route path="/call-history" element={<CallHistoryComponent/>} />
                    </Route>
                  </Routes>
                </Suspense>
              </MatrixSyncProvider>
            </UseModelProvider>
          </PresenceProvider>
        </ClientProvider>
      </Provider>
    </div>
  );
}

export default App;
