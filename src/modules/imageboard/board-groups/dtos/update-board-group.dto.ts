import { PartialType } from '@nestjs/swagger'
import { CreateBoardGroupDto } from './create-board-group.dto'

export class UpdateBoardGroupDto extends PartialType(CreateBoardGroupDto) {}
