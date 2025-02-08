import React from "react";

interface DetailedEntryProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  entry: { [key: string]: any };
}

const DetailedEntry: React.FC<
  DetailedEntryProps & React.HTMLAttributes<HTMLTableElement>
> = ({ entry, style, ...props }) => {
  if (!entry) return null;

  return (
    <table style={style} {...props}>
      <thead>
        <tr>
          {Object.keys(entry).map((key) => (
            <th key={key}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {Object.values(entry).map((value, index) => (
            <td key={index}>
              {Array.isArray(value)
                ? value.slice(0, 3).join(", ")
                : JSON.stringify(value)}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

export default DetailedEntry;
