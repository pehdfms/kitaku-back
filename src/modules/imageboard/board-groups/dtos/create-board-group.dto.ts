import { ApiProperty } from '@nestjs/swagger'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsDefined, IsNotEmpty, IsString } from 'class-validator'

export class CreateBoardGroupDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @ApiProperty({
    description: "The Board Group's name",
    example: 'Japanese Culture'
  })
  name: string
}
