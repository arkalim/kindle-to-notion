import _ from "lodash";
import { Clipping, GroupedClipping } from "../interfaces";
import { writeToFile, readFromFile } from "../utils";

export class Parser {
  private fileName = "My Clippings.txt";
  private regex =
    /(.+) \((.+)\)\r*\n- Your Highlight (at|on) (location|Location|page)( |(.+))([0-9]+)-([0-9]+) \| Added on ([a-zA-Z]+), ([a-zA-Z]+|[0-9]+) ([0-9]+|[a-zA-Z]+),? ([0-9]{4}) ([0-9]+):([0-9]+):([0-9]+\s? A?P?M?)\r*\n\r*\n(.+)/gm;
  private splitter = /=+\r*\n/gm;
  private nonUtf8 = /\uFEFF/gmu;
  private clippings: Clipping[] = [];
  private groupedClippings: GroupedClipping[] = [];

  /* Method to print the stats of Clippings read from My Clippings.txt */
  printStats = () => {
    console.log("\n💹 Stats for Clippings");
    for (const groupedClipping of this.groupedClippings) {
      console.log("--------------------------------------");
      console.log(`📝 Title: ${groupedClipping.title}`);
      console.log(`🙋 Author: ${groupedClipping.author}`);
      console.log(`💯 Highlights Count: ${groupedClipping.highlights.length}`);
    }
    console.log("--------------------------------------");
  };

  /* Method to export the final grouped clippings to a file */
  exportGroupedClippings = () => {
    writeToFile(this.groupedClippings, "grouped-clippings.json", "data");
  };

  /* Method add the parsed clippings to the clippings array */
  addToClippingsArray = (match: RegExpExecArray | null) => {
    if (match) {
      const title = match[1];
      let author = match[2];
      const location = `${match[6]}-${match[7]}`;
      const date = `${match[8]}, ${match[9]} ${match[10]}, ${match[11]}`;
      const time = `${match[12]}:${match[13]}:${match[14]} ${match[15]}`;
      const highlight = match[16];

      // If the author name contains comma, fix it
      if (author.includes(",")) {
        const names = author
          .split(",")
          .map((name) => name.replace(/^\s*|\s*$/g, ""));
        author = `${names[1]} ${names[0]}`;
      }

      this.clippings.push({ title, author, location, date, time, highlight });
    }
  };

  /* Method to group clippings (highlights) by the title of the book */
  groupClippings = () => {
    console.log("\n➕ Grouping Clippings");
    this.groupedClippings = _.chain(this.clippings)
      .groupBy("title")
      .map((clippings, title) => ({
        title,
        author: clippings[0].author,
        highlights: clippings.map((clipping) => clipping.highlight),
      }))
      .value();

    // remove duplicates in the highlights for each book
    this.groupedClippings = this.groupedClippings.map((groupedClipping) => {
      return {
        ...groupedClipping,
        highlights: [...new Set(groupedClipping.highlights)],
      };
    });
  };

  /* Method to parse clippings (highlights) and add them to the clippings array */
  parseClippings = () => {
    console.log("📋 Parsing Clippings");
    const clippingsRaw = readFromFile(this.fileName, "resources");

    // filter clippings to remove the non-UTF8 character
    const clippingsFiltered = clippingsRaw.replace(this.nonUtf8, "");

    // split clippings using splitter regex
    const clippingsSplit = clippingsFiltered.split(this.splitter);

    // parse clippings using regex
    for (let i = 0; i < clippingsSplit.length - 1; i++) {
      const clipping = clippingsSplit[i];
      const regex = new RegExp(this.regex.source);
      const match = regex.exec(clipping);
      this.addToClippingsArray(match);
    }
  };

  /* Wrapper method to process clippings */
  processClippings = (): GroupedClipping[] => {
    this.parseClippings();
    this.groupClippings();
    this.exportGroupedClippings();
    this.printStats();
    return this.groupedClippings;
  };
}
