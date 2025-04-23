type DisplayObject = {
  objectName: string;
  object: File;
  objectDownloadLink: string;
  objectProgress: number;
};

type DisplayFileObject = {
  extension: string;
  fileObject: DisplayObject[];
};

export type { DisplayObject, DisplayFileObject };
