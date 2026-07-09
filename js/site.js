// Theme toggle — initial theme is set by the inline head script to avoid FOUC.
(function () {
  var btn = document.querySelector('.theme-toggle');
  if (btn) {
    btn.addEventListener('click', function () {
      var root = document.documentElement;
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { }
    });
  }
})();

// Signature perception-stack animation — home page only.
(function () {
  if (!document.getElementById('sig-s0')) return;

  var NS = 'http://www.w3.org/2000/svg';
  function E(name, attrs, delay) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) if (k !== 'text') e.setAttribute(k, attrs[k]);
    if (attrs.text != null) e.textContent = attrs.text;
    if (delay != null) e.style.animationDelay = delay + 's';
    return e;
  }
  function add(p, name, attrs, delay) { var e = E(name, attrs, delay); p.appendChild(e); return e; }
  function pol(cx, cy, r, deg) { var a = deg * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }
  function arc(cx, cy, r, a0, a1) {
    var p0 = pol(cx, cy, r, a0), p1 = pol(cx, cy, r, a1), lg = (a1 - a0) % 360 > 180 ? 1 : 0;
    return 'M' + p0[0].toFixed(1) + ' ' + p0[1].toFixed(1) + ' A' + r + ' ' + r + ' 0 ' + lg + ' 1 ' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1);
  }
  function dash(el, len) { el.setAttribute('stroke-dasharray', len); el.setAttribute('stroke-dashoffset', len); }
  function fit(el) { var L = el.getTotalLength(); el.setAttribute('stroke-dasharray', L); el.setAttribute('stroke-dashoffset', L); }
  var seed = 91; function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
  function bracket(x1, y1, x2, y2) {
    var L = 15;
    return 'M' + x1 + ' ' + (y1 + L) + ' V' + y1 + ' H' + (x1 + L) +
      ' M' + (x2 - L) + ' ' + y1 + ' H' + x2 + ' V' + (y1 + L) +
      ' M' + x1 + ' ' + (y2 - L) + ' V' + y2 + ' H' + (x1 + L) +
      ' M' + (x2 - L) + ' ' + y2 + ' H' + x2 + ' V' + (y2 - L);
  }

  /* 01 · inspect (gauge + thermal) */
  (function () {
    var s = document.getElementById('sig-s0');
    var gx = 250, gy = 112, R = 54, A0 = 130, val = 326;
    add(s, 'circle', { class: 'dial fadein', cx: gx, cy: gy, r: R }, 0.1);
    var ticks = add(s, 'g', { class: 'fadein' }, 0.15);
    for (var a = A0; a <= 410; a += 35) {
      var i0 = pol(gx, gy, R - 5, a), o0 = pol(gx, gy, R + 2, a);
      add(ticks, 'line', { class: 'tick', x1: i0[0].toFixed(1), y1: i0[1].toFixed(1), x2: o0[0].toFixed(1), y2: o0[1].toFixed(1) });
    }
    var av = add(s, 'path', { class: 'arc-val draw', d: arc(gx, gy, R - 10, A0, val) }, 0.7); fit(av);
    var needle = add(s, 'g', { class: 'needle' });
    var np = pol(gx, gy, R - 14, A0);
    add(needle, 'line', { class: 'needle-l', x1: gx, y1: gy, x2: np[0].toFixed(1), y2: np[1].toFixed(1) });
    add(s, 'circle', { class: 'hub fadein', cx: gx, cy: gy, r: 3 }, 0.7);
    add(s, 'path', { class: 'box pop', d: bracket(gx - 74, gy - 74, gx + 74, gy + 74) }, 0.35);
    add(s, 'text', { class: 't-acc fadein', x: gx - 74, y: gy - 80, text: 'gauge' }, 0.35);
    add(s, 'text', { class: 't-head fadein', x: gx - 24, y: gy + 84, text: '6.2 bar' }, 1.7);

    var tx = 720, ty = 108;
    add(s, 'rect', { class: 'obj', x: tx - 70, y: ty - 46, width: 150, height: 96, rx: 4 });
    add(s, 'circle', { class: 'ring-fill bloom', cx: tx, cy: ty, r: 12 }, 2.05);
    [[12, 0.9, 2.1], [22, 0.6, 2.25], [33, 0.38, 2.4], [45, 0.22, 2.55]].forEach(function (r) {
      add(s, 'circle', { class: 'ring bloom', cx: tx, cy: ty, r: r[0], 'stroke-width': 1.4, style: 'opacity:' + r[1] }, r[2]);
    });
    add(s, 'path', { class: 'cross fadein', d: 'M' + (tx - 7) + ' ' + ty + ' h14 M' + tx + ' ' + (ty - 7) + ' v14' }, 2.6);
    add(s, 'path', { class: 'box pop', d: bracket(tx - 58, ty - 58, tx + 58, ty + 58) }, 1.9);
    add(s, 'text', { class: 't-acc fadein', x: tx - 58, y: ty - 64, text: 'hotspot' }, 1.9);
    add(s, 'text', { class: 't-head fadein', x: tx - 40, y: ty + 78, text: '78°C · ΔT +24' }, 2.7);
  })();

  /* 02 · infer (neural net on edge) */
  (function () {
    var s = document.getElementById('sig-s1');
    var layers = [{ x: 150, n: 4 }, { x: 360, n: 5 }, { x: 570, n: 5 }, { x: 782, n: 4 }];
    var cy = 108, sp = 27;
    function ny(L, i) { return cy + (i - (L.n - 1) / 2) * sp; }
    for (var l = 0; l < layers.length - 1; l++) {
      var A = layers[l], B = layers[l + 1];
      for (var i = 0; i < A.n; i++) for (var j = 0; j < B.n; j++) {
        var x1 = A.x + 9, y1 = ny(A, i), x2 = B.x - 9, y2 = ny(B, j);
        var e = add(s, 'line', { class: 'edge draw', 'marker-end': 'url(#sig-ar)', x1: x1, y1: y1.toFixed(1), x2: x2, y2: y2.toFixed(1) }, (1.45 + l * 0.75).toFixed(2));
        dash(e, Math.hypot(x2 - x1, y2 - y1).toFixed(0)); e.style.animationDuration = '0.5s';
      }
    }
    var outLabels = [['forklift', '0.94', 1], ['pallet', '0.05', 0], ['person', '0.03', 0], ['cone', '0.01', 0]];
    layers.forEach(function (L, l) {
      for (var i = 0; i < L.n; i++) {
        var isWin = (l === 3 && i === 0);
        add(s, 'circle', { class: 'neuron npulse' + (isWin ? ' win' : ''), cx: L.x, cy: ny(L, i).toFixed(1), r: 9 }, (1.2 + l * 0.75).toFixed(2));
      }
    });
    for (var i = 0; i < 4; i++) {
      var y = ny(layers[3], i);
      add(s, 'text', { class: (outLabels[i][2] ? 't-head' : '') + ' fadein', x: 800, y: (y - 2).toFixed(1), text: outLabels[i][0] }, (3.5 + i * 0.06).toFixed(2));
      add(s, 'text', { class: (outLabels[i][2] ? 't-acc' : '') + ' fadein', x: 800, y: (y + 10).toFixed(1), text: outLabels[i][1] }, (3.55 + i * 0.06).toFixed(2));
    }
    ['input', 'hidden', 'hidden', 'output'].forEach(function (t, l) {
      add(s, 'text', { class: 'lyr-cap fadein', x: layers[l].x, y: 200, text: t, 'text-anchor': 'middle' }, (0.2 + l * 0.1).toFixed(2));
    });
    // input image feeding the input layer
    add(s, 'rect', { class: 'in-tile npulse', x: 44, y: 86, width: 54, height: 44, rx: 4 }, 0.4);
    add(s, 'circle', { class: 'in-sun fadein', cx: 60, cy: 100, r: 4 }, 0.18);
    add(s, 'path', { class: 'in-mark fadein', d: 'M48 126 L62 108 L72 118 L84 102 L96 126' }, 0.18);
    add(s, 'text', { class: 'lyr-cap fadein', x: 71, y: 78, text: 'image', 'text-anchor': 'middle' }, 0.12);
    for (var q = 0; q < layers[0].n; q++) {
      var cc = add(s, 'line', { class: 'edge draw', 'marker-end': 'url(#sig-ar)', x1: 100, y1: 108, x2: 141, y2: ny(layers[0], q).toFixed(1) }, (0.7 + q * 0.04).toFixed(2));
      fit(cc); cc.style.animationDuration = '0.5s';
    }
    add(s, 'text', { class: 't-acc fadein', x: 34, y: 30, text: 'INT8 · 12 ms · on-device' }, 2.5);
  })();

  /* 03 · estimate (kalman filter) */
  (function () {
    var s = document.getElementById('sig-s2');
    var x0 = 70, x1 = 936, N = 48;
    function truth(t) { return 108 + 30 * Math.sin(t * 3.1 + 0.5) - 8 * Math.cos(t * 6.2); }
    add(s, 'line', { class: 'axis', x1: x0, y1: 186, x2: x1, y2: 186 });
    add(s, 'line', { class: 'axis', x1: x0, y1: 40, x2: x0, y2: 186 });
    var td = 'M';
    for (var k = 0; k <= 60; k++) { var t = k / 60; td += ' ' + (x0 + t * (x1 - x0)).toFixed(1) + ' ' + truth(t).toFixed(1); }
    add(s, 'path', { class: 'truth fadein', d: td }, 0.2);
    var R = 170, Q = 3.5, P = 260, xe = truth(0) + 34;
    var meas = [], est = [], up = [], lo = [];
    for (var i = 0; i < N; i++) {
      var t = i / (N - 1), x = x0 + t * (x1 - x0);
      var z = truth(t) + (rnd() - 0.5) * 40;
      P += Q; var Kg = P / (P + R); xe += Kg * (z - xe); P *= (1 - Kg);
      var half = Math.min(48, Math.sqrt(P) * 1.4 + 3);
      meas.push([x, z]); est.push([x, xe]); up.push([x, xe - half]); lo.push([x, xe + half]);
    }
    var bd = 'M' + up.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' L ') +
      ' L ' + lo.slice().reverse().map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' L ') + ' Z';
    add(s, 'path', { class: 'band-u fadein', d: bd }, 1.1);
    meas.forEach(function (p, i) { add(s, 'circle', { class: 'meas fadein', cx: p[0].toFixed(1), cy: p[1].toFixed(1), r: 1.9 }, (0.3 + i * 0.028).toFixed(2)); });
    var ed = 'M' + est.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' L ');
    var e = add(s, 'path', { class: 'est draw', d: ed }, 0.5); fit(e); e.style.animationDuration = '1.8s';
    add(s, 'text', { class: 'fadein', x: 92, y: 52, text: 'z  measurements (noisy)' }, 0.4);
    add(s, 'text', { class: 't-acc fadein', x: 92, y: 66, text: 'x̂  Kalman estimate' }, 1.6);
    add(s, 'text', { class: 'fadein', x: 700, y: 178, text: 'P (uncertainty) ↓ converges' }, 2.4);
  })();

  /* 04 · identify (actuator characterisation / sim-to-real) */
  (function () {
    var s = document.getElementById('sig-s3');

    // step command → actuator
    add(s, 'text', { class: 'fadein', x: 40, y: 58, text: 'τ · step command' }, 0.15);
    var st = add(s, 'path', { class: 'stepin draw', d: 'M 40 104 H 66 V 76 H 126' }, 0.3); fit(st);
    add(s, 'line', { class: 'flow fadein', 'marker-end': 'url(#sig-ar)', x1: 132, y1: 76, x2: 172, y2: 76 }, 0.55);
    var mx = 196, my = 76;
    add(s, 'circle', { class: 'mot pop', cx: mx, cy: my, r: 17 }, 0.5);
    [45, 135, 225, 315].forEach(function (a) {
      var p0 = pol(mx, my, 17, a), p1 = pol(mx, my, 22, a);
      add(s, 'line', { class: 'flow fadein', x1: p0[0].toFixed(1), y1: p0[1].toFixed(1), x2: p1[0].toFixed(1), y2: p1[1].toFixed(1) }, 0.6);
    });
    var rot = add(s, 'g', { class: 'rot fadein' }, 0.6);
    add(rot, 'line', { class: 'mot-arm', x1: mx, y1: my, x2: mx, y2: my - 11 });
    add(s, 'circle', { class: 'mot-hub fadein', cx: mx, cy: my, r: 3 }, 0.6);
    add(s, 'text', { class: 'fadein', x: mx, y: 112, text: 'actuator', 'text-anchor': 'middle' }, 0.55);
    add(s, 'line', { class: 'flow fadein', 'marker-end': 'url(#sig-ar)', x1: 224, y1: 76, x2: 292, y2: 76 }, 0.8);

    // identified parameters — real values from a BAM m4 fit of a RobStride 03 actuator
    add(s, 'text', { class: 't-acc fadein', x: 40, y: 142, text: 'system id' }, 2.1);
    [
      ['I', 'a', 'armature', '0.135', 2.35],
      ['F', 'v', 'viscous', '0.580', 2.65],
      ['F', 's', 'stribeck', '0.464', 2.95]
    ].forEach(function (p, i) {
      var y = 160 + i * 15;
      var sym = add(s, 'text', { class: 't-head fadein', x: 40, y: y, text: p[0] }, p[4]);
      add(sym, 'tspan', { dy: 2.5, 'font-size': '7.5px', text: p[1] });
      add(s, 'text', { class: 'fadein', x: 64, y: y, text: p[2] }, p[4]);
      add(s, 'text', { class: 't-head fadein', x: 152, y: y, text: p[3] }, p[4]);
      add(s, 'text', { class: 'pchk pop', x: 196, y: y, text: '✓' }, p[4] + 0.15);
    });

    // plot: axes + setpoint
    var x0 = 300, x1 = 950;
    add(s, 'line', { class: 'axis fadein', x1: x0, y1: 190, x2: 952, y2: 190 }, 0.1);
    add(s, 'line', { class: 'axis fadein', x1: x0, y1: 40, x2: x0, y2: 190 }, 0.1);
    add(s, 'text', { class: 'fadein', x: 306, y: 34, text: 'θ response' }, 0.15);
    add(s, 'line', { class: 'ref fadein', x1: x0, y1: 70, x2: x1, y2: 70 }, 0.25);
    add(s, 'text', { class: 'fadein', x: 888, y: 62, text: 'setpoint' }, 0.3);

    // hardware: delayed, mildly underdamped, friction offset; nominal sim: no delay, no friction
    function stepResp(a, w, u) {
      if (u <= 0) return 0;
      return 1 - Math.exp(-a * u) * (Math.cos(w * u) + (a / w) * Math.sin(w * u));
    }
    function hw(t) { return 178 - 102 * stepResp(6, 9, (t - 0.05) / 0.95); }
    function nv(t) { return 178 - 108 * stepResp(3.6, 10, t); }
    function X(t) { return x0 + t * (x1 - x0); }

    var N = 44;
    for (var i = 0; i < N; i++) {
      var t = i / (N - 1);
      add(s, 'circle', {
        class: 'meas fadein', r: 1.9,
        cx: X(t).toFixed(1), cy: (hw(t) + (rnd() - 0.5) * 5).toFixed(1)
      }, (0.45 + i * 0.022).toFixed(2));
    }
    add(s, 'text', { class: 'fadein', x: 420, y: 176, text: 'hardware (logged)' }, 0.9);

    // nominal sim + gap band — dims once parameters are identified
    var dim = add(s, 'g', { class: 'dimout' }, 3.25);
    var bd = 'M', k;
    for (k = 0; k <= 56; k++) { var tb = k / 56; bd += ' ' + X(tb).toFixed(1) + ' ' + nv(tb).toFixed(1); }
    for (k = 56; k >= 0; k--) { var tc = k / 56; bd += ' L ' + X(tc).toFixed(1) + ' ' + hw(tc).toFixed(1); }
    add(dim, 'path', { class: 'band-u fadein', d: bd + ' Z' }, 1.9);
    var nd = 'M';
    for (k = 0; k <= 70; k++) { var tn = k / 70; nd += ' ' + X(tn).toFixed(1) + ' ' + nv(tn).toFixed(1); }
    add(dim, 'path', { class: 'naive fadein', d: nd }, 1.3);
    add(dim, 'text', { class: 'fadein', x: 540, y: 32, text: 'sim · nominal params' }, 1.5);
    add(dim, 'text', { class: 't-acc fadein', x: 448, y: 76, text: 'gap' }, 2.1);

    // identified sim — drawn through the hardware data
    var fd = 'M';
    for (k = 0; k <= 70; k++) { var tf = k / 70; fd += ' ' + X(tf).toFixed(1) + ' ' + hw(tf).toFixed(1); }
    var f = add(s, 'path', { class: 'fit draw', d: fd }, 3.4); fit(f);
    f.style.animationDuration = '1.2s';
    add(s, 'text', { class: 't-acc fadein', x: 640, y: 56, text: 'sim · identified' }, 4.2);
    add(s, 'text', { class: 't-head fadein', x: 750, y: 174, text: 'sim-to-real gap → 0' }, 4.7);
  })();

  /* controller */
  var scenes = ['sig-s0', 'sig-s1', 'sig-s2', 'sig-s3'].map(function (id) { return document.getElementById(id); });
  var caps = [
    '01 <b>inspect</b> · gauge + thermal',
    '02 <b>infer</b> · neural net on edge',
    '03 <b>estimate</b> · kalman filter',
    '04 <b>identify</b> · actuator sim-to-real'
  ];
  var durs = [5200, 5800, 5400, 7400];
  var capEl = document.getElementById('sig-cap'), pipsEl = document.getElementById('sig-pips');
  var pips = scenes.map(function (_, i) {
    var b = document.createElement('button');
    b.className = 'sig-pip';
    b.setAttribute('aria-label', 'Show scene ' + (i + 1));
    b.addEventListener('click', function () { go(i); schedule(); });
    pipsEl.appendChild(b); return b;
  });
  var cur = -1, timer;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function go(i) {
    scenes.forEach(function (sc, j) { sc.classList.toggle('active', j === i); });
    pips.forEach(function (p, j) { p.classList.toggle('on', j === i); });
    capEl.innerHTML = caps[i];
    var sc = scenes[i]; sc.classList.remove('run'); void sc.getBoundingClientRect(); sc.classList.add('run');
    cur = i;
  }
  function schedule() { if (reduce) return; clearTimeout(timer); timer = setTimeout(function () { go((cur + 1) % scenes.length); schedule(); }, durs[cur]); }
  go(0); schedule();
})();
