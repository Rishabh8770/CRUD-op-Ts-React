import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toastContainerStyle = {
  fontSize: "1.25rem",
  width: "25rem",
  right: "6.25rem", // Adjust this value to move it left from the bottom-right corner
};
export const NotificationContainer = () => (
  <ToastContainer toastStyle={toastContainerStyle} />
);

// The toast function associated with the component is in utils/NotificationUtils.tsx
