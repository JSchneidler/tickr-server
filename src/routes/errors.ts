import { Type } from "@sinclair/typebox";

export const ERROR_RESPONSE_SCHEMAS = {
  400: Type.String(),
  401: Type.String(),
  403: Type.String(),
  404: Type.String(),
  500: Type.String(),
};
