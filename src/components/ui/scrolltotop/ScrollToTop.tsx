import "./ScrollToTop.css";
import { BiSolidArrowFromBottom } from "react-icons/bi";

export function ScrollToTop(): JSX.Element {
  const handleTop = (): void => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="top-btn-container">
      <button
        className="top-btn"
        onClick={handleTop}
      >
        <BiSolidArrowFromBottom
          style={{ width: "40px", height: "40px" }}
        />
      </button>
    </div>
  );
}