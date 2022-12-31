import { LeitnerScheduler } from '@modules/spaced-repetition/schedulers/leitner-scheduling.strategy'
import { AvailableSchedulers } from '@modules/spaced-repetition/schedulers/scheduler.factory'
import { ApiProperty } from '@nestjs/swagger'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsDefined, IsEnum, IsNotEmpty, IsString } from 'class-validator'

export class CreateDeckDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @ApiProperty({
    description: "The deck's name.",
    example: 'Japanese Core3k'
  })
  name: string

  @IsDefined()
  @IsString()
  @ApiProperty({
    description: "The deck's description.",
    example: 'Deck containing the top 3k most common japanese words.'
  })
  description: string

  @IsDefined()
  @IsEnum(AvailableSchedulers)
  @ApiProperty({ enum: AvailableSchedulers, example: LeitnerScheduler })
  scheduler: AvailableSchedulers
}
