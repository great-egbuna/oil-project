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
