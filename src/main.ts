import { Parser, Notion } from "./models";

const parser = new Parser();
const notion = new Notion();

(async () => {
  // parse clippings
  const clippings = parser.processClippings();

  // sync highlights (clippings) to notion
  await notion.syncHighlights(clippings);
})();
