# gatsby-plugin-api-extractor

This Gatsby plugin is design to copy all `api` folders of your configured Gatsby plugins and themes and merge them into an `api` folder in the root of the project.

It is meant for use with deployment tool ZEIT Now.

## Usage

1. Install the plugin:

```sh
npm i -SE @weahead/gatsby-plugin-api-extractor
```

2. Add the plugin to `gatsby-config.js`:

```js
module.exports = {
  plugins: [
    ...
    {
      resolve: '@weahead/gatsby-plugin-api-extrator',
      options: {
        prefix: '@weahead/api-prefix-',
        packages: [
          '@weahead/some-non-gatsby-theme-with-api-folder',
          '@weahead/other-non-gatsby-theme-with-api-folder',
        ]
      }
    },
    ...
  ]
}
```

3. Build the project

4. Deploy to ZEIT Now

### Options

`prefix` `(string)`: Only merges the directories of the Gatsby plugins that have a name that begins with this value. Think of it somewhat like a filter.

`packages` `(string[])`: If you have any dependencies that are NOT a Gatsby plugin or theme but that DOES have an `api` folder that should get merged add the package name to this array.

## Motivation

ZEIT Now has a zero config approach to deploying apis.

A folder named `api` in the root of the project will have all its supported filetypes automatically compiled to a lambda and deployed alongside its other project files. [Read more about this approach](https://zeit.co/docs/v2/serverless-functions/introduction).

Distributing your [Gatsby Themes](https://www.gatsbyjs.org/docs/themes/) isn't a big deal. However bundling the JavaScript files that make up the API for the theme inside the theme itself won't automatically deploy it to ZEIT Now. This plugin was created to help automate that.

This Gatsby plugin aims to help you distribute your Gatsby Themes including its own `api` folder and have all the `api` folders of all configured Gatsby plugins and themes merged into an `api` folder in the root of the project. This is done in [Gatsbys `onPostBuild` lifecycle](https://www.gatsbyjs.org/docs/node-apis/#onPostBuild). This lifecycle is only called when gatsby builds and not during development mode. Read below for recommendatins for development environment.

## Development environment

This plugin will do nothing when Gatsby is run in development mode (`gatsby develop`). As this plugin targets the ZEIT Now platform we recommend using `now dev` ([build step](https://zeit.co/docs/v2/build-step#during-local-development) | [serverless functions](https://zeit.co/docs/v2/serverless-functions/introduction#local-development)) with a custom `routes` declaration in `now.json` that proxies all the requests to their respective lambda files.

In a monorepo it could look something like this:

```json
{
  ...
  "routes": [
    {
      "src": "^/api/([^/]+)$",
      "dest": "packages/gatsby-theme-$1/api/index.js"
    },
    {
      "src": "^/api/([^/]+)/(.*)$",
      "dest": "packages/gatsby-theme-$1/api/$2.js"
    }
  ]
  ...
}
```

Running this with `now dev` would proxy requests:

```
http://localhost:3000/api/search => packages/gatsby-theme-search/api/index.js
http://localhost:3000/api/users/stats => packages/gatsby-theme-users/api/stats.js
```

## License

[X11](LICENSE)
