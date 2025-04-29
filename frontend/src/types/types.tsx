type DisplayObject = {
  objectName: string;
  object: File;
  objectDownloadLink: string;
  objectProgress: number;
  objectSize: number;
  objectFailed: boolean;
};

type DisplayFileObject = {
  extension: string;
  fileObject: DisplayObject[];
};

export type { DisplayObject, DisplayFileObject };
