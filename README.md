# Silent Continue

Pi extension that starts the next LLM turn from a keybind, without typing `continue` or adding any other user text to the conversation.

The usual workaround after expired credentials is to send a dummy prompt. That prompt stays in context. This extension triggers a turn and then strips its own marker before the model request, so the transcript the model sees is unchanged.

## Behavior

- Press `Ctrl+Shift+Enter` while the agent is idle.
- Pi starts a new model turn from the current session.
- The trigger is stored as a hidden custom message and removed in the `context` hook, so it never becomes user text.
- If the agent is already running, the shortcut warns and does nothing.

Typical case: a tool call finished, credential refresh stopped generation, and you want the model to continue from those tool results.

## Commands

- `/silent-continue` — same as the shortcut.

## Install

From a local checkout:

```bash
pi install /home/karthik/orepos/pi-silent-continue
```

From git after this repo is on GitHub:

```bash
pi install git:github.com/Karthik-Dulam/pi-silent-continue
```

Reload the current session with `/reload`, or start a new `pi` process. Use `/hotkeys` to confirm `Ctrl+Shift+Enter`.

## Change the keybind

The default shortcut is registered by the extension as `Ctrl+Shift+Enter`. If that chord is awkward in your terminal, run `/silent-continue` instead, or fork the extension and change the `registerShortcut` call.

## Notes

- This does not refresh credentials. Re-auth first if the provider is still unauthorized, then press the shortcut.
- The shortcut is a no-op while a turn is already streaming.
