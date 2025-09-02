export type ShelfBookmark = {
  emoji?: string;
  title: string;
  url: string;
};

export type ShelfSection = {
  title: string;
  bookmarks: ShelfBookmark[];
};
