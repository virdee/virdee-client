export const generateErrorMessage = (error: unknown): string => {
  let message = "Unknown error";

  if (error instanceof Error) {
    message = error.message;
  }

  return message;
};
