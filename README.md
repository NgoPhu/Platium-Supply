## Getting started

Gamma base uses [Webpack 5](https://webpack.js.org/),
[Shopify CLI for themes](https://shopify.dev/themes/tools/cli) and
[Tailwind CSS](https://tailwindcss.com/). The goal is to create a Shopify theme with a
component-based folder structure that is easy to build themes with.

## 📁 Folder Structure

This is pre-defined for a component-based file structure compatible with Shopify
2.0 files. All liquid, js, json, css and scss are in the same folder to keep things
in one place. Example of folder structure:

- components
  - sections
    - header
      - header.js
      - header.liquid
      - header.css

**Note:** always import component css files into the component javascript file.
For example `import './header.css';` is inside `header.js`. This ensures the
css will get compiled to css with Webpack and added to the /dist/assets
directory.

**Note:** for css, javascrit global like. button.css, typo.css, accordion-list.css. we can import that to `theme.js` or `theme.css`, can you check two file for more details

## Requirements

- [Shopify CLI for themes](https://shopify.dev/themes/tools/cli/getting-started)
- A Shopify Theme with products and collections

## Node Version Manager

This theme setup is built with Yarn, Webpack and Shopify CLI which are dependent
on NodeJS versions. You can use node `v14` for shopify cli 2 or node `v16` for shopify cli 3 to install dependencies and run build
commands.

- Install
  [nvm](http://npm.github.io/installation-setup-docs/installing/using-a-node-version-manager.html)
- Run `nvm install v14` in terminal
- Install dependencies `yarn install`

Once the install command is used `nvm use` can be used going forward.

## Getting Started

- Install dependencies using [Yarn](https://yarnpkg.com/) `yarn install`.
- Run a build test `yarn build` if there are no errors then you are good to go.
- Next run command `shopify login --store your-store-name.myshopify.com` (For Shopify CLI 2) or `shopify theme open --store your-store-name.myshopify.com` (For Shopify CLI 3) and
  login to your store
- If you using node v14 and shopify CLI 2, In terminal run `yarn start` this will start webpack in watch mode and
- If you using node v16 and shopify CLI 3, In terminal run `yarn dev` this will start webpack in watch mode and
  terser will detect any file changes.
- You are now ready to go. Open the local url from Shopify CLI and you will see
  changes on save hot module reload. **Note** HMR only works in localhost, not
  on the preview theme domains. Preview themes require a page refresh on file
  save.
- If you want logout shopify cli for this store, In terminal run:
  - For Shopify CLI 2:  `shopify logout`
  - For Shopify CLI 3:  `shopify auth logout`

### Theme Check

[shopify/theme-check-action](https://github.com/Shopify/theme-check-action) will
run when a pull request is created. This will flag any linting issues and create
an annotation in the pull requests files.

## Whitespace control

In [Liquid](https://shopify.github.io/liquid/basics/whitespace/), include a
hyphen in your tag syntax `{{-`, `-}}`, `{%-`, and `-%}` to strip whitespace
from the left or right side of a rendered tag. By including hyphens in your
`assign` tag, you can strip the generated whitespace from the rendered template.
If you don’t want any of your tags to print whitespace, as a general rule you
can add hyphens to both sides of all your tags (`{%-` and `-%}`):

```liquid
{%- assign customer_name = "Blake" -%}
{%- if customer_name and customer_name.size > 10 -%}
  Hi {{ customer_name }}!
{%- else -%}
  Hello there!
{%- endif -%}
```

### vscode-liquid

A visual studio code extension for the
[Liquid](https://shopify.github.io/liquid/) template language. Includes syntax
highlighting support for Liquid code used in HTML, JavaScript CSS, SCSS,
Markdown and more. Ships with auto formatting code beautification, advanced
snippet auto-completion resolution and respects VS Codes native Intellisense,
hover and diagnostic features.

<img width="78" alt="image" src="https://user-images.githubusercontent.com/29803478/171333038-96cd867d-05ba-4df0-b091-0a801662b31b.png">

**NOTE** Please check out the extension repo for customizations and
understanding how this works:
[https://github.com/panoply/vscode-liquid](https://github.com/panoply/vscode-liquid)

## Frameworks

### Preact

Fast 3kB alternative to React with the same modern API.

Gamma will enable you to write ReactJS code in .js files inside your
components(sections) and through webpack be bundled as minified Javascript code.
Preact supports all commonly used ReactJS hooks.

Check out the [documentation](https://preactjs.com/guide/v10/getting-started)

### Tailwind CSS

This project uses [TailwindCSS](https://tailwindcss.com/) `v3` a mobile first
utility-first CSS framework packed with classes like flex, pt-4, text-center and
rotate-90 that can be composed to build any design, directly in your markup.

Check out the amazing [documentation](https://tailwindcss.com/docs) and start
adding classes to your elements.

#### Headwind & Tailwind CSS IntelliSense

Check out
[Headwind](https://marketplace.visualstudio.com/items?itemName=heybourn.headwind)
VSCode extension for TailwindCSS classes. Headwind is an opinionated Tailwind
CSS class sorter for Visual Studio Code. It enforces consistent ordering of
classes by parsing your code and reprinting class tags to follow a given order.

Optionally you can also install and use
[TailwindCSS IntelliSense](https://github.com/tailwindlabs/tailwindcss-intellisense).
Tailwind CSS IntelliSense enhances the Tailwind development experience by
providing Visual Studio Code users with advanced features such as autocomplete,
syntax highlighting, and linting.

## Scripts

If you are asked to log in or authenticate into the store that you are working on, check out the following documentation [here](https://shopify.dev/themes/tools/cli/core-commands#login).

### For Development

- `yarn build` - This command will build the content of the `src/` folder using [webpack](https://webpack.js.org/) and generate a `dist/` directory that resembles a standard Shopify theme.

- `yarn setup` - This command will install project dependencies, build the project (explained above), watch the IDE for code changes, and rebuild the project into the `dist/` directory on every file save.

- `yarn start` (for Shopify CLI 2) - This command will run the `webpack --watch` and `shopify theme serve` scripts as part of the Shopify CLI, automatically syncing the code to the local theme. More information about how this works can be found [here](https://webpack.js.org/).

- `yarn dev` (for Shopify CLI 3) - This command will run the `webpack --watch` and `shopify theme dev` scripts as part of the Shopify CLI, automatically syncing the code to the local theme. More information about how this works can be found [here](https://webpack.js.org/).

- `yarn deploy` - This command will deploy the `dist` theme via the `Shopify theme push` script as part of the Shopify CLI. It will prompt you to select the theme you want to deploy to.

### For Testing and Linting

- `yarn test` - This command will run `eslint` for all `.js` files in the `src` folder.

- `yarn test:all` - This command will run `eslint` and `theme check` for the entire project.

### For Syncing Theme and Settings

- `yarn fetch:template` - This command will fetch the JSON files from the connected store. It will prompt you to select a theme to pull the files from. This is useful for getting the latest content from a live theme on production. The JSON files will be pulled into the `src/components/templates` directory.

- `yarn fetch:config` - This command will get the `settings_data.json` file in the `config` folder to sync data to the local development environment.

- `yarn fetch:all` - This command will fetch all template JSON files and the `settings_data.json`.

### For Theme Check and Downloading Theme

- `yarn theme:check` - This command will run `shopify theme check` to get all errors in the liquid code.

- `yarn theme:pull` - This command will run `shopify theme pull` to download all files of the theme to the `/download` folder. Please do not commit this folder to the repository.

**Note:**
Please run the appropriate commands and check the `template JSON` and `settings_data` before deploying the code to staging or live environments.

### Example script for Development

- Run step by step (for Shopify CLI 3):

  - **Developing:**
    - `nvm use 16`
    - `yarn setup` (only for the first-time initialization)
    - `shopify auth logout` (log out of all accounts for your own store) and choose any theme
    - `shopify theme open --store your-store-name.myshopify.com` (login to the partner account)
    - `yarn dev`

  - **Deployment:**
    - `nvm use 16`
    - `shopify auth logout` (log out of all accounts for your own store)
    - `shopify theme open --store your-store-name.myshopify.com` (login to the partner account)
    - `yarn fetch:all` (check the template JSON and settings_data.json)
    - Commit the code
    - `shopify deploy` (choose the store to deploy)
