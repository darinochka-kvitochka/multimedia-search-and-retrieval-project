import React, { useMemo, useCallback, useState } from "react";
import { MetadataByFile, Metadata } from "../api.types";
import ConfigurationPanel from "./ConfigurationPanel";
import DetailedEntry from "./DetailedEntry";

interface AvailableSystemsTableProps {
  precomputedSystems: MetadataByFile | null;
  selectedIRSfilename: string;
  setSelectedIRSfilename: React.Dispatch<React.SetStateAction<string>>;
}

const AvailableSystemsTable: React.FC<AvailableSystemsTableProps> = ({
  precomputedSystems,
  selectedIRSfilename,
  setSelectedIRSfilename,
}) => {
  const [showSystemsTable, setShowSystemsTable] = useState(true);
  const [showSelectedSystemDetails, setShowSelectedSystemDetails] =
    useState(false);

  const formatValue = useCallback((value: unknown): string => {
    if (typeof value === "number") {
      return (Math.round(value * 1000) / 1000).toString();
    }
    if (Array.isArray(value)) {
      return value.slice(0, 3).join(", ");
    }
    return value?.toString() ?? "";
  }, []);

  const handleShowRawData = (metadata: Metadata) => {
    const rawDataWindow = window.open("", "_blank");
    if (rawDataWindow) {
      rawDataWindow.document.write(
        `<pre>${JSON.stringify(metadata, null, 2)}</pre>`
      );
      rawDataWindow.document.close();
    }
  };

  const systemsTable = useMemo(() => {
    if (!precomputedSystems) return null;

    const systems = Object.entries(precomputedSystems).sort();
    const metadataKeys = systems.length > 0 ? Object.keys(systems[0][1]) : [];

    return (
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Filename</th>
            {metadataKeys.map((key) => (
              <th key={key}>{key}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {systems
            .sort((a, b) => {
              const featureSpaceA = a[1].feature_space || "";
              const featureSpaceB = b[1].feature_space || "";
              if (
                typeof featureSpaceA !== "string" ||
                typeof featureSpaceB !== "string"
              ) {
                return 0;
              }
              return featureSpaceA.localeCompare(featureSpaceB);
            })
            .map(([systemFilename, metadata], index) => {
              const isSelected = systemFilename === selectedIRSfilename;
              return (
                <tr
                  key={systemFilename}
                  style={{
                    ...(isSelected ? { backgroundColor: "#cce5ff" } : {}),
                  }}
                >
                  <td>{index + 1}</td>
                  <td>{systemFilename}</td>
                  {metadataKeys.map((key) =>
                    key === "feature_columns" ? (
                      <td
                        key={key}
                        style={{
                          maxWidth: "80px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {`${metadata[key].slice(0, 5).join(", ")},...`}
                      </td>
                    ) : (
                      <td key={key}>{formatValue(metadata[key])}</td>
                    )
                  )}
                  <td>
                    <button onClick={() => handleShowRawData(metadata)}>
                      Show Raw Data
                    </button>
                    <button
                      style={{ marginLeft: "10px" }}
                      onClick={() => setSelectedIRSfilename(systemFilename)}
                    >
                      Select IRS
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    );
  }, [
    precomputedSystems,
    selectedIRSfilename,
    formatValue,
    setSelectedIRSfilename,
  ]);

  return (
    <>
      <div style={{ display: "flex", gap: "20px" }}>
        <ConfigurationPanel
          checkboxChecked={showSystemsTable}
          setCheckboxChecked={setShowSystemsTable}
          checkboxMessage={"Display table of available systems"}
        />
        <ConfigurationPanel
          checkboxChecked={showSelectedSystemDetails}
          setCheckboxChecked={setShowSelectedSystemDetails}
          checkboxMessage={"Display details of the selected system"}
        />
      </div>
      {showSystemsTable && systemsTable}
      {showSelectedSystemDetails &&
        precomputedSystems &&
        selectedIRSfilename && (
          <DetailedEntry
            entry={precomputedSystems[selectedIRSfilename]}
            style={{ marginTop: "10px" }}
          />
        )}
    </>
  );
};

export default AvailableSystemsTable;
