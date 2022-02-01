import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginateResponse } from 'common/decorators';
import { Response } from 'express';
import { JwtAccessTokenGuard, JwtRefreshTokenGuard } from 'modules/auth/guards';
import { RequestWithUser } from 'modules/auth/interfaces';
import { UserDto } from 'modules/user/dtos';

import { FileDto, FilesPageDto, FilesPageOptionsDto } from '../dtos';
import { FileCreateDto } from '../dtos/file-create.dto';
import { FileService } from '../services';

@Controller('file')
@ApiTags('File Manager')
export class FileController {
  constructor(private readonly _fileService: FileService) { }

  @Post()
  @UseGuards(JwtRefreshTokenGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User file information',
    type: FileDto,
  })
  @ApiOperation({ summary: 'Uploads an user file' })
  async addFile(
    @Req() request: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
    @Body() fileCreateDto: FileCreateDto,
  ): Promise<FileDto> {
    const fileInfo = { ...fileCreateDto, path: fileCreateDto.path ?? 'users/documents' }
    const fileEntity = await this._fileService.uploadFile(file, fileInfo, request.user);

    return fileEntity.toDto();
  }

  @Get(':uuid')
  @UseGuards(JwtAccessTokenGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User file information',
    type: FileDto,
  })
  @ApiOperation({ summary: 'Gets an user file information' })
  async getFile(@Param('uuid') uuid: string): Promise<FileDto> {
    const file = await this._fileService.getFile(uuid);

    return file.toDto();
  }

  @Get()
  @UseGuards(JwtAccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @PaginateResponse(FileDto)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user file list for given parameters',
    type: FileDto,
  })
  @ApiOperation({ summary: 'Get user file list' })
  async getFiles(
    @Req() request: RequestWithUser,
    @Query(new ValidationPipe({ transform: true }))
    options: FilesPageOptionsDto,
  ): Promise<FilesPageDto> {
    console.log(options);

    return this._fileService.getFiles(options);
  }

  @Delete(':uuid')
  @UseGuards(JwtAccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: 'File succesfully deleted.' })
  @ApiOperation({ summary: 'Delete an user file' })
  async deleteFile(@Req() request: RequestWithUser, @Param('uuid') uuid: string) {
    const result = this._fileService.deleteFile(uuid);

    return {
      affectedRows: (await result).affected,
      message: 'File successfully removed from current user.',
    };
  }
}
