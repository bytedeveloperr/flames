import { templates } from "../templates.ts"
import { CONFIG_FILE_PATH } from "../../../constants.ts"

export async function initAction(options: any) {
  try {
    await Deno.lstat(CONFIG_FILE_PATH)
  } catch (e) {
    if (e.code === "ENOENT") {
      const encoder = new TextEncoder()
      const template = templates.getConfigTemplate(options.dialect)
      await Deno.writeFile(CONFIG_FILE_PATH, encoder.encode(template))
    } else {
      console.log(e)
      Deno.exit(1)
    }
  }
}
