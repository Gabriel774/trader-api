import { ParseFilePipeBuilder } from '@nestjs/common';

export const imageValidation = ({ required }: { required: boolean }) => {
  return new ParseFilePipeBuilder()
    .addFileTypeValidator({
      fileType: 'png|jpg|jpeg',
    })
    .addMaxSizeValidator({
      maxSize: 5000000,
    })
    .build({
      fileIsRequired: required,
    });
};
