import { NotFoundException } from '@nestjs/common';

export class FileNotFoundException extends NotFoundException {
  constructor(error?: string, filename?: string) {
    if (filename != null) {
      super(`File ${filename} not found!`, error);
    } else {
      super('File requested not found', error);
    }
  }
}
