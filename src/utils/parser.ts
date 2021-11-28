import _ from "lodash";
import { Clipping, GroupedClipping } from "../interfaces";
import { writeToFile, readFromFile } from "../utils";

export class Parser {
  private fileName = "My Clippings.txt";
  private regex =
    /(.+) \((.+)\)\r*\n- Your Highlight on (Location|page)( |(.+))([0-9]+)-([0-9]+) \| Added on ([a-zA-Z]+), ([a-zA-Z]+) ([0-9]+), ([0-9]+) ([0-9]+):([0-9]+):([0-9]+) (AM|PM)\r*\n\r*\n(.+)\r*\n/gm;
  private splitter = /=+\r*\n/gm;
  private nonUtf8 = /\uFEFF/gmu;
  private clippings: Clipping[] = [];
  private groupedClippings: GroupedClipping[] = [];

  printStats = () => {
    for (const groupedClipping of this.groupedClippings) {
      console.log("--------------------------------------");
      console.log(`Title: ${groupedClipping.title}`);
      console.log(`Author: ${groupedClipping.author}`);
      console.log(`Highlights Count: ${groupedClipping.highlights.length}`);
      console.log("--------------------------------------");
    }
  };

  exportGroupedClippings = () => {
    console.log("\nExporting grouped clippings");
    writeToFile("grouped-clippings.txt", this.groupedClippings);
  };

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

  groupClippings = () => {
    console.log("\nGrouping Clippings");
    this.groupedClippings = _.chain(this.clippings)
      .groupBy("title")
      .map((clippings, title) => ({
        title,
        author: clippings[0].author,
        highlights: clippings.map((clipping) => clipping.highlight),
      }))
      .value();

    // ensure no duplicates in the highlights
    this.groupedClippings = this.groupedClippings.map((groupedClipping) => {
      return {
        ...groupedClipping,
        highlights: [...new Set(groupedClipping.highlights)],
      };
    });
  };

  parseClippings = () => {
    console.log("Reading Clippings.txt");
    const clippingsRaw = readFromFile(this.fileName);

    console.log("Filtering Clippings.txt");
    const clippingsFiltered = clippingsRaw.replace(this.nonUtf8, "");

    console.log("\nSplitting clippings using splitter ", this.splitter);
    const clippingsSplit = clippingsFiltered.split(this.splitter);
    console.log("\nLength of clippings", clippingsSplit.length - 1);

    console.log("\nParsing clippings using regex", this.regex);
    for (let i = 0; i < clippingsSplit.length - 1; i++) {
      const clipping = clippingsSplit[i];
      const regex = new RegExp(this.regex.source);
      const match = regex.exec(clipping);
      this.addToClippingsArray(match);
    }
  };

  processClippings = () => {
    this.parseClippings();
    this.groupClippings();
    this.exportGroupedClippings();
    this.printStats();
  };
}
