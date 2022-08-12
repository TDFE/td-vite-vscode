
// @ts-nocheck
import * as vscode from 'vscode';
import * as path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteCommonjs, esbuildCommonjs } from '@originjs/vite-plugin-commonjs';
import vitePluginImp from 'vite-plugin-imp';
import legacy from '@vitejs/plugin-legacy';
import { tdViteTransformReact } from 'vite-plugin-tongdun-transform';
import { merge } from 'lodash';
const inject = require('@rollup/plugin-inject');

const urlPath = vscode.workspace.workspaceFolders?.[0].uri.path;
// 读取webpack的配置
const buildConfig = require(path.resolve(urlPath, './build/config.js'));

// 自定义配置
let customSet = {};
try {
    customSet = require(path.resolve(urlPath, './vite.config.js'));
} catch (e) {

}

const { html, entry, ...customSetRest } = customSet;


const { proxyTable, port } = buildConfig.dev || {};

let proxy = {};

for (const i in proxyTable) {
    const { pathRewrite, ...rest } = proxyTable[i];
    const keys = pathRewrite ? Object.keys(pathRewrite) : [];
    if (keys.length) {
        proxy[i] = {
            rewrite: (path) => path.replace(keys[0], pathRewrite[keys[0]])
        };
    }
    proxy[i] = {
        ...proxy[i],
        ...rest
    };
}

/** tntd组件名 */
const toUpper = function (str) {
    if (!!str) {
        const humpStr = str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ""));
        const [first, ...rest] = humpStr;
        return first?.toUpperCase() + rest.join('');
    }

    return '';
};


// https://vitejs.dev/config/
const defaultSet = {
    plugins: [
        legacy({
            targets: ['defaults', 'not IE 11']
        }),
        viteCommonjs(),
        inject({
            React: 'react'
        }),
        tdViteTransformReact({
            htmlPath: html || './src/index.html', // html的地址
            entriesPath: entry || '/src/app.js' // 入口js文件
        }),
        react({
            jsxRuntime: 'classic',
            babel: {
                cwd: path.resolve(__dirname, '..'),
                plugins: [
                    '@babel/plugin-transform-react-jsx',
                    // 不写会报require错误
                    [
                        'import',
                        {
                            libraryName: 'antd',
                            libraryDirectory: 'es',
                            style: true
                        },
                        'antd'
                    ],
                    [
                        'import',
                        {
                            libraryName: 'tntd',
                            libraryDirectory: 'es',
                            camel2DashComponentName: false
                        },
                        'tntd'
                    ]
                ]
            }
        }),
        vitePluginImp({
            optimize: true,
            libList: [
                {
                    libName: 'antd',
                    libDirectory: 'es',
                    style: (name) => `antd/es/${name}/style`
                },
                {
                    libName: 'tntd',
                    libDirectory: 'es',
                    style: (name) => {
                        if (!['development-login', 'img', 'layout', 'loading-button', 'select', 'table'].includes(name)) {
                            return `tntd/es/${toUpper(name)}/index.less`;
                        }
                        return '';
                    }
                }
            ]
        })
    ],
    resolve: {
        alias: [
            { find: '@', replacement: path.resolve(urlPath, 'src') },
            { find: /^~@tntd/, replacement: path.resolve(urlPath, 'node_modules/@tntd/') },
            { find: 'react-draggable', replacement: path.resolve(urlPath, 'node_modules/react-draggable/build/web/react-draggable.min.js') },
            // 不添加会报props.oneOf错误
            { find: 'react-resizable', replacement: path.resolve(urlPath, 'node_modules/react-resizable/dist/bundle.js') },
            // 因为history包console里面有 history%s 会被esbuild误认为包
            { find: 'history/createHashHistory', replacement: path.resolve(urlPath, 'node_modules/history/es/createHashHistory.js') }
        ]
    },
    define: {
        'process.env': {
            SYS_ENV: 'development',
            NODE_ENV: 'development'
        }
    },
    optimizeDeps: {
        entries: [],
        esbuildOptions: {
            plugins: [
                // Solves:
                // https://github.com/vitejs/vite/issues/5308
                // add the name of your package
                esbuildCommonjs(['history'])
            ]
        }
    },
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
                modifyVars: {
                    hack: 'true; @import "~@tntd/antd-cover/tnt.less";'
                },
            }
        },
        postcss: {
            plugins: [
                require("postcss-modules")({
                    scopeBehaviour: "global",
                    getJSON: () => { }
                }),
            ]
        }
    },
    server: {
        open: true,
        host: '0.0.0.0',
        port,
        cors: true,
        proxy
    }
};

export default defineConfig({
    ...merge(defaultSet, customSetRest)
});