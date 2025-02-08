import { useEffect, useState } from "react";
import {
  fetchDataset,
  fetchPrecomputedSystemsMetadataCollection,
  fetchPrecomputedData,
} from "../api";
import { DatasetRow, MetadataByFile, PrecomputedData } from "../api.types";

const useFetchData = (selectedIRSfilename: string) => {
  const [dataset, setDataset] = useState<DatasetRow[]>([]);
  const [precomputedSystems, setPrecomputedSystems] =
    useState<MetadataByFile | null>(null);
  const [precomputedResults, setPrecomputedResults] =
    useState<PrecomputedData | null>(null);

  useEffect(() => {
    fetchDataset().then((res) => setDataset(res));
    fetchPrecomputedSystemsMetadataCollection().then((res) =>
      setPrecomputedSystems(res)
    );
  }, []);

  useEffect(() => {
    if (selectedIRSfilename) {
      fetchPrecomputedData(selectedIRSfilename).then((res) =>
        setPrecomputedResults(res)
      );
    }
  }, [selectedIRSfilename]);

  return { dataset, precomputedSystems, precomputedResults };
};

export default useFetchData;
