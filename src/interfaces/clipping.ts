export interface Clipping {
  title: string;
  author: string;
  location: string;
  date: string;
  time: string;
  highlight: string;
}

export interface GroupedClipping {
  title: string;
  author: string;
  highlights: string[];
  locations: string[];
  dates: string[];
}

export interface Sync {
  title: string;
  author: string;
  highlightCount: number;
}
