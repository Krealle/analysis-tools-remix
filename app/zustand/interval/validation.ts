import Ajv from "ajv";
import { EncounterEbonMightWindows } from "../intervalParametersStore";

export const validateIntervalFormat = (
  input: unknown
): EncounterEbonMightWindows | false => {
  const ajv = new Ajv();
  const validate = ajv.compile(EncounterEbonMightWindows);

  const valid = validate(input);

  if (valid) {
    return input as EncounterEbonMightWindows;
  } else {
    return false;
  }
};
