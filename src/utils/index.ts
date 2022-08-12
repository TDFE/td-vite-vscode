/*
 * @Description: 启动vite服务
 * @Author: 郑泳健
 * @Date: 2022-08-11 13:32:50
 * @LastEditors: 郑泳健
 * @LastEditTime: 2022-08-12 17:34:14
 */
import * as vscode from 'vscode';
import * as path from 'path';
import { createServer, ViteDevServer } from 'vite';

export const createService = async (type: 0 | 1, context: vscode.ExtensionContext) => {
    const msg = type === 1 ? '正在启动中, 请稍后' : '正在停止中';
    vscode.window.showInformationMessage(msg);

    if (type === 1) {
        const server = await createServer({
            configFile: path.resolve(__dirname, './vite.config.js'),
            root: vscode.workspace.workspaceFolders?.[0].uri.path
        });
        await server.listen();

        context.globalState.update('vite_server', server);
        vscode.window.showInformationMessage('启动成功');
        // 控制台输出url
        server.printUrls();
    } else if (type === 0) {
        const server: ViteDevServer | undefined = context.globalState.get('vite_server');
        server && server.close();
        vscode.window.showInformationMessage('关闭成功');
        context.globalState.update('vite_server', '');
    }
};
