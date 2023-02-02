import { ApiProperty } from '@nestjs/swagger'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsDefined, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator'

export class CreateThreadDto {
  @IsOptional()
  @MaxLength(80)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @ApiProperty({
    description: "The Thread's title",
    example: 'New kitakuchan Thread'
  })
  title?: string

  @IsDefined()
  @IsString()
  @IsUUID()
  media: string

  @IsDefined()
  @MaxLength(10000)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @ApiProperty({
    description: "The Thread's content",
    example: 'This is a new thread full of content!'
  })
  content: string
}
