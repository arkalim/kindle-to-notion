require("dotenv").config();
import { NotionAdapter } from "../adapters";
import { GroupedClipping } from "../interfaces";
import { CreatePageParams, Emoji, BlockType } from "../interfaces";
import {
  makeHighlightsBlocks,
  updateSync,
  getUnsyncedHighlights,
  makeBlocks,
} from "../utils";

export class Notion {
  private notion;

  constructor() {
    this.notion = new NotionAdapter();
  }

  getIdFromBookName = async (bookName: string) => {
    /* Function to get notion block id of the book page given the book name */
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

  syncHighlights = async (books: GroupedClipping[]) => {
    /* Function to sync highlights to notion */
    try {
      // sync only unsynced highlights from each book
      const unsyncedBooks = getUnsyncedHighlights(books);

      // if unsynced books are present
      if (unsyncedBooks.length > 0) {
        console.log("\nSyncing highlights to Notion");
        for (const book of unsyncedBooks) {
          console.log(`\nSyncing book: ${book.title}`);
          const bookId = await this.getIdFromBookName(book.title);

          // if book is already present in Notion
          if (bookId) {
            console.log(`Book already present, appending highlights`);
            // append unsynced highlights at the end
            await this.notion.appendBlockChildren(
              bookId,
              makeBlocks(book.highlights, BlockType.quote)
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
            // create a new notion page for the book
            await this.notion.createPage(createPageParams);
          }
          // after each book is successfully synced, update the sync cache
          updateSync(book);
        }
        console.log("\nSuccessfully synced highlights to Notion");
      } else {
        console.log("Every book is already synced!");
      }
    } catch (error: unknown) {
      console.error("Failed to sync highlights", error);
      throw error;
    } finally {
      console.log("--------------------------------------");
    }
  };
}
