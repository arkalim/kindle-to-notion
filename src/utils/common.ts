import path from "path";
import { readFileSync, writeFileSync } from "fs";

export const writeToFile = (fileName: string, file: any): void => {
  writeFileSync(
    path.join(path.dirname(__dirname), `../resources/${fileName}`),
    JSON.stringify(file)
  );
};

export const readFromFile = (fileName: string): String => {
  return readFileSync(
    path.join(path.dirname(__dirname), `../resources/${fileName}`),
    "utf-8"
  );
};
