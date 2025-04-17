type DisplayObject = {
  objectName: string;
  object: File;
  objectDownloadLink: string;
};

type DisplayFileObject = {
  extension: string;
  fileObject: DisplayObject[];
};

export type { DisplayObject, DisplayFileObject };
