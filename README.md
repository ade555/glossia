# Glossia

**Translate your API documentation into any language in seconds.**

Glossia automatically translates OpenAPI/Swagger specifications into multiple languages using AI, then provides a beautiful local viewer to browse your multilingual API docs.

[![npm version](https://img.shields.io/npm/v/glossia.svg)](https://www.npmjs.com/package/glossia)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## Why Glossia?

Your API is ready. Your docs are in English. But your users speak Spanish, French, German, Japanese...

**Traditional approach:**

- Manually translate every endpoint description
- Maintain separate doc files per language
- Update translations every time your API changes
- Expensive, slow, error-prone

**Glossia approach:**

```bash
npx glossia generate --spec api.yaml --languages es,fr,de,ja
npx glossia serve
```

Done. Your API docs are now available in 5 languages with a beautiful, browsable interface.

---

## Features

- **AI-Powered Translation** - Uses [Lingo.dev](https://lingo.dev) for high-quality, context-aware translations
- **One Command Setup** - No configuration files, no complex setup
- **Multiple Specs Support** - Translate and view multiple API specifications
- **20+ Languages** - Supports all major languages out of the box
- **Beautiful Viewer** - Clean, professional UI automatically generated
- **Incremental Updates** - Only retranslates what changed
- **Persistent Translations** - Cached locally, version-controlled
- **Smart Term Preservation** - Keeps technical terms like `user_id` untouched

---

## Quick Start

### Prerequisites

- Node.js 18+
- An OpenAPI/Swagger spec file (YAML)

### 1. Translate Your API Spec

```bash
npx glossia generate --spec openapi.yaml --languages es,fr,de
```

**What happens:**

- Glossia reads your OpenAPI spec
- Extracts all human-readable content (descriptions, parameters, responses)
- Translates to Spanish, French, and German using AI
- Saves translations to `.glossia/i18n/`

**First time?** You'll be prompted to authenticate with Lingo.dev (free tier available).

### 2. View Your Multilingual Docs

```bash
npx glossia serve
```

Opens `http://localhost:3000` with your translated API documentation.

Use the language switcher to toggle between languages instantly.

---

## Usage

### Basic Translation

```bash
# Translate to one language
npx glossia generate --spec api.yaml --languages es

# Translate to multiple languages
npx glossia generate --spec api.yaml --languages es,fr,de,ja,zh
```

### Specify Source Language

By default, Glossia assumes your spec is in English. If it's in another language:

```bash
npx glossia generate --spec api.yaml --source pt --languages en,es,fr
```

### Add More Languages Later

```bash
# Already translated to Spanish and French
# Now add German and Japanese
npx glossia generate --spec api.yaml --languages de,ja
```

Glossia automatically **merges** new languages with existing ones. Your previous translations stay intact.

### Multiple API Specs

```bash
npx glossia generate --spec api-v1.yaml --languages es,fr
npx glossia generate --spec api-v2.yaml --languages es,fr
```

Both specs are translated and viewable. The viewer shows a dropdown to switch between them.

### Update Your Spec

Made changes to your API? Just run the same command:

```bash
npx glossia generate --spec api.yaml --languages es,fr,de
```

Glossia only retranslates what changed, saving time and API credits.

---

## How It Works

### 1. **Intelligent Extraction**

Glossia parses your OpenAPI spec and identifies what needs translation:

- ✅ Endpoint summaries and descriptions
- ✅ Parameter descriptions
- ✅ Response descriptions
- ✅ Error messages
- ❌ Parameter names (e.g., `user_id` stays as-is)
- ❌ Enum values (e.g., `draft`, `active`)
- ❌ Code examples

### 2. **AI Translation**

Uses Lingo.dev's specialized translation engine:

- Context-aware (understands it's API documentation)
- Preserves technical terms automatically
- Maintains formatting (markdown, code blocks)
- Consistent terminology across endpoints

### 3. **Smart Caching**

- Translations stored in `.glossia/i18n/`
- Version-controlled alongside your spec
- Only changed content gets retranslated
- Works offline after initial translation

### 4. **Beautiful Viewer**

- Automatically generates a browsable interface
- Sidebar navigation by endpoint
- Searchable
- Clean, professional design
- Responsive (works on mobile)

---

## Supported Languages

Glossia supports 20+ languages including:

🇪🇸 Spanish (es) • 🇫🇷 French (fr) • 🇩🇪 German (de) • 🇮🇹 Italian (it) • 🇵🇹 Portuguese (pt, pt-BR)  
🇯🇵 Japanese (ja) • 🇨🇳 Chinese (zh, zh-Hans, zh-Hant) • 🇰🇷 Korean (ko)  
🇷🇺 Russian (ru) • 🇸🇦 Arabic (ar) • 🇮🇳 Hindi (hi) • 🇳🇱 Dutch (nl) • 🇵🇱 Polish (pl) • 🇹🇷 Turkish (tr)

See [Lingo.dev's supported locales](https://lingo.dev/cli/commands/show#locale-sources) for the full list.

---

## Advanced Usage

### Custom Port

```bash
npx glossia serve --port 8080
```

### Deployment

The viewer is a static site. To deploy:

1. **Option A: Copy the viewer files**

   ```bash
   # The generated viewer is in .glossia/
   # Copy to your hosting provider
   ```

2. **Option B: Use as documentation**
   - Commit `.glossia/` to your repo
   - Share with your team
   - Everyone runs `npx glossia serve` locally

### CI/CD Integration

```yaml
# .github/workflows/translate-docs.yml
name: Translate API Docs

on:
  push:
    paths:
      - "openapi.yaml"

jobs:
  translate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Translate API Docs
        run: |
          npx glossia generate --spec openapi.yaml --languages es,fr,de,ja
        env:
          LINGODOTDEV_API_KEY: ${{ secrets.LINGODOTDEV_API_KEY }}

      - name: Commit translations
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add .glossia/
          git commit -m "Update API translations" || echo "No changes"
          git push
```

---

## Configuration

Glossia is designed to work with **zero configuration**, but you can customize via `.glossia/i18n.json` if needed.

This file is automatically generated and contains:

- Source and target languages
- File paths
- Translation provider settings

**Tip:** Commit `.glossia/` to version control. This ensures translations are preserved and shared across your team.

---

## Troubleshooting

### "No .glossia folder found"

**Solution:** Run `npx glossia generate` first to create translations before viewing.

### "Authentication failed"

**Solution:**

1. Run `npx lingo.dev@latest login`
2. Complete browser authentication
3. Try again

### "Translation failed"

**Possible causes:**

- No internet connection
- API rate limit exceeded (free tier: 1000 requests/hour)
- Invalid API spec

**Solution:** Check the error message. Glossia will tell you exactly what went wrong.

### Translations look wrong

**Solution:**

- Delete `.glossia/` folder
- Run `npx glossia generate` again with fresh translations
- If specific terms are wrong, you can manually edit `.glossia/i18n/{lang}/api.yaml`

---

## FAQ

**Q: Is this free?**  
A: Glossia itself is free and open source. Translation costs depend on your Lingo.dev plan. The free tier includes 10,000 translated words/month, which covers most small-to-medium APIs.

**Q: Can I use my own translation service?**  
A: Currently, Glossia uses Lingo.dev exclusively for the best results. Support for custom providers may be added in the future.

**Q: Does this work with Swagger 2.0?**  
A: Yes! Glossia supports both OpenAPI 3.x and Swagger 2.0 specs.

**Q: Can I edit translations manually?**  
A: Yes. Translations are stored in `.glossia/i18n/{lang}/api.yaml`. Edit them directly and restart the viewer.

**Q: Will my API calls still work in other languages?**  
A: Your API itself doesn't change. Only the **documentation** is translated. Parameter names, endpoints, and code examples stay in their original form.

**Q: How accurate are the translations?**  
A: Lingo.dev uses specialized AI models trained for technical documentation. Accuracy is very high, but always review critical content.

**Q: Can I deploy the docs as a website?**  
A: The viewer runs locally by default. Deploying as a public site is possible but not officially supported yet. This feature is coming soon.

---

## Contributing

Contributions are welcome! Please open an issue or PR on [GitHub](https://github.com/ade555/glossia).

---

## License

MIT © Ademola Thompson

---

## Credits

Built with:

- [Lingo.dev](https://lingo.dev) - AI translation engine
- [Swagger Parser](https://github.com/APIDevTools/swagger-parser) - OpenAPI parsing
- [React](https://react.dev) - UI framework
- [Vite](https://vitejs.dev) - Build tool
- [Tailwind CSS](https://tailwindcss.com) - Styling

---

**Made with ❤️ for developers building global APIs**
