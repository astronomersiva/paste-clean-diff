'use strict';

import * as vscode from 'vscode';
import * as copyPaste from 'copy-paste';

function cleanDiff(textWithSymbols: string): string {
  let cleanedLines: String[] = textWithSymbols.split('\n').map((line: String) => {
    // only remove them if they are at the start.
    if (line.startsWith('+')) {
      return line.replace('+', '');
    }

    if (line.startsWith('-')) {
      return line.replace('-', '');
    }

    return line;
  });

  return cleanedLines.join('\n');
}

export function activate(context: vscode.ExtensionContext) {
  let pasteCleanDiff = vscode.commands.registerCommand('extension.pasteCleanDiff', () => {
    let editor = vscode.window.activeTextEditor;

    // No open text editor
    if (!editor) {
      return; 
    }

    let toPaste: string = copyPaste.paste();
    toPaste = cleanDiff(toPaste);

    // Need to replace all selections
    let selections = editor.selections;
    editor.edit(builder => {
      for(const selection of selections) {
        builder.replace(selection, toPaste);
      }
    });
  });

  let cleanPastedDiff = vscode.commands.registerCommand('extension.cleanDiff', () => {
    let editor = vscode.window.activeTextEditor;

    // No open text editor
    if (!editor) {
      return; 
    }

    let selections = editor.selections;
    editor.edit(builder => {
      for(const selection of selections) {
        let { activeTextEditor } = vscode.window;
        if (!activeTextEditor) {
          return;
        }

        let { document } = activeTextEditor;
        let text: string = document.getText(new vscode.Range(selection.start, selection.end));
        let cleanedDiff: string = cleanDiff(text);
        builder.replace(selection, cleanedDiff);
      }
    });
  });

  context.subscriptions.push(pasteCleanDiff, cleanPastedDiff);
}

export function deactivate() {
}
