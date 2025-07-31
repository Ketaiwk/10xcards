import { toast } from "sonner";

export const useNotifications = () => {
  const showError = (message: string) => {
    toast.error(message, {
      duration: 5000,
    });
  };

  const showSuccess = (message: string) => {
    toast.success(message, {
      duration: 3000,
    });
  };

  const showInfo = (message: string) => {
    toast.info(message, {
      duration: 3000,
    });
  };

  return {
    showError,
    showSuccess,
    showInfo,
  };
};
