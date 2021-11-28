interface Text {
  text: {
    type: "text";
    text: {
      content: string;
      link: string | null;
    };
  }[];
}

export enum BlockType {
  quote = "quote",
  heading_1 = "heading_1",
  heading_2 = "heading_2",
  heading_3 = "heading_3",
  paragraph = "paragraph",
}

export enum Emoji {
  "📖" = "📖",
  "📚" = "📚",
}

export interface Block {
  object: "block";
  type: BlockType;
  quote?: Text;
  paragraph?: Text;
  heading_1?: Text;
  heading_2?: Text;
  heading_3?: Text;
}

export interface CreatePageProperties {
  title: string;
  author: string;
  bookName: string;
}

export interface CreatePageParams {
  parentDatabaseId: string;
  properties: CreatePageProperties;
  children: Block[];
  icon?: Emoji;
  cover?: string;
}
