import React, { useMemo, useCallback, useState } from "react";
import { DatasetRow } from "../api.types";
import ConfigurationPanel from "./ConfigurationPanel";

interface RetrievalsTableProps {
  retrievals: DatasetRow[];
  retrievalMessage: string;
  videoLoadedMap: Record<string, boolean>;
  setVideoLoadedMap: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
}

const KEYS_TO_OMIT = [
  "spotify_id",
  "url",
  "song_key",
  "mode",
  "valence",
  "tempo",
];

const RetrievalsTable: React.FC<RetrievalsTableProps> = ({
  retrievals,
  retrievalMessage,
  videoLoadedMap,
  setVideoLoadedMap,
}) => {
  const [debugEnabled, setDebugEnabled] = useState(false);
  const [shouldShortenGenresAndTags, setShouldShortenGenresAndTags] =
    useState(true);

  const formatValue = useCallback(
    (value: unknown, shouldShorten = true): string => {
      if (typeof value === "number") {
        return (Math.round(value * 1000) / 1000).toString();
      }
      if (Array.isArray(value)) {
        return shouldShorten ? value.slice(0, 3).join(", ") : value.join(", ");
      }
      if (
        typeof value === "string" &&
        value.startsWith("{") &&
        value.endsWith("}")
      ) {
        try {
          const parsed = JSON.parse(value.replace(/'/g, '"'));
          const entries = shouldShorten
            ? Object.entries(parsed).slice(0, 5)
            : Object.entries(parsed);
          return (
            entries.map(([key, val]) => `${key}: ${val}`).join(", ") +
            (shouldShorten && Object.entries(parsed).length > 5 ? ", ..." : "")
          );
        } catch {
          return value;
        }
      }
      return value?.toString() ?? "";
    },
    []
  );

  const extractYouTubeId = (url: string) => {
    try {
      const u = new URL(url);
      return u.searchParams.get("v");
    } catch {
      return null;
    }
  };

  const tableHeaders = useMemo(() => {
    if (debugEnabled && retrievals.length > 0) {
      const firstRow = retrievals[0];
      const allKeys = Object.keys(firstRow).filter(
        (key) => !KEYS_TO_OMIT.includes(key)
      );
      return (
        <tr>
          <th>#</th>
          {allKeys.map((key) => (
            <th key={key}>{key}</th>
          ))}
          <th>YouTube Video</th>
        </tr>
      );
    } else {
      return (
        <tr>
          <th>#</th>
          <th>artist</th>
          <th>song</th>
          <th>genre</th>
          <th>total_listens</th>
          <th>YouTube Video</th>
        </tr>
      );
    }
  }, [debugEnabled, retrievals]);

  const tableRows = useMemo(() => {
    return retrievals.map((rec, index) => {
      const videoId = extractYouTubeId(rec.url);
      const embedUrl = videoId
        ? `https://www.youtube.com/embed/${videoId}`
        : null;
      const videoCell = !embedUrl ? (
        <span>No video</span>
      ) : videoLoadedMap[rec.id] ? (
        <iframe
          width="280"
          height="157"
          src={embedUrl}
          frameBorder="0"
          allowFullScreen
        ></iframe>
      ) : (
        <button
          style={{ display: "block", margin: "0 auto" }}
          onClick={() =>
            setVideoLoadedMap((prev) => ({ ...prev, [rec.id]: true }))
          }
        >
          Load Video
        </button>
      );

      if (debugEnabled) {
        const allKeys = Object.keys(rec).filter(
          (key) => !KEYS_TO_OMIT.includes(key)
        ) as (keyof DatasetRow)[];
        return (
          <tr key={rec.id}>
            <td>{index + 1}</td>
            {allKeys.map((key) => {
              const value = rec[key];
              return (
                <td key={key}>
                  {formatValue(value, shouldShortenGenresAndTags)}
                </td>
              );
            })}
            <td>{videoCell}</td>
          </tr>
        );
      } else {
        return (
          <tr key={rec.id}>
            <td>{index + 1}</td>
            <td>{formatValue(rec.artist, shouldShortenGenresAndTags)}</td>
            <td>{formatValue(rec.song, shouldShortenGenresAndTags)}</td>
            <td>{formatValue(rec.genre, shouldShortenGenresAndTags)}</td>
            <td>
              {formatValue(rec.total_listens, shouldShortenGenresAndTags)}
            </td>
            <td>{videoCell}</td>
          </tr>
        );
      }
    });
  }, [
    retrievals,
    videoLoadedMap,
    debugEnabled,
    setVideoLoadedMap,
    formatValue,
    shouldShortenGenresAndTags,
  ]);

  if (!retrievals.length) {
    return null;
  }

  return (
    <>
      <h2>{retrievalMessage}</h2>
      <div style={{ display: "flex", gap: "20px" }}>
        <ConfigurationPanel
          checkboxChecked={debugEnabled}
          setCheckboxChecked={setDebugEnabled}
          checkboxMessage="Display detailed information"
        />
        {debugEnabled && (
          <ConfigurationPanel
            checkboxChecked={!shouldShortenGenresAndTags}
            setCheckboxChecked={setShouldShortenGenresAndTags}
            checkboxMessage="And show ALL tags"
          />
        )}
      </div>
      <table>
        <thead>{tableHeaders}</thead>
        <tbody>{tableRows}</tbody>
      </table>
    </>
  );
};

export default RetrievalsTable;
