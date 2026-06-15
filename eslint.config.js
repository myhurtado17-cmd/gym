import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['dist/**', '.vercel/**', 'node_modules/**'] },
  { files: ['**/*.{ts,tsx,astro}'] },
  { languageOptions: { globals: globals.node } },
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'warn'
    }
  }
];
