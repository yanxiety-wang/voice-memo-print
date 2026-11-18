// Sample profile for one client. Replace with your pipeline's output.
// Each topic is drawn as NB moments. s: "g" goal | "c" concern. a: arousal 0-1.
// p: indexes of moments that contain a pause. tts: time to start, in seconds.
window.VOICE_PRINT_DATA = {
  personId: "VF-8C21-04A7",
  // Placeholder: in production these bits come from the speaker embedding.
  identityBits: null,
  emotions: {
    joy:  { color: "#EF9F27", label: "Joy" },
    calm: { color: "#1D9E75", label: "Calm" },
    anx:  { color: "#D85A30", label: "Anxiety" },
    sad:  { color: "#378ADD", label: "Sadness" },
    neu:  { color: "#888780", label: "Neutral" }
  },
  buckets: [
    { name: "Life context", tts: 1.1, topics: [
      { label: "Two teenagers at home", s: "g", e: "joy",  a: 0.55, quote: "They keep me busy, in a good way." },
      { label: "Steady nursing job",    s: "g", e: "calm", a: 0.40, quote: "Twenty years at the same hospital." },
      { label: "Her mother’s health",   s: "c", e: "sad",  a: 0.50, p: [2, 4], quote: "Mom needs more help every year." } ] },
    { name: "Goals", tts: 0.8, topics: [
      { label: "Retire at 62",          s: "g", e: "calm", a: 0.60, quote: "Sixty-two. I have that number in my head." },
      { label: "Kids’ college",         s: "g", e: "joy",  a: 0.78, quote: "Both of them through school, no loans." },
      { label: "Travel with her sister",s: "g", e: "joy",  a: 0.50, quote: "We always said Portugal." } ] },
    { name: "Motivation", tts: 1.9, topics: [
      { label: "Not burdening her kids",s: "c", e: "anx",  a: 0.82, p: [1, 3, 5], quote: "I just don’t want them to have to take care of me." },
      { label: "Independence",          s: "g", e: "calm", a: 0.55, quote: "I want to decide my own days." } ] },
    { name: "Decision style", tts: 1.4, topics: [
      { label: "Researches before deciding", s: "g", e: "calm", a: 0.45, quote: "I read everything first." },
      { label: "Checks with her sister",     s: "g", e: "neu",  a: 0.35, p: [3], quote: "I usually run it by my sister." } ] },
    { name: "Risk", tts: 3.6, topics: [
      { label: "Losing savings in a drop", s: "c", e: "anx", a: 0.75, p: [0, 2, 3, 5], quote: "If we lost, say… fifty thousand, I’d panic." },
      { label: "Memory of 2022",           s: "c", e: "sad", a: 0.50, p: [4], quote: "I stopped opening the statements." } ] }
  ]
};
