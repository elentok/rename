import * as path from "jsr:@std/path"
import chalk from "npm:chalk"

export function findRenameables(
  pattern: string,
  replacement: string,
  files: string[],
): Renameable[] {
  const re = new RegExp(pattern, "ig")
  const matches: Renameable[] = []

  files.forEach((filename) => {
    const basename = path.basename(filename)
    const newBasename = basename.replace(re, replacement)

    if (basename !== newBasename) {
      matches.push(createRenameable(filename, newBasename))
    }
  })

  return matches
}

export interface Renameable {
  fromFullPath: string
  toBasename: string
  fromDirname: string
  fromBasename: string
  toFullpath: string
}

function createRenameable(
  fromFullPath: string,
  toBasename: string,
): Renameable {
  const fromDirname = path.dirname(fromFullPath)
  const fromBasename = path.basename(fromFullPath)
  const toFullpath = path.join(fromDirname, toBasename)
  return {
    fromFullPath,
    toBasename,
    fromDirname,
    fromBasename,
    toFullpath,
  }
}

export function printRenameable(
  { fromDirname, fromBasename, toBasename }: Renameable,
  { prefix = "" }: { prefix?: string } = {},
): void {
  console.info(
    `${prefix}${chalk.gray(fromDirname)}/${fromBasename}`,
  )
  console.info(`${indent(fromDirname, prefix)} => ${chalk.blue(toBasename)}`)
}

function indent(fromDirname: string, prefix: string): string {
  let text = ""
  const indentWidth = Math.max(prefix.length + fromDirname.length - 3, 0)
  while (text.length < indentWidth) text += " "
  return text
}

export function rename({ fromFullPath, toFullpath }: Renameable): void {
  if (isInGitRepo(path.dirname(fromFullPath))) {
    const cmd = new Deno.Command("git", {
      args: ["mv", fromFullPath, toFullpath],
    })
    const { code, success, stderr } = cmd.outputSync()
    if (!success) {
      const err = new TextDecoder().decode(stderr)
      throw new Error(
        `Failed to run 'git mv' command with exitcode ${code}:\n${err}`,
      )
    }
  } else {
    Deno.rename(fromFullPath, toFullpath)
  }
}

function isInGitRepo(dir: string): boolean {
  const command = new Deno.Command("git", {
    args: ["rev-parse", "--git-dir"],
    cwd: dir,
  })

  const { success } = command.outputSync()
  return success
}
