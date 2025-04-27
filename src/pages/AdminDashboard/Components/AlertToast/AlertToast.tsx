import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import React from "react";

type AlertToastProps = {
  toastOpen: boolean;
  onClose: () => void;
  type: "success" | "error" | "info" | "warning";
  message: string;
};

const AlertToast: React.FC<AlertToastProps> = ({ toastOpen, onClose, type, message }) => {
  return (
    <Snackbar
      open={toastOpen}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert onClose={onClose} severity={type} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertToast;
