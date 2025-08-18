import { getToastInstance } from "./toastManager";

/**
 * 토스트 메시지를 띄우는 함수
 * @returns { (message: string, type: string, duration?: number) => void }
 */
export const useToast = () => {
  const toast = (message, type = "info", duration = 4000) => {
    const instance = getToastInstance();
    if (instance) {
      instance.addToast(message, type, duration);
    }
  };

  return { toast };
};
