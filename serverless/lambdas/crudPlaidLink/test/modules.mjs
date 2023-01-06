import { handler } from "../index.mjs";
import { createTokenLinkPayload } from "./payloads.mjs";

export const createTokenLink = async () => handler(createTokenLinkPayload);
