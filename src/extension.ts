import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('extension.compareUniqueLines', async () => {
    const editors = vscode.window.visibleTextEditors;

    if (editors.length < 2) {
      vscode.window.showErrorMessage('Please open two files side by side to compare.');
      return;
    }

    const docA = editors[0].document;
    const docB = editors[1].document;

    const linesA = new Set(docA.getText().split(/\r?\n/));
    const linesB = new Set(docB.getText().split(/\r?\n/));

    const onlyInA = [...linesA].filter(line => !linesB.has(line));
    const onlyInB = [...linesB].filter(line => !linesA.has(line));

    const content =
      `=== Only in ${docA.fileName} ===\n` +
      onlyInA.join('\n') +
      `\n\n=== Only in ${docB.fileName} ===\n` +
      onlyInB.join('\n');

    const resultDoc = await vscode.workspace.openTextDocument({
      content,
      language: 'plaintext',
    });

    await vscode.window.showTextDocument(resultDoc, { preview: false });
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
