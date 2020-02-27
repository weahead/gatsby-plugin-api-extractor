const fs = require('fs-extra');
const path = require('path');

function stripInitCwd(str) {
  return str.replace(process.env.INIT_CWD + path.sep, '');
}

function copyApiFolders(pluginFilepath, reporter) {
  const src = path.join(pluginFilepath, 'api');
  const dest = path.join(process.env.INIT_CWD, 'api');
  if (src !== dest && fs.existsSync(src)) {
    reporter.info(`Copying ${stripInitCwd(src)} to ${stripInitCwd(dest)}`);
    fs.copySync(src, dest);
  }
}

exports.onPostBuild = function onPostBuild({ store, reporter }, pluginOptions) {
  const { flattenedPlugins } = store.getState();

  const { prefix = '', packages = [] } = pluginOptions;

  flattenedPlugins.forEach(plugin => {
    const { name, pluginFilepath } = plugin;

    if (prefix) {
      if (name.indexOf(prefix) === 0) {
        copyApiFolders(pluginFilepath, reporter);
      }
    } else {
      copyApiFolders(pluginFilepath, reporter);
    }
  });

  packages.forEach(package => {
    copyApiFolders(
      path.resolve(process.env.INIT_CWD, 'node_modules', package),
      reporter
    );
  });
};
