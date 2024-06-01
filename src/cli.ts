import { Command } from "npm:commander"
import { findRenameables, printRenameable, rename } from "./renameable.ts"

interface Args {
  yes?: boolean
}

export function cli() {
  const program = new Command()

  program
    .arguments("<pattern> <replacement> <file...>")
    .option("-y, --yes", "Don't ask for confirmation")
    .action(
      (
        pattern: string,
        replacement: string,
        files: string[],
        args: Args,
      ) => {
        const renameables = findRenameables(pattern, replacement, files)
        if (renameables.length === 0) {
          console.info("No files to rename")
          return
        }

        renameables.forEach((r) => printRenameable(r, { prefix: "   " }))

        if (args.yes || confirm("Rename?")) {
          renameables.forEach((r) => {
            printRenameable(r, { prefix: "Renaming " })
            rename(r)
          })
        }
      },
    )

  program.parse()
}
