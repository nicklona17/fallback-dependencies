// replace original spawnSync
const childProcess = require('child_process')
const originalSpawnSync = childProcess.spawnSync
childProcess.spawnSync = function (command, args, options) {
  const argv = Array.isArray(args) ? args : []
  const isGit = command === 'git'
  const isTag = argv.length === 1 && argv[0] === 'tag'

  if (isGit && isTag) {
    const msg = 'fatal: simulated git tag error\n'
    return {
      pid: -1,
      output: [null, Buffer.from(''), Buffer.from(msg)],
      stdout: Buffer.from(''),
      stderr: Buffer.from(msg),
      status: 128,
      signal: null,
      error: null
    }
  }

  return originalSpawnSync.apply(this, arguments)
}
