import { P, TAU, audio, clamp, lerp, rnd, smooth, withAlpha } from '../core';
import { T, bez, emissive, rect, ribbon, roundRect, shape } from '../art';
import { crackStar, dust, holeMark, impactFlash, makeBullet, shockRing, sparkFan, splinters } from '../fx';
import type { Weapon, WeaponDrawState } from '../types';

type Ctx = CanvasRenderingContext2D;

/** Draws a full arrow. Nock at (0,0), tip at (len,0). */
function arrowArt(ctx: Ctx, len: number, glow: number, t: number) {
  const tip = len;
  // carbon shaft
  const sg = ctx.createLinearGradient(0, -2.2, 0, 2.2);
  sg.addColorStop(0, '#6b7280');
  sg.addColorStop(0.35, '#1f2937');
  sg.addColorStop(1, '#030507');
  ctx.fillStyle = sg;
  roundRect(ctx, 6, -1.9, tip - 24, 3.8, 1.9);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fillRect(8, -1.4, tip - 36, 0.8);
  // cresting rings
  for (const [x, col] of [[34, '#f97316'], [38, '#f8fafc'], [42, '#f97316']] as [number, string][]) {
    ctx.fillStyle = col;
    ctx.fillRect(x, -2, 2.4, 4);
  }
  // three vanes (two visible + cock feather)
  for (const d of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(8, d * 1.4);
    ctx.lineTo(13, d * 9);
    ctx.quadraticCurveTo(26, d * 10.4, 33, d * 6);
    ctx.lineTo(33, d * 1.4);
    ctx.closePath();
    const vg = ctx.createLinearGradient(0, 0, 0, d * 10);
    vg.addColorStop(0, '#e2e8f0');
    vg.addColorStop(1, d < 0 ? '#ffffff' : '#94a3b8');
    ctx.fillStyle = vg;
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 0.7;
    ctx.stroke();
    ctx.strokeStyle = 'rgba(100,116,139,0.55)';
    ctx.lineWidth = 0.6;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(12 + i * 3.6, d * 1.6);
      ctx.lineTo(15 + i * 3.4, d * (8.5 - Math.abs(i - 2) * 0.6));
      ctx.stroke();
    }
  }
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.moveTo(8, -0.8);
  ctx.quadraticCurveTo(22, -1.2, 33, -0.4);
  ctx.lineTo(33, 0.9);
  ctx.quadraticCurveTo(22, 1.4, 8, 0.8);
  ctx.closePath();
  ctx.fill();
  // glowing nock
  const ng = ctx.createLinearGradient(0, -3, 0, 3);
  ng.addColorStop(0, '#fff7a8');
  ng.addColorStop(1, '#f97316');
  ctx.fillStyle = ng;
  roundRect(ctx, 0, -3.1, 8, 6.2, 2);
  ctx.fill();
  ctx.fillStyle = '#05070a';
  ctx.fillRect(0, -0.7, 3, 1.4);
  // three-blade broadhead
  ctx.beginPath();
  ctx.moveTo(tip, 0);
  ctx.lineTo(tip - 23, -9.5);
  ctx.quadraticCurveTo(tip - 28, -3, tip - 26, 0);
  ctx.quadraticCurveTo(tip - 28, 3, tip - 23, 9.5);
  ctx.closePath();
  const hg = ctx.createLinearGradient(tip - 26, -9, tip, 9);
  hg.addColorStop(0, '#ffffff');
  hg.addColorStop(0.45, '#b9c6d6');
  hg.addColorStop(0.55, '#6b7788');
  hg.addColorStop(1, '#2a323c');
  ctx.fillStyle = hg;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.6)';
  ctx.lineWidth = 0.9;
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.moveTo(tip - 2, 0);
  ctx.lineTo(tip - 24, 0);
  ctx.stroke();
  rect(ctx, tip - 30, -2.6, 8, 5.2, 2, T.brass, { lw: 0.7 });
  if (glow > 0.01) {
    emissive(ctx, tip - 4, 0, 10 + glow * 14, '#8ef7c0', glow * 0.9);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 4; i++) {
      const a = t * 7 + (i / 4) * TAU;
      ctx.fillStyle = withAlpha('#d9ffe9', glow * 0.9);
      ctx.beginPath();
      ctx.arc(tip - 10 + Math.cos(a) * 9, Math.sin(a) * 9 * 0.7, 1.5, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }
}

