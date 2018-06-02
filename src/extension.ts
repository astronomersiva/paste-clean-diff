'use strict';

import * as vscode from 'vscode';
import * as copyPaste from 'copy-paste';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('extension.pasteCleanDiff', () => {
    let editor = vscode.window.activeTextEditor;

    // No open text editor
    if (!editor) {
      return; 
    }

    let toPaste: string = copyPaste.paste();
    let cleanedLines: String[] = toPaste.split('\n').map((line: String) => {
      // only remove them if they are at the start.
      if (line.startsWith('+')) {
        return line.replace('+', '');
      }

      if (line.startsWith('-')) {
        return line.replace('-', '');
      }

      return line;
    });
    toPaste = cleanedLines.join('\n');

    // Need to replace all selections
    let selections = editor.selections;
    editor.edit(builder => {
      for(const selection of selections) {
        builder.replace(selection, toPaste);
      }
    });
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {
}
