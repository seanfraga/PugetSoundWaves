# Puget Sound Vessel Traffic Sonification

This interactive site sonifies U.S. Customs District vessel traffic in Puget Sound (1851–1861), based on historical ledgers. It maps:

- **Vessel type** → instrument sound
- **Tonnage** → pitch (larger = deeper tone)
- **Direction (inbound/outbound)** → stereo panning (right → left or left → right)

The interface is inspired by Datawrapper-style scatterplots and provides an interactive timeline with playback and manual scrubbing.

## 📁 Project Structure

```
puget-sound-sonification/
├── index.html          # Main webpage
├── main.js             # Visualization + audio logic
├── styles.css          # Layout and styling
├── data/               # Optional external CSV
└── README.md           # Project documentation
```

## 🚀 Features

- Dynamic scatterplot with:
  - **X-axis**: Time (by day)
  - **Y-axis**: Vessel tonnage
  - **Color**: Vessel type
- **Interactive playback**:
  - Play/pause
  - Adjustable speed (1x, 2x, 4x)
  - Scrubbing coming soon
- **Tooltips** + clickable dots replay individual vessel sounds

## 🔧 Technologies Used

- [D3.js](https://d3js.org) for visualization
- [Tone.js](https://tonejs.github.io) for sound synthesis
- HTML5, CSS3 (responsive + accessible)

## 🌐 Hosting on GitHub Pages

To deploy:
1. Create a new repository on GitHub
2. Push this project’s contents to the main branch
3. In GitHub settings, enable GitHub Pages from the `main` branch
4. Visit `https://yourusername.github.io/your-repo-name/`

## 📌 To Do

- Scrubbing playback head manually
- Load full CSV data externally
- Styling and color palette refinements
- Accessibility auditing

## 📜 License

MIT License