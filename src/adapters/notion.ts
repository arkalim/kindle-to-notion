require("dotenv").config();
import { Client } from "@notionhq/client";
import {
  GetDatabaseResponse,
  QueryDatabaseResponse,
  GetBlockResponse,
  ListBlockChildrenResponse,
  AppendBlockChildrenResponse,
  GetPageResponse,
  QueryDatabaseParameters,
  CreatePageResponse,
} from "@notionhq/client/build/src/api-endpoints";
import _ from "lodash";
import { writeToFile, makePageProperties } from "../utils";
import { Block, CreatePageParams } from "../interfaces";

/* Adapter to interact with Notion API directly */
export class NotionAdapter {
  private notion: Client;

  constructor() {
    this.notion = new Client({ auth: process.env.NOTION_API_KEY });
  }

  /* Method to get a Notion database */
  getDatabase = async (databaseId: string): Promise<GetDatabaseResponse> => {
    try {
      const response = await this.notion.databases.retrieve({
        database_id: databaseId,
      });
      writeToFile(response, "get-db-response.json", "data");
      return response;
    } catch (error: unknown) {
      console.error("Failed to get database", error);
      throw error;
    }
  };

  /* Method to query a Notion database */
  queryDatabase = async (
    query: QueryDatabaseParameters
  ): Promise<QueryDatabaseResponse> => {
    try {
      const response = await this.notion.databases.query(query);
      writeToFile(response, "query-db-response.json", "data");
      return response;
    } catch (error: unknown) {
      console.error("Failed to query database", error);
      throw error;
    }
  };

  /* Method to get a Notion block */
  getBlock = async (blockId: string): Promise<GetBlockResponse> => {
    try {
      const response = await this.notion.blocks.retrieve({
        block_id: blockId,
      });
      writeToFile(response, "get-block-response.json", "data");
      return response;
    } catch (error: unknown) {
      console.error("Failed to get block", error);
      throw error;
    }
  };

  /* Method to get the children of a Notion block */
  getBlockChildren = async (
    blockId: string
  ): Promise<ListBlockChildrenResponse> => {
    try {
      let blockChildren = await this.notion.blocks.children.list({
        block_id: blockId,
      });

      while (blockChildren.has_more) {
        const remainingBlocks = await this.notion.blocks.children.list({
          block_id: blockId,
          start_cursor: blockChildren.next_cursor as string,
        });

        blockChildren = {
          object: blockChildren.object,
          next_cursor: remainingBlocks.next_cursor,
          has_more: remainingBlocks.has_more,
          results: [...blockChildren.results, ...remainingBlocks.results],
        };
      }
      writeToFile(blockChildren, "get-block-children-response.json", "data");
      return blockChildren;
    } catch (error: unknown) {
      console.error("Failed to get block children", error);
      throw error;
    }
  };

  /* Method to append new children to a Notion block */
  appendBlockChildren = async (
    blockId: string,
    children: Block[]
  ): Promise<AppendBlockChildrenResponse> => {
    try {
      let response = await this.notion.blocks.children.append({
        block_id: blockId,
        children: children as any[],
      });
      return response;
    } catch (error: unknown) {
      console.error("Failed to append block children", error);
      throw error;
    }
  };

  /* Method to get a Notion page */
  getPage = async (pageId: string): Promise<GetPageResponse> => {
    try {
      const response = await this.notion.pages.retrieve({
        page_id: pageId,
      });
      writeToFile(response, "get-page-response.json", "data");
      return response;
    } catch (error: unknown) {
      console.error("Failed to get page", error);
      throw error;
    }
  };

  /* Method to create a Notion page */
  createPage = async (
    createPageParams: CreatePageParams
  ): Promise<CreatePageResponse> => {
    try {
      const page: any = {
        parent: {
          database_id: createPageParams.parentDatabaseId,
        },
        properties: makePageProperties(createPageParams.properties),
        children: createPageParams.children,
      };

      if (createPageParams.icon) {
        page["icon"] = {
          type: "emoji",
          emoji: createPageParams.icon,
        };
      }

      if (createPageParams.cover) {
        page["cover"] = {
          type: "external",
          external: {
            url: createPageParams.cover,
          },
        };
      }

      const response = await this.notion.pages.create(page);
      writeToFile(response, "create-page-response.json", "data");
      return response;
    } catch (error: unknown) {
      console.error("Failed to create page", error);
      throw error;
    }
  };
}
