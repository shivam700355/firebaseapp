export const validateEmail = (value: string) => {
  return /^\S+@\S+\.\S+$/.test(value.trim());
};

export const validateRequired = (value: string) => value.trim().length > 0;
