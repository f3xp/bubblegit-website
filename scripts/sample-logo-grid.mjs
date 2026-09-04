// Samples src/assets/bubblegit.png into the bead grid used by
// src/components/BubbleLogo.astro. Prints the grid; paste it into GRID there.
//
//   node scripts/sample-logo-grid.mjs
//
// "." empty, "#" rim, "W" specular highlight, digits = shade steps (light -> dark).
import sharp from "sharp";

const SRC = "src/assets/bubblegit.png";
const PITCH = 8.93; // bead pitch in source pixels
const X0 = 8; // centre of the first bead
const Y0 = 9;
const COLS = 44;
const ROWS = 42;
const LEVELS = 6;
const BLUR_PASSES = 2;

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;

// average a bead's cell over its opaque pixels
const cell = (cx, cy) => {
	let r = 0;
	let g = 0;
	let b = 0;
	let n = 0;
	let total = 0;
	for (let y = Math.round(cy - PITCH / 2); y <= Math.round(cy + PITCH / 2); y++) {
		for (let x = Math.round(cx - PITCH / 2); x <= Math.round(cx + PITCH / 2); x++) {
			total++;
			if (x < 0 || y < 0 || x >= width || y >= height) continue;
			const i = (y * width + x) * 4;
			if (data[i + 3] <= 140) continue;
			r += data[i];
			g += data[i + 1];
			b += data[i + 2];
			n++;
		}
	}
	return n ? { r: r / n, g: g / n, b: b / n, cov: n / total } : null;
};

const kind = [];
const lum = [];
for (let row = 0; row < ROWS; row++) {
	kind.push([]);
	lum.push([]);
	for (let col = 0; col < COLS; col++) {
		const v = cell(X0 + col * PITCH, Y0 + row * PITCH);
		if (!v || v.cov < 0.22) {
			kind[row].push(".");
			lum[row].push(null);
			continue;
		}
		const l = (v.r + v.g + v.b) / 3;
		const sat = Math.max(v.r, v.g, v.b) - Math.min(v.r, v.g, v.b);
		if (l < 110) {
			kind[row].push("#");
			lum[row].push(null);
		} else if (sat < 28 && l > 200) {
			kind[row].push("W");
			lum[row].push(null);
		} else {
			kind[row].push("p");
			lum[row].push(l);
		}
	}
}

// smooth the shading so quantising doesn't speckle
const smooth = lum.map((r) => r.slice());
for (let pass = 0; pass < BLUR_PASSES; pass++) {
	const src = smooth.map((r) => r.slice());
	for (let row = 0; row < ROWS; row++) {
		for (let col = 0; col < COLS; col++) {
			if (kind[row][col] !== "p") continue;
			let sum = 0;
			let weight = 0;
			for (let dy = -2; dy <= 2; dy++) {
				for (let dx = -2; dx <= 2; dx++) {
					const v = src[row + dy]?.[col + dx];
					if (v == null) continue;
					const w = 1 / (1 + dx * dx + dy * dy);
					sum += v * w;
					weight += w;
				}
			}
			smooth[row][col] = sum / weight;
		}
	}
}

const sorted = smooth.flat().filter((v) => v != null).sort((a, b) => a - b);
const lo = sorted[Math.floor(sorted.length * 0.03)];
const hi = sorted[Math.floor(sorted.length * 0.97)];

console.log(
	kind
		.map((row, r) =>
			row
				.map((k, c) => {
					if (k !== "p") return k;
					const t = (smooth[r][c] - lo) / (hi - lo);
					const step = Math.round((1 - t) * (LEVELS - 1));
					return String(Math.max(0, Math.min(LEVELS - 1, step)));
				})
				.join(""),
		)
		.join("\n"),
);
