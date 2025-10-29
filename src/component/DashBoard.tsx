import BookFinder from "./BookFinder/BookFinder";
import Weather from "./WeatherComp/Weather";

type Props = {
  type:
    | "Outdoor Enthusiast"
    | "Geography Student"
    | "Busy Professional"
    | "College Student";
};
function DashBoard({ type }: Props) {
  return (
    <div className="max-w-[1000px] min-h-[calc(100vh-4rem)] h-auto mx-auto p-8 shadow-2xl shadow-gray-900">
      {type == "College Student" && <BookFinder />}
      {type == "Busy Professional" && <BookFinder />}
      {type == "Geography Student" && <BookFinder />}
      {type == "Outdoor Enthusiast" && <Weather />}
    </div>
  );
}

export default DashBoard;
