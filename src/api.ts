import { DatasetRow, PrecomputedData, MetadataByFile } from "./api.types";

export async function fetchDataset(): Promise<DatasetRow[]> {
  const res = await fetch("data/merged_dataset.tsv");
  const text = await res.text();
  const lines = text.trim().split("\n");

  const header = lines[0].replace(/\r/g, "").split("\t");
  const getColIndex = (name: string) => header.indexOf(name);

  const data: DatasetRow[] = lines.slice(1).map((line) => {
    const cols = line.split("\t");
    const genreString = cols[getColIndex("genre")].replace(/'/g, '"');
    const genre = JSON.parse(genreString);
    const tag = JSON.parse(JSON.stringify(cols[getColIndex("(tag, weight)")]));
    console.log();
    return {
      id: cols[getColIndex("id")],
      genre: genre,
      spotify_id: cols[getColIndex("spotify_id")],
      popularity: parseFloat(cols[getColIndex("popularity")]),
      release: cols[getColIndex("release")],
      danceability: parseFloat(cols[getColIndex("danceability")]),
      energy: parseFloat(cols[getColIndex("energy")]),
      song_key: parseFloat(cols[getColIndex("song_key")]),
      mode: parseFloat(cols[getColIndex("mode")]),
      valence: parseFloat(cols[getColIndex("valence")]),
      tempo: parseFloat(cols[getColIndex("tempo")]),
      duration_ms: parseFloat(cols[getColIndex("duration_ms")]),
      artist: cols[getColIndex("artist")],
      song: cols[getColIndex("song")],
      album_name: cols[getColIndex("album_name")],
      url: cols[getColIndex("url")],
      total_listens: parseFloat(cols[getColIndex("total_listens")]),
      "(tag, weight)": tag,
    };
  });
  console.log(data);

  return data;
}

let cachedMetadataByFile: MetadataByFile | null = null;

export async function fetchPrecomputedSystemsMetadataCollection(): Promise<MetadataByFile> {
  if (cachedMetadataByFile) {
    return cachedMetadataByFile;
  }

  const response = await fetch(
    "data/precomputed_systems/metadata_by_file.json"
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  cachedMetadataByFile = await response.json();
  if (!cachedMetadataByFile) {
    throw new Error(`Error! No metadata found`);
  }

  return cachedMetadataByFile;
}

export async function fetchPrecomputedData(
  filename: string
): Promise<PrecomputedData> {
  const res = await fetch("data/precomputed_systems/" + filename);
  const json = await res.json();
  // console.log("length of cached data: ", Object.keys(json.content).length);

  if (filename === "late_fusion_1000.json") {
    const content = Object.keys(json.fused_content).reduce(
      (acc, k) => ({ ...acc, [k]: Object.keys(json.fused_content[k]) }),
      {}
    );

    return {
      ...json,
      content: content,
    };
  }

  return json as PrecomputedData;
}