function drawBow(ctx: Ctx, s: WeaponDrawState) {
  const ch = clamp(s.charge, 0, 1);
  const c = clamp(s.cycle, 0, 1);
  const flex = Math.pow(ch, 0.75);
  const tipX = -18 - flex * 18;
  const tipY = 96 - flex * 14;
  // string rings after release + full draw tension tremble
  const tremble = ch > 0.85 ? Math.sin(s.t * 50) * (ch - 0.85) * 2.2 : 0;
  const vib = ch < 0.02 && c < 1 ? Math.exp(-c * 7) * Math.sin(c * 96) * 8 * (1 - c) : 0;
  const nockX = tipX - 70 * flex + vib + tremble;
  const idleSway = s.icon ? 0 : Math.sin(s.t * 1.6) * 0.6;

  ctx.save();
  ctx.translate(0, idleSway);

  /* arrow (behind the limbs, in front of the shelf) */
  const showArrow = c > 0.42 || ch > 0.01;
  const slide = ch > 0.01 ? 0 : (1 - smooth(0.42, 0.66, c)) * 34;
  const aAlpha = ch > 0.01 ? 1 : smooth(0.42, 0.52, c);
  /* limbs: laminated recurve (maple + walnut core + glass edges) */
  const limb = (d: number) => {
    const p0 = [6, 24 * d],
      p1 = [9, 56 * d],
      p2 = [-4, 80 * d],
      p3 = [tipX, tipY * d];
    const pts: number[][] = [];
    for (let i = 0; i <= 30; i++) pts.push(bez(p0, p1, p2, p3, i / 30));
    const w = (u: number) => lerp(5.6, 2.1, u);
    ribbon(ctx, pts, w);
    const g = ctx.createLinearGradient(-20, 0, 20, 0);
    g.addColorStop(0, '#8a5a24');
    g.addColorStop(0.5, '#e4bd80');
    g.addColorStop(1, '#a9742f');
    ctx.fillStyle = g;
    ctx.fill();
    ribbon(ctx, pts, (u) => w(u) * 0.36);
    ctx.fillStyle = '#3a2410';
    ctx.fill();
    ribbon(ctx, pts, (u) => w(u) * 0.12, -2.4);
    ctx.fillStyle = 'rgba(255,240,200,0.55)';
    ctx.fill();
    ribbon(ctx, pts, w);
    ctx.strokeStyle = 'rgba(15,8,2,0.85)';
    ctx.lineWidth = 1.1;
    ctx.stroke();
    // limb bolt + tip overlay
    const tp = pts[pts.length - 1];
    ctx.fillStyle = '#d4af37';
    ctx.beginPath();
    ctx.arc(tp[0], tp[1], 3.2, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.6)';
    ctx.lineWidth = 0.8;
    ctx.stroke();
    const mid = pts[6];
    ctx.fillStyle = '#d4af37';
    ctx.beginPath();
    ctx.arc(mid[0], mid[1], 2.4, 0, TAU);
    ctx.fill();
    ctx.stroke();
  };
  limb(-1);
  limb(1);

  /* riser: carved walnut with brass inlay */
  const riser = () => {
    ctx.beginPath();
    ctx.moveTo(6, -38);
    ctx.bezierCurveTo(17, -31, 17, -17, 10, -9);
    ctx.lineTo(10, -8);
    ctx.bezierCurveTo(6, -5, 6, 5, 10, 8);
    ctx.lineTo(10, 9);
    ctx.bezierCurveTo(17, 17, 17, 31, 6, 38);
    ctx.lineTo(-4, 38);
    ctx.bezierCurveTo(-9, 24, -9, -24, -4, -38);
    ctx.closePath();
  };
  shape(ctx, riser, -38, 38, T.walnut, { hi: 0.4 });
  ctx.save();
  riser();
  ctx.clip();
  // grain
  ctx.strokeStyle = 'rgba(20,8,2,0.28)';
  ctx.lineWidth = 0.9;
  for (let i = 0; i < 12; i++) {
    const x = -7 + i * 2.2;
    ctx.beginPath();
    ctx.moveTo(x, -38);
    ctx.bezierCurveTo(x + 3, -14, x - 3, 14, x + 2, 38);
    ctx.stroke();
  }
  // leather grip wrap
  const gg = ctx.createLinearGradient(-8, 0, 12, 0);
  gg.addColorStop(0, '#1b0f08');
  gg.addColorStop(0.5, '#4a2a18');
  gg.addColorStop(1, '#1b0f08');
  ctx.fillStyle = gg;
  ctx.fillRect(-10, -10, 24, 20);
  ctx.strokeStyle = 'rgba(224,180,120,0.5)';
  ctx.setLineDash([2, 2.4]);
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(-8, -7 + i * 3.6);
    ctx.lineTo(12, -7 + i * 3.6 + 1);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.restore();
  riser();
  ctx.strokeStyle = 'rgba(0,0,0,0.75)';
  ctx.lineWidth = 1.3;
  ctx.stroke();
  // brass inlay lines & gems
  ctx.strokeStyle = '#e6b84e';
  ctx.lineWidth = 1.6;
  ctx.lineCap = 'round';
  for (const d of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(1, d * 33);
    ctx.bezierCurveTo(5, d * 26, -1, d * 18, 3, d * 13);
    ctx.stroke();
    ctx.fillStyle = '#e6b84e';
    ctx.beginPath();
    ctx.moveTo(3, d * 13 - 3);
    ctx.lineTo(6, d * 13);
    ctx.lineTo(3, d * 13 + 3);
    ctx.lineTo(0, d * 13);
    ctx.closePath();
    ctx.fill();
    emissive(ctx, 5, d * 24, 6 + ch * 7, '#6ee7b7', 0.55 + ch * 0.4);
    ctx.fillStyle = '#d1fae5';
    ctx.beginPath();
    ctx.arc(5, d * 24, 1.7, 0, TAU);
    ctx.fill();
  }
  // arrow shelf + rest
  rect(ctx, 8, -3.6, 12, 3.4, 1, T.brass, { lw: 0.8 });
  // sight bracket with fibre-optic pin
  rect(ctx, 12, -30, 14, 3.4, 1.4, T.black, { lw: 0.8 });
  rect(ctx, 22, -33, 3.2, 8, 1.2, T.black, { lw: 0.8 });
  emissive(ctx, 24, -27, 6, '#4ade80', 0.9);
  // stabiliser
  rect(ctx, 12, 18, 54, 3.6, 1.8, T.black, { lw: 0.8 });
  rect(ctx, 60, 14, 14, 11, 4, T.brass, { lw: 0.9 });
  ctx.strokeStyle = 'rgba(0,0,0,0.5)';
  ctx.lineWidth = 0.9;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(63 + i * 4, 14);
    ctx.lineTo(63 + i * 4, 25);
    ctx.stroke();
  }

  /* arrow on the string / shelf */
  if (showArrow) {
    ctx.save();
    ctx.globalAlpha = aAlpha;
    ctx.translate(nockX + slide, -3.2);
    arrowArt(ctx, 112, ch > 0.85 ? (ch - 0.85) / 0.15 * (0.7 + 0.3 * Math.sin(s.t * 12)) : 0, s.t);
    ctx.restore();
  }

  /* string with red serving + silencers */
  const sPts = [
    [tipX, -tipY],
    [nockX, 0],
    [tipX, tipY],
  ];
  ctx.lineJoin = 'round';
  ctx.beginPath();
  sPts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
  ctx.strokeStyle = 'rgba(0,0,0,0.5)';
  ctx.lineWidth = 2.8;
  ctx.stroke();
  ctx.strokeStyle = '#f1f5f9';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  // serving around the nocking point
  for (const d of [-1, 1]) {
    const dx = tipX - nockX,
      dy = d * tipY;
    const l = Math.hypot(dx, dy);
    ctx.strokeStyle = '#b91c1c';
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.moveTo(nockX, 0);
    ctx.lineTo(nockX + (dx / l) * 16, (dy / l) * 16);
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.moveTo(nockX, 0);
  ctx.lineTo(nockX + 1, 0);
  ctx.stroke();
  for (const d of [-1, 1]) {
    const px = lerp(tipX, nockX, 0.3),
      py = d * lerp(tipY, 0, 0.3);
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(px, py, 3.2, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 0.6;
    ctx.stroke();
  }
  ctx.restore();
}

/* ======================================================================== */

export const bow: Weapon = {
  id: 'bow',
  name: 'Longbow Recurve',
  tag: 'LAMINATED RECURVE · CHARGE',
  accent: '#6ee7b7',
  accent2: '#c8a165',
  mode: 'projectile',
  cooldown: 0.28,
  charged: true,
  recoilAmt: 15,
  muzzle: [58, -4],
  markSize: 26,
  draw: drawBow,
  fire(api, x, y, a, charge) {
    const power = lerp(1400, 3200, charge);
    audio.play('bow');
    api.flash('#9af5c8', 0.12 + charge * 0.14);
    api.shake(7 + charge * 9);
    api.bullets.push(
      makeBullet({
        x,
        y,
        a,
        speed: power,
        weapon: bow,
        kind: 'arrow',
        size: 10,
        trailMax: 12,
        data: { charge },
        update(b, dt, g) {
          b.data.acc = (b.data.acc ?? 0) + dt;
          if (b.data.acc > 0.028) {
            b.data.acc = 0;
            // pressure ring bow-wave, wind streaks
            g.particles.push(
              P({ type: 'shock', x: b.x - Math.cos(b.angle) * 30, y: b.y - Math.sin(b.angle) * 30, rot: b.angle + Math.PI / 2, size: 22 + charge * 10, size2: 4, color: '#d7fbe8', width: 1.4, life: 0.22 })
            );
            for (const d of [-1, 1])
              g.particles.push(
                P({
                  type: 'streak',
                  x: b.x - Math.cos(b.angle) * 50 + Math.cos(b.angle + Math.PI / 2) * d * rnd(8, 16),
                  y: b.y - Math.sin(b.angle) * 50 + Math.sin(b.angle + Math.PI / 2) * d * rnd(8, 16),
                  rot: b.angle,
                  size: rnd(30, 70),
                  width: 1.4,
                  color: '#c8f3dc',
                  life: 0.2,
                })
              );
          }
          if (charge > 0.8 && Math.random() < 0.6)
            g.particles.push(
              P({ type: 'ember', x: b.x - Math.cos(b.angle) * rnd(0, 40), y: b.y - Math.sin(b.angle) * rnd(0, 40), vx: rnd(-30, 30), vy: rnd(-30, 30), size: rnd(1.4, 2.6), color: '#d9ffe9', color2: '#34d399', life: rnd(0.3, 0.7) })
            );
        },
        draw(ctx, b, t) {
          // faint glowing wake
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          ctx.translate(b.x, b.y);
          ctx.rotate(b.angle);
          const wg = ctx.createLinearGradient(-130, 0, 8, 0);
          wg.addColorStop(0, 'rgba(160,255,210,0)');
          wg.addColorStop(1, `rgba(160,255,210,${0.22 + charge * 0.3})`);
          ctx.fillStyle = wg;
          ctx.fillRect(-130, -2.4 - charge * 2, 138, 4.8 + charge * 4);
          ctx.restore();
          ctx.save();
          ctx.translate(b.x, b.y);
          ctx.rotate(b.angle);
          // slight roll shimmer of the vanes
          ctx.scale(1, 1 + Math.sin(t * 90) * 0.04);
          ctx.translate(-112, 0);
          arrowArt(ctx, 112, charge > 0.8 ? (charge - 0.8) * 4 : 0, t);
          ctx.restore();
        },
      })
    );
    // release: string snap + a puff of energy
    for (let i = 0; i < 9; i++) {
      const an = a + rnd(-1.1, 1.1);
      api.particles.push(P({ type: 'spark', x, y, vx: Math.cos(an) * rnd(60, 300), vy: Math.sin(an) * rnd(60, 300), color: '#d7fbe8', life: rnd(0.1, 0.28), width: 1.2 }));
    }
    shockRing(api, x, y, 44, '#9af5c8', 2.2, 0.24);
    api.particles.push(P({ type: 'flare', x, y, rot: a, size: 60 + charge * 40, size2: 4, width: 0.6, color: '#bbf7d0', life: 0.1 }));
  },
  onImpact(api, x, y, a) {
    audio.play('hit');
    impactFlash(api, x, y, 48, '#e8fff2', '#34d399', 0.12);
    dust(api, x, y, a, 9, 1.2);
    splinters(api, x, y, a, 18, 1.3);
    sparkFan(api, x, y, a + Math.PI, 14, { spread: 1.2, colors: ['#d7fbe8', '#ffffff', '#6ee7b7'], max: 680 });
    for (let i = 0; i < 4; i++) shockRing(api, x, y, 36 + i * 24, '#d7fbe8', 2.4, 0.26 + i * 0.1);
    api.shake(15);
    api.hitstop(0.065);
  },
  drawMark(ctx, m) {
    // arrow quivering in the wood
    const wob = Math.exp(-m.age * 3.6) * Math.sin(m.age * 40) * 0.13;
    holeMark(ctx, 6.5, m.seed, 12);
    crackStar(ctx, m.seed, 5, 11);
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#000';
    ctx.rotate(wob);
    ctx.fillRect(0, 2.4, 62, 3);
    ctx.restore();
    ctx.save();
    ctx.rotate(wob);
    // arrowArt draws nock->tip along +x; we want tip at the wheel (x=-4) and nock outward (+x)
    ctx.translate(58, 0);
    ctx.scale(-1, 1);
    arrowArt(ctx, 62, 0, 0);
    ctx.restore();
  },
};

