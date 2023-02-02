import { execSync } from 'child_process'

export const getFileSize = (path: string) => {
  return execSync(`du -sh ${path}`).toString().split('\t')[0]
}
