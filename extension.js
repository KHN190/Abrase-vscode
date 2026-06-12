const vscode = require("vscode");

// Simple, static completion — keywords, builtin types, and host natives.
// Not a language server; no semantic analysis.
const KEYWORDS = [
  "fn", "let", "const", "static", "if", "else", "match", "for", "while",
  "loop", "break", "continue", "return", "type", "trait", "impl", "use",
  "pub", "region", "handle", "resume", "throw", "where", "in", "as", "mut",
  "move", "effect", "op", "alias", "true", "false", "self", "Self"
];
const TYPES = ["Int", "Float", "Bool", "String", "Unit", "Char"];
const NATIVES = [
  "print", "println", "now", "rand", "srand", "halt",
  "sin", "cos", "sqrt", "abs", "min", "max", "floor",
  "cls", "pal", "pset", "line", "linew", "rect", "rectb", "rectmix",
  "circ", "circb", "sprite", "text", "device_in", "device_out",
  "btn", "key", "mouse",
  "synth_voices", "synth_osc", "synth_filter", "synth_env", "synth_lfo",
  "synth_unison", "synth_fx", "synth_on", "synth_off", "synth_stop",
  "synth_pan", "synth_panic",
  "sfx_inst", "sfx_playm", "sfx_tone", "sfx_pan", "sfx_fx", "sfx_lfo",
  "sfx_sample", "sfx_seq", "sfx_track",
  "bus_reverb", "bus_delay"
];

function items() {
  const K = vscode.CompletionItemKind;
  const out = [];
  for (const w of KEYWORDS) out.push(new vscode.CompletionItem(w, K.Keyword));
  for (const w of TYPES) out.push(new vscode.CompletionItem(w, K.Class));
  for (const w of NATIVES) out.push(new vscode.CompletionItem(w, K.Function));
  return out;
}

function cli() {
  return vscode.workspace.getConfiguration("abrase").get("cli", "abrase");
}

function runInTerminal(args, env) {
  const ed = vscode.window.activeTextEditor;
  if (!ed) { vscode.window.showErrorMessage("Abrase: no active file."); return; }
  const file = ed.document.fileName;
  const term = vscode.window.createTerminal({ name: "Abrase", env });
  term.show();
  const prefix = env && env.BREAK_AT ? `BREAK_AT=${env.BREAK_AT} ` : "";
  term.sendText(`${prefix}${cli()} ${args.join(" ")} "${file}"`);
}

function activate(context) {
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider("abrase", {
      provideCompletionItems() { return items(); }
    })
  );

  const cmd = (id, fn) => context.subscriptions.push(vscode.commands.registerCommand(id, fn));
  cmd("abrase.check",  () => runInTerminal(["check"]));
  cmd("abrase.run",    () => runInTerminal(["run"]));
  cmd("abrase.disasm", () => runInTerminal(["disasm"]));
  cmd("abrase.debug",  async () => {
    const at = await vscode.window.showInputBox({
      prompt: "BREAK_AT (optional) — <fn>:<pc> or <file.abe>:<line>; empty = full trace",
      placeHolder: "main:0  or  game.abe:42"
    });
    const env = at ? { BREAK_AT: at } : undefined;
    runInTerminal(["run", "--debug"], env);
  });
}

function deactivate() {}

module.exports = { activate, deactivate };
