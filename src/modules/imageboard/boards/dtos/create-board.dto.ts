import { ApiProperty } from '@nestjs/swagger'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsAlpha, IsDefined, IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class CreateBoardDto {
  @IsDefined()
  @IsString()
  @IsUUID()
  boardGroup: string

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsAlpha()
  @Transform(({ value }: TransformFnParams) => (value as string)?.toLowerCase())
  @ApiProperty({
    description: "The Board's identifier, this can't contain spaces or special characters",
    example: 'int'
  })
  identifier: string

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @ApiProperty({
    description: "The Board's name",
    example: 'International'
  })
  name: string
}
