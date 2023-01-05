import { Block, BlockType, CreatePageProperties } from "../interfaces";

/* Function to make an array of Notion blocks given the array of highlights and the block type
   Used when appending highlights to an existing Notion page for the book */
export const makeBlocks = (highlights: string[], type: BlockType): Block[] => {
  const blocks: Block[] = [];
  for (const highlight of highlights) {
    // truncate the highlight to a maximum length of 2000 character due to Notion API limitation
    const validHighlight =
      highlight.length > 2000 ? highlight.substring(0, 2000) : highlight;
    const block: Block = {
      object: "block",
      type,
    };
    block[type] = {
      text: [
        {
          type: "text",
          text: {
            content: validHighlight,
            link: null,
          },
        },
      ],
    };
    blocks.push(block);
  }
  return blocks;
};

/* Function to make an array of Notion blocks with a title: " 🎀 Highlights". 
   Used when creating a new Notion page for the book*/
export const makeHighlightsBlocks = (
  highlights: string[],
  type: BlockType
): Block[] => {
  return [
    ...makeBlocks([" 🎀 Highlights"], BlockType.heading_1),
    ...makeBlocks(highlights, type),
  ];
};

/* Function to generate the configuration required to create a new Notion page */
export const makePageProperties = (
  pageProperties: CreatePageProperties
): Record<string, unknown> => {
  const properties = {
    Title: {
      title: [
        {
          text: {
            content: pageProperties.title,
          },
        },
      ],
    },
    Author: {
      type: "rich_text",
      rich_text: [
        {
          type: "text",
          text: {
            content: pageProperties.author,
          },
        },
      ],
    },
    "Book Name": {
      type: "rich_text",
      rich_text: [
        {
          type: "text",
          text: {
            content: pageProperties.bookName,
          },
        },
      ],
    },
  };
  return properties;
};
