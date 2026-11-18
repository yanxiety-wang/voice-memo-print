# Voice print: radial waveform

An interactive radial waveform that draws one client conversation as a voice print.

**Live demo:** enable GitHub Pages (see below), then visit `https://<your-username>.github.io/voice-print/`

## How to read it

The conversation runs clockwise from the top, one bucket after another:
life context, goals, motivation, decision style, risk.

| Data | Drawn as |
|---|---|
| Emotion | Bar color |
| Goal | Bar points outward |
| Concern | Bar points inward |
| Arousal | Bar length |
| Pause | Break in the bar |
| Time to start | Gray arc before each bucket |
| Overall emotion mix | Donut in the centre |
| Identity | Purple outer ring (stable across meetings) |

Hover or tap a cluster to see the topic, emotion, pauses and the client's words.

## Files

- `index.html`: the page and legend
- `radial.js`: the drawing code (`drawRadial(svg, data, readout)`)
- `data.js`: sample data; replace with your pipeline's output

## Run it locally

Open `index.html` in a browser. No build step or server needed.

## Notes

- The sample data is illustrative, written by hand. It is not measured from a recording.
- The identity ring and the baseline wobble are placeholders. In production the ring comes from a
  speaker embedding and the wobble from the pitch contour.
- Don't commit real client recordings, transcripts or voice embeddings to a public repository.
  They are personal and biometric data.
