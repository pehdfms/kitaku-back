import { IsDefined, IsString } from 'class-validator'

export class CreateMediaContentDto {
  @IsDefined()
  @IsString()
  filename: string

  @IsDefined()
  @IsString()
  mimetype: string

  @IsDefined()
  @IsString()
  path: string
}
