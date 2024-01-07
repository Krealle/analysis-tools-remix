import { Type } from "@sinclair/typebox";
import Ajv from "ajv";

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isGraphQLError(
  data: unknown
): data is typeof GraphQLErrorResponse {
  const ajv = new Ajv();
  const validate = ajv.compile(GraphQLErrorResponse);

  return validate(data);
}
const GraphQLErrorResponse = Type.Object({
  error: Type.Any(),
});
