import React, { useState, useMemo } from "react";
import { MetadataByFile } from "../api.types";

interface SystemSelectionPanelProps {
  precomputedSystems: MetadataByFile | null;
  setSelectedIRSfilename: React.Dispatch<React.SetStateAction<string>>;
}

const SystemSelectionPanel: React.FC<SystemSelectionPanelProps> = ({
  setSelectedIRSfilename,
  precomputedSystems,
}) => {
  const [selectedSystemName, setSelectedSystemName] = useState<string>("");
  const [selectedSimilarityMetric, setSelectedSimilarityMetric] =
    useState<string>("");
  const [selectedN, setSelectedN] = useState<number>(0);

  const handleSelectSystem = () => {
    // Handle the system selection logic here
    console.log("Selected system:", selectedSystemName);
    console.log("Selected similarity metric:", selectedSimilarityMetric);
    console.log("N value:", selectedN);
    if (
      !precomputedSystems ||
      !selectedSystemName ||
      !selectedSimilarityMetric ||
      !selectedN
    ) {
      alert("Please select a system, similarity metric, and N value.");
      return null;
    }

    const selectedSystemFilename = Object.keys(precomputedSystems).find(
      (key) =>
        precomputedSystems[key].IR_system_name === selectedSystemName &&
        precomputedSystems[key].similarity_metric ===
          selectedSimilarityMetric &&
        precomputedSystems[key].N === selectedN
    );
    if (!selectedSystemFilename) {
      alert("System not found.");
      return null;
    }
    console.log("Selected system filename:", selectedSystemFilename);
    setSelectedIRSfilename(selectedSystemFilename);
  };

  const uniqueIRSystemNameOptions = useMemo(() => {
    if (!precomputedSystems) return [];

    return Array.from(
      new Set(
        Object.values(precomputedSystems).map((system) => system.IR_system_name)
      )
    ).map((systemName) => (
      <option key={systemName} value={systemName}>
        {systemName}
      </option>
    ));
  }, [precomputedSystems]);

  const distinctSimilarityMetricsOptions = useMemo(() => {
    if (!precomputedSystems) return [];

    const matchingSystemsMetadata = Object.values(precomputedSystems).filter(
      (metadata) => metadata.IR_system_name === selectedSystemName
    );
    if (!matchingSystemsMetadata) return [];

    const distinctMetricsList = Array.from(
      new Set(
        matchingSystemsMetadata.map((metadata) => metadata.similarity_metric)
      )
    );

    if (!distinctMetricsList) return [];

    return distinctMetricsList.map((metric) => (
      <option key={metric} value={metric}>
        {metric}
      </option>
    ));
  }, [precomputedSystems, selectedSystemName]);

  const distinctNValuesOptions = useMemo(() => {
    if (!precomputedSystems) return [];

    const matchingSystemsMetadata = Object.values(precomputedSystems).filter(
      (metadata) =>
        metadata.IR_system_name === selectedSystemName &&
        metadata.similarity_metric === selectedSimilarityMetric
    );
    if (!matchingSystemsMetadata) return [];

    const distinctNValuesList = Array.from(
      new Set(matchingSystemsMetadata.map((metadata) => metadata.N))
    );

    if (!distinctNValuesList) return [];

    return distinctNValuesList.map((n) => (
      <option key={n} value={n}>
        {n}
      </option>
    ));
  }, [precomputedSystems, selectedSystemName, selectedSimilarityMetric]);

  if (!precomputedSystems) {
    return null;
  }

  return (
    <div>
      <h2>Select a system to be used for retrieval:</h2>
      <div style={{ marginBottom: "10px" }}>
        <label>Retrieval System: </label>
        <select
          value={selectedSystemName}
          onChange={(e) => setSelectedSystemName(e.target.value)}
        >
          <option value="">--Select System--</option>
          {uniqueIRSystemNameOptions}
        </select>

        <label style={{ marginLeft: "10px" }}>Similarity Metric: </label>
        <select
          value={selectedSimilarityMetric}
          onChange={(e) => setSelectedSimilarityMetric(e.target.value)}
        >
          <option value="">--Select Metric--</option>
          {distinctSimilarityMetricsOptions}
        </select>

        <label style={{ marginLeft: "10px" }}>N value: </label>
        <select
          value={selectedN}
          onChange={(e) => setSelectedN(Number(e.target.value))}
        >
          <option value="">--Select N--</option>
          {distinctNValuesOptions}
        </select>

        <button
          style={{ marginLeft: "10px" }}
          onClick={handleSelectSystem}
          disabled={
            !selectedSystemName || !selectedSimilarityMetric || !selectedN
          }
        >
          Select system
        </button>
      </div>
    </div>
  );
};

export default SystemSelectionPanel;
