import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
	rollup: {
		emitCJS: true,
		esbuild: {
			treeShaking: true,
		},
	},
	declaration: true,
	outDir: "dist",
	clean: false,
	failOnWarn: false,
	externals: [],
	entries: [
		"./src/index.ts",
		"./src/transports/index.ts",
		"./src/clients/index.ts",
		"./src/types/index.ts",
		"./src/errors/index.ts",
		"./src/schemas/index.ts",
	],
});
