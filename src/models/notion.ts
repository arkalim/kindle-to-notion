require("dotenv").config();
import { NotionAdapter } from "../adapters";
import { GroupedClipping } from "../interfaces";
import { CreatePageParams, Emoji, BlockType } from "../interfaces";
import { makeHighlightsBlocks } from "../utils";

export class Notion {
  private notion;

  constructor() {
    this.notion = new NotionAdapter();
  }

  getIdFromBookName = async (bookName: string) => {
    const response = await this.notion.queryDatabase({
      database_id: process.env.BOOK_DB_ID as string,
      filter: {
        or: [
          {
            property: "Book Name",
            text: {
              equals: bookName,
            },
          },
        ],
      },
    });
    const [book] = response.results;
    if (book) {
      return book.id;
    } else {
      return null;
    }
  };

  syncHighlights = async (groupedclippings: GroupedClipping[]) => {
    console.log("\n--------- Syncing highlights to Notion ----------");
    try {
      for (const book of groupedclippings) {
        console.log(`\nSyncing book: ${book.title}`);
        const bookId = await this.getIdFromBookName(book.title);
        if (bookId) {
          console.log(`Book already present, appending highlights`);
          await this.notion.appendBlockChildren(
            bookId,
            makeHighlightsBlocks(book.highlights, BlockType.quote)
          );
        } else {
          console.log(`Book not present, creating notion page`);
          const createPageParams: CreatePageParams = {
            parentDatabaseId: process.env.BOOK_DB_ID as string,
            properties: {
              title: book.title,
              author: book.author,
              bookName: book.title,
            },
            children: makeHighlightsBlocks(book.highlights, BlockType.quote),
            icon: Emoji["🔖"],
          };
          await this.notion.createPage(createPageParams);
        }
      }
      console.log("\nSuccessfully synced highlights to Notion");
    } catch (error: unknown) {
      console.error("Failed to sync highlights", error);
      throw error;
    }
  };
}
