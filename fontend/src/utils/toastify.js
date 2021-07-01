import { toast } from "react-toastify";
toast.configure();
export const toastifySuccess = (mess) => {
  toast.success(mess, {
    position: toast.POSITION.BOTTOM_RIGHT,
    autoClose: 2000,
  });
};

export const toastifyError = (mess) => {
  toast.error(mess, { position: toast.POSITION.BOTTOM_RIGHT, autoClose: 2000 });
};
export const toastifyInfo = (mess) => {
  toast.info(mess, { position: toast.POSITION.BOTTOM_RIGHT, autoClose: 2000 });
};
