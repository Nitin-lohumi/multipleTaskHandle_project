import { useState } from "react";
import LandingPage from "./component/LandingPage";
import ChangeType from "./component/ChangeType";
import DashBoard from "./component/DashBoard";
import "leaflet/dist/leaflet.css";
function App() {
  const [istype, setUserType] = useState(() =>
    localStorage.getItem("userType")
  );
  return (
    <div>
      {!istype ? (
        <div className="border h-screen p-2 flex justify-center items-center">
          <LandingPage setUser={setUserType} />
        </div>
      ) : (
        <>
          <ChangeType setUser={setUserType} />
          {istype == "Geography Student" && (
            <DashBoard type="Geography Student" />
          )}
          {istype == "Outdoor Enthusiast" && (
            <DashBoard type="Outdoor Enthusiast" />
          )}
          {istype == "Busy Professional" && (
            <DashBoard type="Busy Professional" />
          )}
          {istype == "College Student" && <DashBoard type="College Student" />}
        </>
      )}
    </div>
  );
}

export default App;
