import { createAccessControl } from "better-auth/plugins/access";

const statement = {
	tool: ["approve", "reject", "view"],
} as const;

export const ac = createAccessControl(statement);

export const user = ac.newRole({
	tool: ["view"],
});

export const moderator = ac.newRole({
	tool: ["view", "approve", "reject"],
});

export const admin = ac.newRole({
	tool: ["view", "approve", "reject"],
});
