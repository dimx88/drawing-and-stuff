class ColorCycler {
	constructor(h,s,l, h_rate, s_rate, l_rate) {
		this.initial_h = h;
		this.initial_s = s;
		this.initial_l = l;
		this.h = h;
		this.h_rate = h_rate;
		this.s = s;
		this.s_rate = s_rate;
		this.l = l;
		this.l_rate = l_rate;
		this.color = 'null';
	}
	
	getNextColor() {
		this.color = 'hsl(' + this.h +', ' + this.s +'%, ' + this.l + '%)';
		this.h += this.h_rate;
		this.setSaturation(this.s + this.s_rate);
		this.setLightness(this.l + this.l_rate);
		if (this.h < 1) {
			this.h = 360 - Math.abs(this.h);
		}else if (this.h > 360) {
			this.h = this.h - 360;
		}
		this.color = 'hsl(' + this.h +', ' + this.s +'%, ' + this.l + '%)';
		let rgb = this.hslToHex(this.h,this.s,this.l);
		return rgb;
		
	}
	setSaturation(saturation) {
		this.s = saturation > 100 ? 100 : saturation;
	}
	setLightness(lightness) {
		this.l = lightness > 100 ? 100 : lightness;
	}
	reset() {
		this.h = this.initial_h;
		this.s = this.initial_s;
		this.l = this.initial_l;
	}
	
	
	hslToHex(h, s, l) {
		  h /= 360;
		  s /= 100;
		  l /= 100;
		  let r, g, b;
		  if (s === 0) {
			r = g = b = l; // achromatic
		  } else {
			const hue2rgb = (p, q, t) => {
			  if (t < 0) t += 1;
			  if (t > 1) t -= 1;
			  if (t < 1 / 6) return p + (q - p) * 6 * t;
			  if (t < 1 / 2) return q;
			  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			  return p;
			};
			const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			const p = 2 * l - q;
			r = hue2rgb(p, q, h + 1 / 3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1 / 3);
		  }
		  const toHex = x => {
			const hex = Math.round(x * 255).toString(16);
			return hex.length === 1 ? '0' + hex : hex;
		  };
		  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
	
}