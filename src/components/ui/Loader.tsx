import { CircleLoader } from "react-spinners";

export const ButtonLoader = ({ color }: { color?: string }) => {
  return (
    <CircleLoader
      color={color || "white"}
      size={10}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
};

export const FullScreenLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white ">
      <CircleLoader
        color={"#ea3237"}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};
