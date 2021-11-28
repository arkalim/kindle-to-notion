import { Parser } from "./utils";
import { Notion } from "./models";

const parser = new Parser();
parser.processClippings();

const notion = new Notion();
(async () => {
  await notion.getDatabase("dcb045acf39b4cc2835a82d01b991a9c");
  await notion.getPage("8fee71e8a41a4563b5ef144a4d37afb8");
})();
