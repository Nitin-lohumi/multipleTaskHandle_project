import { useState } from "react";
import LandingPage from "./LandingPage";

function ChangeType({ setUser }: { setUser: (val: string) => void }) {
  const [isTypeChange, setIsTypeChange] = useState<boolean>(false);
  return (
    <div className="z-30">
      <div className="flex justify-end p-2">
        <button
          onClick={() => setIsTypeChange((prev) => !prev)}
          className="border pl-2 pr-2 p-1 rounded-2xl cursor-pointer bg-blue-700 text-white"
        >
          {isTypeChange ? "Cancel" : "change User Type"}
        </button>
      </div>
      {isTypeChange && (
        <div
          className="min-h-[calc(100vh-3.2rem)] p-2 flex justify-center items-center bg-gray-500/90
         absolute w-full z-30"
        >
          <LandingPage
            setUser={setUser}
            typeChange={true}
            setTypeChange={setIsTypeChange}
          />
        </div>
      )}
    </div>
  );
}

export default ChangeType;
