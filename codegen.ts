import type { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
  schema: "./lib/graphql/schema.graphql",
  documents: [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "hooks/**/*.{ts,tsx}",
    "lib/models/**/*.ts",
    "!app/api/**",
    "!gql/**",
    "!lib/models/**/operations.ts",
    "!lib/models/**/seed.ts",
    "!lib/models/**/schema.ts",
  ],
  generates: {
    "./gql/": {
      preset: "client",
      presetConfig: {
        gqlTagName: "gql",
        fragmentMasking: false,
      },
    },
  },
  ignoreNoDocuments: true,
}

export default config
