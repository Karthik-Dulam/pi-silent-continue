/**
 * Silent Continue
 *
 * Start the next LLM turn without typing a dummy "continue" prompt.
 * Useful when credentials expire after a tool call and you want the
 * model to resume from the existing transcript, not a new user message.
 *
 * Usage:
 *   Ctrl+K            - resume without adding user text
 *   /silent-continue  - same as the shortcut
 */

import type { AgentMessage } from "@earendil-works/pi-agent-core";
import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { Key } from "@earendil-works/pi-tui";

const CUSTOM_TYPE = "silent-continue";

function isSilentContinue(message: AgentMessage): boolean {
	return message.role === "custom" && message.customType === CUSTOM_TYPE;
}

function resumeTurn(pi: ExtensionAPI, ctx: ExtensionContext): void {
	if (!ctx.isIdle()) {
		if (ctx.hasUI) {
			ctx.ui.notify("Agent is already running", "warning");
		}
		return;
	}

	pi.sendMessage(
		{
			customType: CUSTOM_TYPE,
			content: [],
			display: false,
		},
		{ triggerTurn: true },
	);
}

export default function (pi: ExtensionAPI) {
	// convertToLlm() turns custom messages into user text. Drop this
	// marker so the model only sees the existing conversation.
	pi.on("context", async (event) => {
		const messages = event.messages.filter((message) => !isSilentContinue(message));
		if (messages.length === event.messages.length) return;
		return { messages };
	});

	pi.registerShortcut(Key.ctrl("k"), {
		description: "Continue the LLM turn without adding a user message",
		handler: (ctx) => {
			resumeTurn(pi, ctx);
		},
	});

	pi.registerCommand("silent-continue", {
		description: "Continue the LLM turn without adding a user message",
		handler: async (_args, ctx) => {
			resumeTurn(pi, ctx);
		},
	});
}
