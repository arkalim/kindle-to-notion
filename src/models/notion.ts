require("dotenv").config();
import { Client } from "@notionhq/client";
import { writeToFile } from "../utils";

export class Notion {
  private notion: Client;

  constructor() {
    this.notion = new Client({ auth: process.env.NOTION_API_KEY });
  }

  getDatabase = async (databaseId: string) => {
    const response = await this.notion.databases.retrieve({
      database_id: databaseId,
    });
    writeToFile("get-db-response.txt", response);
  };

  getPage = async (pageId: string) => {
    const response = await this.notion.pages.retrieve({
      page_id: pageId,
    });
    writeToFile("get-page-response.txt", response);
  };
}
