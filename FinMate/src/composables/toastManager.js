let containerInstance = null;

export const setToastInstance = (instance) => {
  containerInstance = instance;
};

export const getToastInstance = () => containerInstance;
