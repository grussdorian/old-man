var chokidar = require('chokidar')
var watcher = chokidar.watch('./audio', { ignored: /^\./, persistent: true })

watcher
  .on('add', function (path) {
    if (path.endsWith(".ogg")) {
      console.log('Audio File', path, 'has been added');
    }
    if (path.endsWith(".txt")) {
      console.log('Transcript (txt) File', path, 'has been added');
    }

  })
  .on('change', function (path) { console.log('File', path, 'has been changed'); })
  .on('unlink', function (path) { console.log('File', path, 'has been removed'); })
  .on('error', function (error) { console.error('Error happened', error); })