/**
 * Host half of dsh-claude-style.
 *
 * The skin's effect is browser-only, with one exception: model copy. That table
 * is DATA, not code — it ships beside the bundle as `model-descriptions.json`
 * and the browser half fetches it at runtime, so the table grows without a
 * rebuild and the bundle stays free of copy. This half is what serves it.
 *
 * The route is registered defensively: a host without a web server (or one
 * where the prefix is already taken) must still activate the plugin, because a
 * failed host fiber would also drop the client bundle from the module graph and
 * the whole skin with it. The browser half degrades to the catalog's own text
 * when the document is unavailable.
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const name = 'dsh-claude-style'

/** Route prefix this plugin owns; the browser half reads `${ROUTE_PREFIX}/${COPY_FILE}`. */
const ROUTE_PREFIX = '/dsh-claude-style'
/** The copy document, built from `src/model-descriptions.json` by scripts/build.mjs. */
const COPY_FILE = 'model-descriptions.json'

/**
 * Serve the model copy document.
 * @param ctx - host plugin context.
 */
export function apply(ctx) {
  const file = join(dirname(fileURLToPath(import.meta.url)), COPY_FILE)

  const register = (scope) => {
    scope.effect(() => {
      try {
        return scope.webServer.register({
          kind: 'prefix',
          path: ROUTE_PREFIX,
          handler: (req, res) => {
            if (req.method !== 'GET' && req.method !== 'HEAD') {
              res.writeHead(405, { allow: 'GET, HEAD' })
              res.end()
              return
            }
            let body
            try {
              // Read per request: the file is small, and an in-place edit then
              // shows up on reload without restarting the host.
              body = readFileSync(file)
            } catch {
              res.writeHead(404)
              res.end()
              return
            }
            res.writeHead(200, {
              'content-type': 'application/json; charset=utf-8',
              'content-length': String(body.byteLength),
              'cache-control': 'no-cache',
            })
            res.end(req.method === 'HEAD' ? undefined : body)
          },
        })
      } catch (error) {
        // A duplicate prefix is a composition conflict, not a reason to fail
        // the plugin: the browser half simply keeps its fallback copy.
        ctx.logger?.warn?.(`dsh-claude-style: model copy route unavailable: ${error?.message ?? error}`)
        return () => {}
      }
    }, 'dsh-claude-style: model copy route')
  }

  if (ctx.get('webServer') === undefined) ctx.inject(['webServer'], register)
  else register(ctx)
}
