import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

const statement = {
	...defaultStatements,
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
	...adminAc.statements,
	tool: ["view", "approve", "reject"],
});
