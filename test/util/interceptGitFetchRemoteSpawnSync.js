const fs = require('fs')
const path = require('path')
const testSrc = path.resolve(__dirname, '../../test')

// replace original spawnSync
const childProcess = require('child_process')
const originalSpawnSync = childProcess.spawnSync
childProcess.spawnSync = function (command, args, options) {
  const argv = Array.isArray(args) ? args : []
  const isGit = command === 'git'
  const isFetchRemote = argv.length === 2 && argv[0] === 'fetch' && argv[1] !== '--tags'

  if (isGit && isFetchRemote) {
    // edit git config to trigger error
    const config = fs.readFileSync(path.normalize(`${testSrc}/clones/repo1/lib/fallback-deps-test-repo-2/.git/config`)).toString()
    const updatedConfig = config.split('\n').map(line => {
      if (line.includes('fetch =')) return '\tfetch = not-valid'
      return line
    }).join('\n')
    fs.writeFileSync(path.normalize(`${testSrc}/clones/repo1/lib/fallback-deps-test-repo-2/.git/config`), updatedConfig)
  }

  return originalSpawnSync.apply(this, arguments)
}
