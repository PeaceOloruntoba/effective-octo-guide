import { toast } from "sonner";

export type HandleErrorOptions = {
  fallbackMessage?: string;
  silent?: boolean;
};

export function extractErrorMessage(error: any, fallback = "Something went wrong") {
  // axios error shape: error.response.data.error | error.message
  // API.md defines { error, errorMessage }
  const resMsg = error?.response?.data?.errorMessage || error?.response?.data?.error || error?.response?.data?.message;
  const msg = typeof resMsg === "string" ? resMsg : (error?.message as string | undefined);
  return msg || fallback;
}

export function handleError(error: any, options: HandleErrorOptions = {}) {
  const { fallbackMessage = "Something went wrong", silent = false } = options;
  const message = extractErrorMessage(error, fallbackMessage);

  if (import.meta.env.DEV) {
    // Log full error only in development
    // eslint-disable-next-line no-console
    console.error("[Error]", error);
  }

  if (!silent) {
    toast.error(message);
  }

  return message;
}
