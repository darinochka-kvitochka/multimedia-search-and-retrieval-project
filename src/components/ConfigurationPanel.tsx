import React from "react";

interface ConfigurationPanelProps {
  checkboxChecked: boolean;
  setCheckboxChecked: React.Dispatch<React.SetStateAction<boolean>>;
  checkboxMessage: string;
}

const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  checkboxChecked,
  setCheckboxChecked,
  checkboxMessage,
}) => {
  return (
    <div style={{ marginBottom: "10px" }}>
      <label>
        <input
          type="checkbox"
          checked={checkboxChecked}
          onChange={() => setCheckboxChecked((prev) => !prev)}
        />
        {checkboxMessage}
      </label>
    </div>
  );
};

export default ConfigurationPanel;
