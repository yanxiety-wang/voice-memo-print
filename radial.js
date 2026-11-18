// Radial waveform voice print. drawRadial(svg, data, readoutEl) draws into an <svg viewBox="0 0 680 550">.
// Rules: color = emotion, goal outward / concern inward, length = arousal,
// break = pause, gray arc = time to start, centre = emotion mix, outer ring = identity.
(function () {
  const NS = "http://www.w3.org/2000/svg", TAU = Math.PI * 2, TOP = -Math.PI / 2;
  const CX = 340, CY = 272, R0 = 112, NB = 8, LEAD = 0.05, TOPIC_GAP = 0.028;

  function drawRadial(svg, data, readout) {
    const E = data.emotions, B = data.buckets, groups = [];
    const el = (n, a, p = svg) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; };
    const P = (r, ang) => [CX + r * Math.cos(ang), CY + r * Math.sin(ang)];
    const wig = (i, k) => 0.74 + 0.26 * Math.sin(i * 1.9 + k * 2.7);   // natural variation between moments
    const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

    const nTopics = B.reduce((s, b) => s + b.topics.length, 0);
    const leadSum = B.reduce((s, b) => s + b.tts * LEAD, 0);
    const per = (TAU - leadSum - nTopics * TOPIC_GAP) / (nTopics * NB);
    let a = TOP;

    B.forEach((b, bi) => {
      const start = a;
      // time to start: gray arc before the bucket
      const [x0, y0] = P(R0, a + 0.01), [x1, y1] = P(R0, a + b.tts * LEAD - 0.01);
      el("path", { d: `M${x0} ${y0}A${R0} ${R0} 0 0 1 ${x1} ${y1}`, fill: "none", stroke: "#888780", "stroke-width": 4, opacity: 0.45 });
      a += b.tts * LEAD;

      b.topics.forEach((t, ti) => {
        const g = el("g", { class: "topic" }), color = E[t.e].color, key = `${bi}-${ti}`;
        g.dataset.k = key; groups.push(g);
        // invisible wedge behind the bars, so the whole cluster is easy to point at or tap
        const h0 = a, h1 = a + NB * per, rin = R0 - 70, rout = R0 + 118;
        const [p0x, p0y] = P(rout, h0), [p1x, p1y] = P(rout, h1), [p2x, p2y] = P(rin, h1), [p3x, p3y] = P(rin, h0);
        el("path", { d: `M${p0x} ${p0y}A${rout} ${rout} 0 0 1 ${p1x} ${p1y}L${p2x} ${p2y}A${rin} ${rin} 0 0 0 ${p3x} ${p3y}Z`,
          fill: "#000", "fill-opacity": 0, "pointer-events": "all" }, g);
        for (let i = 0; i < NB; i++) for (let j = 0; j < 2; j++) {
          const ang = a + (i + (j + 0.5) / 2) * per, dir = t.s === "g" ? 1 : -1;
          const base = R0 + 4 * Math.sin(ang * 5 + bi);              // placeholder for the pitch contour
          const L = (t.s === "g" ? 16 + t.a * 96 : 10 + t.a * 50) * wig(i * 2 + j, bi * 3 + ti);
          const r0 = base + 3 * dir, w = t.s === "g" ? 2.6 : 3.4;
          const seg = (p, q) => { const [ax, ay] = P(p, ang), [bx, by] = P(q, ang); el("line", { x1: ax, y1: ay, x2: bx, y2: by, stroke: color, "stroke-width": w }, g); };
          if (t.p && t.p.includes(i)) { const gap = L * 0.35, h = (L - gap) * 0.5; seg(r0, r0 + dir * h); seg(r0 + dir * (h + gap), r0 + dir * L); }
          else seg(r0, r0 + dir * L);
        }
        const show = () => {
          groups.forEach(x => x.style.opacity = x.dataset.k === key ? 1 : 0.15);
          if (!readout) return;
          const pauses = t.p ? `, ${t.p.length} pause${t.p.length > 1 ? "s" : ""}` : "";
          readout.innerHTML = `<strong>${esc(b.name)}: ${esc(t.label)}</strong>. ${t.s === "g" ? "Goal" : "Concern"}, mostly ${E[t.e].label.toLowerCase()}, arousal ${Math.round(t.a * 100)}%${pauses}. Time to start ${b.tts}s.<br><q>${esc(t.quote)}</q>`;
        };
        g.addEventListener("mouseenter", show); g.addEventListener("click", show);
        a += NB * per + TOPIC_GAP;
      });

      // bucket name, kept inside the canvas
      const mid = (start + a) / 2, [tx, ty] = P(250, mid), cs = Math.cos(mid), sn = Math.sin(mid);
      const label = el("text", { x: tx, y: ty + (sn > 0.5 ? 10 : sn < -0.5 ? -2 : 4), class: "bucket",
        "text-anchor": Math.abs(cs) < 0.3 ? "middle" : cs > 0 ? "start" : "end" });
      label.textContent = b.name;
      const bb = label.getBBox();
      if (bb.x < 8) label.setAttribute("x", tx + (8 - bb.x));
      if (bb.x + bb.width > 672) label.setAttribute("x", tx - (bb.x + bb.width - 672));
    });

    // identity ring: real bits from the speaker embedding, or a placeholder pattern
    const bits = data.identityBits || Array.from({ length: 96 }, (_, i) => Math.abs(Math.sin(i * 12.9898) * 43758.5453 % 1) > 0.5 ? 1 : 0);
    bits.forEach((v, i) => {
      const ang = TOP + i * TAU / bits.length, [x0, y0] = P(220, ang), [x1, y1] = P(220 + (v ? 14 : 6), ang);
      el("line", { x1: x0, y1: y0, x2: x1, y2: y1, stroke: "#7F77DD", "stroke-width": v ? 2 : 1.1, "stroke-linecap": "round" });
    });

    // centre: emotion mix, weighted by arousal
    const mix = {}; B.forEach(b => b.topics.forEach(t => mix[t.e] = (mix[t.e] || 0) + t.a));
    const total = Object.values(mix).reduce((x, y) => x + y, 0);
    let d = TOP; const ri = 26, ro = 40;
    Object.keys(E).forEach(k => {
      if (!mix[k]) return;
      const v = mix[k] / total, a0 = d + 0.03, a1 = d + v * TAU - 0.03, lg = a1 - a0 > Math.PI ? 1 : 0;
      const [x0, y0] = P(ro, a0), [x1, y1] = P(ro, a1), [x2, y2] = P(ri, a1), [x3, y3] = P(ri, a0);
      el("path", { d: `M${x0} ${y0}A${ro} ${ro} 0 ${lg} 1 ${x1} ${y1}L${x2} ${y2}A${ri} ${ri} 0 ${lg} 0 ${x3} ${y3}Z`, fill: E[k].color });
      d += v * TAU;
    });

    svg.addEventListener("mouseleave", () => groups.forEach(g => g.style.opacity = 1));
    return { mix, total };
  }
  window.drawRadial = drawRadial;
})();
