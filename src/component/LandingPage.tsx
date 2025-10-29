import { FormControl, InputLabel, NativeSelect } from "@mui/material";
import { memo, useState } from "react";
type Props = {
  setUser: (type: string) => void;
  typeChange?: boolean;
  setTypeChange?: (val: boolean) => void;
};
const LandingPage = memo(
  ({ setUser, typeChange = false, setTypeChange }: Props) => {
    const [userType, setUserType] = useState("");
    const handleSetType = () => {
      if (userType == "") {
        return;
      }
      if (typeChange) {
        setTypeChange ? setTypeChange(false) : "";
      }
      localStorage.setItem("userType", userType);
      setUser(userType);
    };
    return (
      <>
        <div
          className={`sm:max-w-[1000px] p-2 h-auto border sm:min-w-10 ${
            typeChange && "z-40 bg-gray-200"
          }
       w-full flex flex-col items-center justify-center shadow-2xl shadow-blue-900 rounded-xl`}
        >
          <h1 className="p-1 text-center capitalize font-serif text-blue-800 text-2xl">
            {typeChange ? "Change" : "choose"} the user type
          </h1>
          <p className="p-3 mb-1 font-thin text-lg text-gray-700">
            What type of user you are!
          </p>
          <FormControl className="w-fit p-4! mt-1! mb-5!">
            <InputLabel
              variant="standard"
              htmlFor="uncontrolled-native"
              className="text-2xs! text-gray-400!  pl-6! pb-1! text-shadow-xl! text-shadow-blue-500!"
            >
              User type
            </InputLabel>
            <NativeSelect
              defaultValue={
                typeChange ? localStorage.getItem("userType") : userType
              }
              onChange={(e) => setUserType(e.target.value)}
              inputProps={{
                name: "age",
                id: "uncontrolled-native",
              }}
              className="flex! p-2! text-lg! text-gray-800!"
            >
              <option value="">Select user type...</option>
              <option value={"College Student"} className="p-3!">
                College Student
              </option>
              <option value={"Outdoor Enthusiast"} className="p-1">
                Outdoor Enthusiast
              </option>
              <option value={"Busy Professional"} className="p-1">
                Busy Professional
              </option>
              <option value={"Geography Student"} className="p-1">
                Geography Student
              </option>
            </NativeSelect>
          </FormControl>
          <div className="w-full flex justify-between items-center p-3">
            <h1 className="text-lg flex items-center gap-2 text-wrap">
              {userType && (
                <>
                  <span className="sm:text-xl text-xs/snug sm:block hidden">
                    seleted:
                  </span>
                  <span className="sm:text-xl  text-2xs sm:font-serif font-thin text-blue-600 text-wrap">
                    {userType}
                  </span>
                </>
              )}
            </h1>
            <button
              className="shadow-xs font-medium shadow-blue-500 pl-2 pr-2 p-1 rounded-xl
            text-gray-50  cursor-pointer bg-green-600 focus:font-thin"
              onClick={handleSetType}
            >
              Start Searching
            </button>
          </div>
        </div>
      </>
    );
  }
);

export default LandingPage;
