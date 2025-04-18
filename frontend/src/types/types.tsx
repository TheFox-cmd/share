type DisplayObject = {
  objectName: string;
  object: File;
  objectDownloadLink: string;
  objectSize: number;
};

type DisplayFileObject = {
  extension: string;
  fileObject: DisplayObject[];
};

export type { DisplayObject, DisplayFileObject };
