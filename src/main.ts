import { Parser, Notion } from "./models";

const parser = new Parser();
const notion = new Notion();

(async () => {
  const clippings = parser.processClippings();
  await notion.syncHighlights(clippings);
})();
