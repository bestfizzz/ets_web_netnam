import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],

    rules: {
      // ✅ Soften common dev-time errors
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/ban-ts-comment": "off",

      // ✅ React & Next.js rules
      "react-hooks/exhaustive-deps": "warn",
      "react/display-name": "off",
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",

      // ✅ General style relaxations
      "no-console": "off",
      "no-debugger": "off",
    },
  },
]

export default eslintConfig
