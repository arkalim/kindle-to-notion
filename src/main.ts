import { Parser } from "./utils";
import { Notion } from "./adapters";
import { CreatePageParams, Emoji, BlockType } from "./interfaces";
import { makeHighlightsBlocks } from "./utils";

const parser = new Parser();
const clippings = parser.processClippings();

const notion = new Notion();
(async () => {
  const createPageParams: CreatePageParams = {
    parentDatabaseId: "dcb045acf39b4cc2835a82d01b991a9c",
    properties: {
      title: clippings[0].title,
      author: clippings[0].author,
      bookName: clippings[0].title,
    },
    children: makeHighlightsBlocks(clippings[0].highlights, BlockType.quote),
    icon: Emoji["📚"],
  };
  await notion.createPage(createPageParams);
})();
