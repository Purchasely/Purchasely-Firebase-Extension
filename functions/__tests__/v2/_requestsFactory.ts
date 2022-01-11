import express from "express";
import Crypto from "crypto";

export const requestFactory = (sharedSecret: string) => (body: {} | null): { request: express.Request, response: express.Response } => {
  const timestamp = Date.now();
  const dataToSign = sharedSecret + timestamp;
  const computedSignature = Crypto
    .createHmac("sha256", sharedSecret)
    .update(dataToSign)
    .digest("hex");

  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
    "X-PURCHASELY-SIGNATURE": computedSignature,
    "X-PURCHASELY-TIMESTAMP": `${timestamp}`
  };
  let request: express.Request = {
    get: (headerName: string) => headers[headerName],
    body: body ?? {}
  } as express.Request;

  let response: express.Response = {
    send: () => { },
    status: (_code: number) => response,
  } as express.Response;
  return { request, response };
}