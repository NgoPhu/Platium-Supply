const glob = require('glob')
const path = require('path')
const fs = require('fs')
const ESLintPlugin = require('eslint-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const ROOT = path.resolve(__dirname)
const SRC_DIR = path.join(ROOT, 'src/components')
const STYLES_DIR = path.join(SRC_DIR, 'styles')
const SNIPPETS_DIR = path.join(SRC_DIR, 'snippets')
const SECTIONS_DIR = path.join(SRC_DIR, 'sections')
const SCRIPT_HELPERS_DIR = path.join(SRC_DIR, 'helpers')
const SCRIPT_MODULES_DIR = path.join(SRC_DIR, 'modules')
const SCRIPT_USES_DIR = path.join(SRC_DIR, 'uses')

module.exports = () => {
  const target = process.env.npm_lifecycle_event
  const isProductionMode = target === 'build' || target === 'analyze'
  const mode = isProductionMode ? 'production' : 'development'
  const devtool = isProductionMode ? 'cheap-module-source-map' : 'eval-cheap-module-source-map'
  const minimize = Boolean(isProductionMode)

  return {
    entry: glob
      .sync('./src/components/+(sections|layout|modules)/**/*.js')
      .reduce((acc, path) => {
        const entry = path.replace(/^.*[\\\/]/, '').replace('.js', '')
        let prefix = ''
        if (path.includes('/modules/')) {
          prefix = `module-${entry}`
        } else if (path.includes('/sections/')) {
          prefix = `section-${entry}`
        } else {
          prefix = `${entry}`
        }
        acc[prefix] = path
        return acc
      }, {}),
    mode,
    devtool,
    output: {
      filename: './assets/[name].js',
      path: path.resolve(ROOT, 'dist')
    },
    optimization: {
      minimizer: isProductionMode ? [
        new CssMinimizerPlugin(),
        new TerserPlugin({
          extractComments: false,
          terserOptions: {}
        })
      ] : [],
      minimize
    },
    watchOptions: {
      poll: true,
      ignored: [path.resolve(ROOT, 'dist'), path.resolve(ROOT, 'node_modules')]
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          include: SRC_DIR,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.(css)$/,
          include: SRC_DIR,
          use: [
            'style-loader',
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                esModule: false
              }
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            'postcss-loader'
          ]
        }
      ]
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        helpers: SCRIPT_HELPERS_DIR,
        styles: STYLES_DIR,
        snippets: SNIPPETS_DIR,
        sections: SECTIONS_DIR,
        uses: SCRIPT_USES_DIR,
        modules: SCRIPT_MODULES_DIR
      }
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: './assets/[name].css'
      }),
      new ESLintPlugin({
        extensions: ['js']
      }),
      new CopyPlugin({
        patterns: [
          {
            from: 'src/assets/**/*',
            to: 'assets/[name][ext]'
          },
          {
            from: 'src/config/*.json',
            to: 'config/[name][ext]'
          },
          {
            from: 'src/config/lib/*.json',
            to: 'config/settings_schema.json',
            transformAll(files) {
              const output = []
              files.forEach((file) => {
                const contents = JSON.parse(
                  fs.readFileSync(file.absoluteFilename, 'utf8')
                )
                output.push(contents)
              })
              return JSON.stringify(output, 'null', 2)
            }
          },
          {
            from: 'src/locales/*.json',
            to: 'locales/[name][ext]'
          },
          {
            from: 'src/components/sections/**/*.liquid',
            to: 'sections/[name][ext]'
          },
          {
            from: 'src/components/layout/**/*.liquid',
            to: 'layout/[name][ext]'
          },
          {
            from: 'src/components/+(modules|snippets)/**/*.liquid',
            to: 'snippets/[name][ext]'
          },
          {
            context: 'src/',
            from: 'components/templates/**/*.liquid',
            to({ absoluteFilename }) {
              const relativePath = path.join(__dirname, 'src/components')
              const diff = path.relative(relativePath, absoluteFilename)

              const customersTemplatePath = path.normalize(
                path.normalize('templates/customers/')
              )
              const targetFolder = diff.startsWith(customersTemplatePath)
                ? 'templates/customers/'
                : diff.split(path.sep)[0]
              return path.join(targetFolder, path.basename(absoluteFilename))
            }
          },
          {
            context: 'src/',
            from: 'components/**/*.json',
            to({ absoluteFilename }) {
              const relativePath = path.join(__dirname, 'src/components')
              const diff = path.relative(relativePath, absoluteFilename)

              const customersTemplatePath = path.normalize(
                path.normalize('templates/customers/')
              )
              const targetFolder = diff.startsWith(customersTemplatePath)
                ? 'templates/customers/'
                : diff.split(path.sep)[0]
              return path.join(targetFolder, path.basename(absoluteFilename))
            }
          }
        ]
      })
    ]
  }
}
