import { useState } from "react";
import useIntervalParametersStore from "../../zustand/intervalParametersStore";
import PopupContent from "../generic/PopupContent";
import { validateIntervalFormat } from "../../zustand/interval/validation";

const ExperimentalIntervalImport: React.FC = () => {
  const [importValue, setImportValue] = useState<string>("");
  const [isProperFormat, setIsProperFormat] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { importIntervals } = useIntervalParametersStore();

  const handleChange = (input: string): void => {
    setImportValue(input);

    try {
      const parsedInput = JSON.parse(input);
      const maybeProperInput = validateIntervalFormat(parsedInput);

      if (!maybeProperInput) {
        setError("Not properly formatted input.");
        setIsProperFormat(false);
        return;
      }

      setError("");
      setIsProperFormat(true);
    } catch (error) {
      setIsProperFormat(false);
      setError("Not properly formatted JSON.");
    }
  };

  const content = (
    <div>
      <textarea
        value={importValue}
        className="mrtNoteTextbox"
        onChange={(e) => handleChange(e.target.value)}
      />
      <p>{error}</p>
      <button
        onClick={() => {
          importIntervals(importValue);
          setImportValue("");
          alert("Intervals Imported!");
        }}
        disabled={!isProperFormat}
      >
        Import Intervals
      </button>
    </div>
  );

  return <PopupContent content={content} name="Import" />;
};

export default ExperimentalIntervalImport;
