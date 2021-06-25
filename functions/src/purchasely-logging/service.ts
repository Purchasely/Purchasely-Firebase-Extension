import { Request, Response } from "express";

const Logger = ({
  debug: console.debug,
  error: console.error,
  info: console.info,
})

export type PurchaselyLoggingServiceInterface = {
  logger: {
    debug: (message?: any, ...optionalParams: any[]) => void;
    error: (message?: any, ...optionalParams: any[]) => void;
    info: (message?: any, ...optionalParams: any[]) => void;
  };
  cloudFunctionCrashLogger: (func: (request: Request, response: Response) => Promise<void>) => (request: Request, response: Response) => Promise<void>;
}

export const PurchaselyLoggingService = (): PurchaselyLoggingServiceInterface => ({
  logger: Logger,
  cloudFunctionCrashLogger: (func: (request: Request, response: Response) => Promise<void>) => ((request: Request, response: Response): Promise<void> => {
    return func(request, response).catch((error) => {
      Logger.error(error)
      return Promise.reject(error);
    })
  }),
});
