import path from "path";
import { readFileSync, writeFileSync } from "fs";
import { GroupedClipping, Sync } from "../interfaces";
import _ from "lodash";

export const writeToFile = (
  fileName: string,
  file: any,
  dirName?: string
): void => {
  /* Function to write to a file given the file, fileName and optionally the dirName */
  writeFileSync(
    path.join(
      path.dirname(__dirname),
      `../${dirName || "resources"}/${fileName}`
    ),
    JSON.stringify(file)
  );
};

export const readFromFile = (fileName: string, dirName?: string): string => {
  /* Function to read a file given the fileName and optionally the dirName */
  return readFileSync(
    path.join(
      path.dirname(__dirname),
      `../${dirName || "resources"}/${fileName}`
    ),
    "utf-8"
  );
};

export const updateSync = (book: GroupedClipping) => {
  /* Function to update the sync cache after every book is successfully synced */
  const oldSync: Sync[] = JSON.parse(readFromFile("sync.json", "cache"));
  const bookSync = _.find(oldSync, { title: book.title });
  let newSync: Sync[] = [];
  if (bookSync) {
    _.remove(oldSync, { title: book.title });
    newSync = [
      ...oldSync,
      {
        title: book.title,
        author: book.author,
        highlightCount: bookSync.highlightCount + book.highlights.length,
      },
    ];
  } else {
    newSync = [
      ...oldSync,
      {
        title: book.title,
        author: book.author,
        highlightCount: book.highlights.length,
      },
    ];
  }
  writeToFile("sync.json", newSync, "cache");
};

export const getUnsyncedHighlights = (books: GroupedClipping[]) => {
  /* Function to get unsynced highlights for each book */
  const sync: Sync[] = JSON.parse(readFromFile("sync.json", "cache"));
  const unsyncedHighlights: GroupedClipping[] = [];

  // if some books were synced earlier
  if (sync.length > 0) {
    console.log("\nBooks already synced:\n");
    for (const book of books) {
      // get the sync metadata for the book
      const bookSync = _.find(sync, { title: book.title });
      // if the book was synced earlier
      if (bookSync) {
        // if new highlights have been added to the book
        if (book.highlights.length > bookSync.highlightCount) {
          // only new highlights should be synced
          unsyncedHighlights.push({
            ...book,
            highlights: book.highlights.slice(bookSync.highlightCount),
          });
        } else {
          console.log(`📖 ${book.title}`);
        }
      } else {
        // if the book wasn't synced earlier, every highlight should be synced
        unsyncedHighlights.push(book);
      }
    }
    console.log("--------------------------------------");
    return unsyncedHighlights;
  } else {
    // if no books were synced earlier, every book should be synced
    return books;
  }
};
