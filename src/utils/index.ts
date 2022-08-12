/*
 * @Description: 启动vite服务
 * @Author: 郑泳健
 * @Date: 2022-08-11 13:32:50
 * @LastEditors: 郑泳健
 * @LastEditTime: 2022-08-12 10:08:28
 */
import * as path from 'path';
import * as vscode from 'vscode';
import { createServer } from 'vite';

export const createService = async (type: 0 | 1) => {
    const msg = type === 1 ? '正在启动中' : '正在停止中';
    vscode.window.showInformationMessage(msg);

    const server = await createServer({
        configFile: path.resolve(__dirname, './vite.config.js'),
        root: vscode.workspace.workspaceFolders?.[0].uri.path
    });
    await server.listen();

    server.printUrls();
};
