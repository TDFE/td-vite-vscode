/*
 * @Description: 侧边栏的操作
 * @Author: 郑泳健
 * @Date: 2022-08-11 10:28:10
 * @LastEditors: 郑泳健
 * @LastEditTime: 2022-08-12 16:41:33
 */
import * as vscode from 'vscode';

// 树节点
export class TreeItem extends vscode.TreeItem {
    constructor(label: string, status: vscode.TreeItemCollapsibleState, command: vscode.Command) {
        super(label, status);
        this.command = command;
    }
}

//树的内容组织管理
export class Tree implements vscode.TreeDataProvider<TreeItem>{
    onDidChangeTreeData?: vscode.Event<void | TreeItem | null | undefined> | undefined;
    getTreeItem(element: TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }
    getChildren(element?: TreeItem): vscode.ProviderResult<TreeItem[]> {
        // 根节点
        if (!element) {
            const childs = [
                new TreeItem('启动', vscode.TreeItemCollapsibleState.None, {
                    command: "sidebar_vite_operation.click",
                    title: "标题",
                    arguments: [1]
                }),
                new TreeItem('停止', vscode.TreeItemCollapsibleState.None, {
                    command: "sidebar_vite_operation.click",
                    title: "标题",
                    arguments: [0]
                }),
            ];
            return childs;
        }
    }
}
