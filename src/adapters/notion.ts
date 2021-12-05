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

export class NotionAdapter {
  private notion: Client;

  constructor() {
    this.notion = new Client({ auth: process.env.NOTION_API_KEY });
  }

  getDatabase = async (databaseId: string): Promise<GetDatabaseResponse> => {
    try {
      const response = await this.notion.databases.retrieve({
        database_id: databaseId,
      });
      writeToFile("get-db-response.json", response);
      return response;
    } catch (error: unknown) {
      console.error("Failed to get database", error);
      throw error;
    }
  };

  queryDatabase = async (
    query: QueryDatabaseParameters
  ): Promise<QueryDatabaseResponse> => {
    try {
      const response = await this.notion.databases.query(query);
      writeToFile("query-db-response.json", response);
      return response;
    } catch (error: unknown) {
      console.error("Failed to query database", error);
      throw error;
    }
  };

  getBlock = async (blockId: string): Promise<GetBlockResponse> => {
    try {
      const response = await this.notion.blocks.retrieve({
        block_id: blockId,
      });
      writeToFile("get-block-response.json", response);
      return response;
    } catch (error: unknown) {
      console.error("Failed to get block", error);
      throw error;
    }
  };

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
      writeToFile("get-block-children-response.json", blockChildren);
      return blockChildren;
    } catch (error: unknown) {
      console.error("Failed to get block children", error);
      throw error;
    }
  };

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

  getPage = async (pageId: string): Promise<GetPageResponse> => {
    try {
      const response = await this.notion.pages.retrieve({
        page_id: pageId,
      });
      writeToFile("get-page-response.json", response);
      return response;
    } catch (error: unknown) {
      console.error("Failed to get page", error);
      throw error;
    }
  };

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
      writeToFile("create-page-response.json", response);
      return response;
    } catch (error: unknown) {
      console.error("Failed to create page", error);
      throw error;
    }
  };
}
