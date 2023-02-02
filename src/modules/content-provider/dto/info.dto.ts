import { ApiProperty } from '@nestjs/swagger'

export class InfoDto {
  @ApiProperty({ description: 'Total files saved', example: 120 })
  total: number

  @ApiProperty({ description: 'Files linked to entities', example: 113 })
  linkedFiles: number

  @ApiProperty({ description: 'Amount of used space from file storage', example: '123MB' })
  usedSpace: string
}
