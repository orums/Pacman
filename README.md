# 🕹️ Pacman – iPad Game

Ein klassisches Pacman-Spiel, optimiert für iPad und Smartphone.

## 🎮 Features

- Touch-Steuerung für iPad & iPhone
- Responsive Design
- Klassische Pacman-Mechanik
- Power-Ups & Geister-KI
- Highscore (localStorage)

## 🚀 Schnellstart

```bash
git clone git@github.com:orums/Pacman.git
cd Pacman
npx serve .
```

## 🤖 Claude Code Integration

```bash
git clone git@github.com:orums/Pacman.git
cd Pacman
claude
```

### Auf iPad mit Claude Code arbeiten

**Empfohlen: GitHub Codespaces**

1. Repo auf GitHub öffnen
2. **"Code"** → **"Codespaces"** → **"New codespace"**
3. Im Browser-Terminal Claude Code installieren:
   ```bash
   npm install -g @anthropic-ai/claude-code
   claude
   ```

**Alternativen:**

| Methode | App |
|---------|-----|
| iSH Shell | iOS App Store |
| Blink Shell | iOS App Store |

## 📁 Projektstruktur

```
Pacman/
├── index.html
├── src/
│   ├── game.js
│   ├── pacman.js
│   ├── ghost.js
│   ├── maze.js
│   └── input.js
├── styles/
│   └── main.css
└── README.md
```

## 🗺️ Roadmap

- [x] README & Projektstruktur
- [ ] Spielfeld rendern
- [ ] Pacman-Bewegung (Touch + Keyboard)
- [ ] Punkte-System
- [ ] Geister-KI
- [ ] Power-Ups
- [ ] Highscore-Tabelle
- [ ] PWA-Support

## 📄 Lizenz

MIT License
