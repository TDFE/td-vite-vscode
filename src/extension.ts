/*
 * @Description: 入口
 * @Author: 郑泳健
 * @Date: 2022-08-11 09:51:31
 * @LastEditors: 郑泳健
 * @LastEditTime: 2022-08-12 16:41:49
 */
import * as vscode from 'vscode';
import { Tree } from './tree';
import { createService } from './utils/index';

export function activate(context: vscode.ExtensionContext) {

	const tree = new Tree();

	// 注册点击左侧图表展开树目录的命令
	vscode.window.registerTreeDataProvider("sidebar_vite_operation", tree);

	// 注册树节点的命令
	vscode.commands.registerCommand("sidebar_vite_operation.click", args => {
		createService(args);
	});
}

export function deactivate() { }
