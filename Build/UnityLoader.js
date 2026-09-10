var UnityLoader = UnityLoader || {
  Compression: {
    identity: {
      require: function() { return {}; },
      decompress: function(e) { return e; }
    },
    gzip: {
      require: function(e) {
        var t = {
          "inflate.js": function(e, t, r) {
            "use strict";
            function n(e) {
              if (!(this instanceof n)) return new n(e);
              this.options = s.assign({ chunkSize: 16384, windowBits: 0, to: "" }, e || {});
              var t = this.options;
              t.raw && t.windowBits >= 0 && t.windowBits < 16 && (t.windowBits = -t.windowBits, 0 === t.windowBits && (t.windowBits = -15)),
              !(t.windowBits >= 0 && t.windowBits < 16) || (e && e.windowBits) || (t.windowBits += 32),
              t.windowBits > 15 && t.windowBits < 48 && 0 === (15 & t.windowBits) && (t.windowBits |= 15),
              this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new c, this.strm.avail_out = 0;
              var r = i.inflateInit2(this.strm, t.windowBits);
              if (r !== l.Z_OK) throw new Error(u[r]);
              this.header = new f, i.inflateGetHeader(this.strm, this.header);
            }
            function o(e, t) {
              var r = new n(t);
              if (r.push(e, !0), r.err) throw r.msg || u[r.err];
              return r.result;
            }
            function a(e, t) {
              return t = t || {}, t.raw = !0, o(e, t);
            }
            var i = e("./zlib/inflate"), s = e("./utils/common"), d = e("./utils/strings"), l = e("./zlib/constants"), u = e("./zlib/messages"), c = e("./zlib/zstream"), f = e("./zlib/gzheader"), h = Object.prototype.toString;
            n.prototype.push = function(e, t) {
              var r, n, o, a, u, c, f = this.strm, p = this.options.chunkSize, w = this.options.dictionary, m = !1;
              if (this.ended) return !1;
              n = t === ~~t ? t : t === !0 ? l.Z_FINISH : l.Z_NO_FLUSH,
              "string" == typeof e ? f.input = d.binstring2buf(e) : "[object ArrayBuffer]" === h.call(e) ? f.input = new Uint8Array(e) : f.input = e,
              f.next_in = 0, f.avail_in = f.input.length;
              do {
                if (0 === f.avail_out && (f.output = new s.Buf8(p), f.next_out = 0, f.avail_out = p), r = i.inflate(f, l.Z_NO_FLUSH), r === l.Z_NEED_DICT && w && (c = "string" == typeof w ? d.string2buf(w) : "[object ArrayBuffer]" === h.call(w) ? new Uint8Array(w) : w, r = i.inflateSetDictionary(this.strm, c)), r === l.Z_BUF_ERROR && m === !0 && (r = l.Z_OK, m = !1), r !== l.Z_STREAM_END && r !== l.Z_OK) return this.onEnd(r), this.ended = !0, !1;
                f.next_out && (0 !== f.avail_out && r !== l.Z_STREAM_END && (0 !== f.avail_in || n !== l.Z_FINISH && n !== l.Z_SYNC_FLUSH) || ("string" === this.options.to ? (o = d.utf8border(f.output, f.next_out), a = f.next_out - o, u = d.buf2string(f.output, o), f.next_out = a, f.avail_out = p - a, a && s.arraySet(f.output, f.output, o, a, 0), this.onData(u)) : this.onData(s.shrinkBuf(f.output, f.next_out)))), 0 === f.avail_in && 0 === f.avail_out && (m = !0);
              } while ((f.avail_in > 0 || 0 === f.avail_out) && r !== l.Z_STREAM_END);
              return r === l.Z_STREAM_END && (n = l.Z_FINISH), n === l.Z_FINISH ? (r = i.inflateEnd(this.strm), this.onEnd(r), this.ended = !0, r === l.Z_OK) : n !== l.Z_SYNC_FLUSH || (this.onEnd(l.Z_OK), f.avail_out = 0, !0);
            },
            n.prototype.onData = function(e) { this.chunks.push(e); },
            n.prototype.onEnd = function(e) { e === l.Z_OK && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = s.flattenChunks(this.chunks)), this.chunks = [], this.err = e, this.msg = this.strm.msg; },
            r.Inflate = n, r.inflate = o, r.inflateRaw = a, r.ungzip = o;
          },
          "utils/common.js": function(e, t, r) {
            "use strict";
            var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;
            r.assign = function(e) {
              for (var t = Array.prototype.slice.call(arguments, 1); t.length;) {
                var r = t.shift();
                if (r) {
                  if ("object" != typeof r) throw new TypeError(r + "must be non-object");
                  for (var n in r) r.hasOwnProperty(n) && (e[n] = r[n]);
                }
              }
              return e;
            },
            r.shrinkBuf = function(e, t) { return e.length === t ? e : e.subarray ? e.subarray(0, t) : (e.length = t, e); };
            var o = {
              arraySet: function(e, t, r, n, o) {
                if (t.subarray && e.subarray) return void e.set(t.subarray(r, r + n), o);
                for (var a = 0; a < n; a++) e[o + a] = t[r + a];
              },
              flattenChunks: function(e) {
                var t, r, n, o, a, i;
                for (n = 0, t = 0, r = e.length; t < r; t++) n += e[t].length;
                for (i = new Uint8Array(n), o = 0, t = 0, r = e.length; t < r; t++) a = e[t], i.set(a, o), o += a.length;
                return i;
              }
            },
            a = {
              arraySet: function(e, t, r, n, o) { for (var a = 0; a < n; a++) e[o + a] = t[r + a]; },
              flattenChunks: function(e) { return [].concat.apply([], e); }
            };
            r.setTyped = function(e) {
              e ? (r.Buf8 = Uint8Array, r.Buf16 = Uint16Array, r.Buf32 = Int32Array, r.assign(r, o)) : (r.Buf8 = Array, r.Buf16 = Array, r.Buf32 = Array, r.assign(r, a));
            },
            r.setTyped(n);
          },
          "utils/strings.js": function(e, t, r) {
            "use strict";
            function n(e, t) {
              if (t < 32768 && (e.subarray && i || !e.subarray && a)) return String.fromCharCode.apply(null, o.shrinkBuf(e, t));
              var str = "", chunk = 10000;
              for (var pos = 0; pos < t; pos += chunk) {
                var sub = e.subarray ? e.subarray(pos, Math.min(pos + chunk, t)) : e.slice(pos, Math.min(pos + chunk, t));
                str += String.fromCharCode.apply(null, sub);
              }
              return str;
            }
            var o = e("./common"), a = !0, i = !0;
            try { String.fromCharCode.apply(null, [0]); } catch (e) { a = !1; }
            try { String.fromCharCode.apply(null, new Uint8Array(1)); } catch (e) { i = !1; }
            for (var s = new o.Buf8(256), d = 0; d < 256; d++) s[d] = d >= 252 ? 6 : d >= 248 ? 5 : d >= 240 ? 4 : d >= 224 ? 3 : d >= 192 ? 2 : 1;
            s[254] = s[255] = 1,
            r.string2buf = function(e) {
              var t, r, n, a, i, s = e.length, d = 0;
              for (a = 0; a < s; a++) r = e.charCodeAt(a), 55296 === (64512 & r) && a + 1 < s && (n = e.charCodeAt(a + 1), 56320 === (64512 & n) && (r = 65536 + (r - 55296 << 10) + (n - 56320), a++)), d += r < 128 ? 1 : r < 2048 ? 2 : r < 65536 ? 3 : 4;
              for (t = new o.Buf8(d), i = 0, a = 0; i < d; a++) r = e.charCodeAt(a), 55296 === (64512 & r) && a + 1 < s && (n = e.charCodeAt(a + 1), 56320 === (64512 & n) && (r = 65536 + (r - 55296 << 10) + (n - 56320), a++)), r < 128 ? t[i++] = r : r < 2048 ? (t[i++] = 192 | r >>> 6, t[i++] = 128 | 63 & r) : r < 65536 ? (t[i++] = 224 | r >>> 12, t[i++] = 128 | r >>> 6 & 63, t[i++] = 128 | 63 & r) : (t[i++] = 240 | r >>> 18, t[i++] = 128 | r >>> 12 & 63, t[i++] = 128 | r >>> 6 & 63, t[i++] = 128 | 63 & r);
              return t;
            },
            r.buf2binstring = function(e) { return n(e, e.length); },
            r.binstring2buf = function(e) {
              for (var t = new o.Buf8(e.length), r = 0, n = t.length; r < n; r++) t[r] = e.charCodeAt(r);
              return t;
            },
            r.buf2string = function(e, t) {
              var r, o, a, i, d = t || e.length, l = new Array(2 * d);
              for (o = 0, r = 0; r < d;) if (a = e[r++], a < 128) l[o++] = a;
              else if (i = s[a], i > 4) l[o++] = 65533, r += i - 1;
              else {
                for (a &= 2 === i ? 31 : 3 === i ? 15 : 7; i > 1 && r < d;) a = a << 6 | 63 & e[r++], i--;
                i > 1 ? l[o++] = 65533 : a < 65536 ? l[o++] = a : (a -= 65536, l[o++] = 55296 | a >> 10 & 1023, l[o++] = 56320 | 1023 & a);
              }
              return n(l, o);
            },
            r.utf8border = function(e, t) {
              var r;
              for (t = t || e.length, t > e.length && (t = e.length), r = t - 1; r >= 0 && 128 === (192 & e[r]);) r--;
              return r < 0 ? t : 0 === r ? t : r + s[e[r]] > t ? r : t;
            };
          },
          "zlib/inflate.js": function(e, t, r) {
            "use strict";
            function n(e) { return (e >>> 24 & 255) + (e >>> 8 & 65280) + ((65280 & e) << 8) + ((255 & e) << 24); }
            function o() { this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new y.Buf16(320), this.work = new y.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0; }
            function a(e) { var t; return e && e.state ? (t = e.state, e.total_in = e.total_out = t.total = 0, e.msg = "", t.wrap && (e.adler = 1 & t.wrap), t.mode = P, t.last = 0, t.havedict = 0, t.dmax = 32768, t.head = null, t.hold = 0, t.bits = 0, t.lencode = t.lendyn = new y.Buf32(we), t.distcode = t.distdyn = new y.Buf32(me), t.sane = 1, t.back = -1, O) : R; }
            function i(e) { var t; return e && e.state ? (t = e.state, t.wsize = 0, t.whave = 0, t.wnext = 0, a(e)) : R; }
            function s(e, t) { var r, n; return e && e.state ? (n = e.state, t < 0 ? (r = 0, t = -t) : (r = (t >> 4) + 1, t < 48 && (t &= 15)), t && (t < 8 || t > 15) ? R : (null !== n.window && n.wbits !== t && (n.window = null), n.wrap = r, n.wbits = t, i(e))) : R; }
            function d(e, t) { var r, n; return e ? (n = new o, e.state = n, n.window = null, r = s(e, t), r !== O && (e.state = null), r) : R; }
            function l(e) { return d(e, ye); }
            function u(e) { if (ge) { var t; for (m = new y.Buf32(512), b = new y.Buf32(32), t = 0; t < 144;) e.lens[t++] = 8; for (; t < 256;) e.lens[t++] = 9; for (; t < 280;) e.lens[t++] = 7; for (; t < 288;) e.lens[t++] = 8; for (U(E, e.lens, 0, 288, m, 0, e.work, { bits: 9 }), t = 0; t < 32;) e.lens[t++] = 5; U(k, e.lens, 0, 32, b, 0, e.work, { bits: 5 }), ge = !1; } e.lencode = m, e.lenbits = 9, e.distcode = b, e.distbits = 5; }
            function c(e, t, r, n) { var o, a = e.state; return null === a.window && (a.wsize = 1 << a.wbits, a.wnext = 0, a.whave = 0, a.window = new y.Buf8(a.wsize)), n >= a.wsize ? (y.arraySet(a.window, t, r - a.wsize, a.wsize, 0), a.wnext = 0, a.whave = a.wsize) : (o = a.wsize - a.wnext, o > n && (o = n), y.arraySet(a.window, t, r - n, o, a.wnext), n -= o, n ? (y.arraySet(a.window, t, r - n, n, 0), a.wnext = n, a.whave = a.wsize) : (a.wnext += o, a.wnext === a.wsize && (a.wnext = 0), a.whave < a.wsize && (a.whave += o))), 0; }
            function f(e, t) { var r, o, a, i, s, d, l, f, h, p, w, m, b, we, me, be, ye, ge, ve, Ae, Ue, xe, Ee, ke, Be = 0, Le = new y.Buf8(4), We = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]; if (!e || !e.state || !e.output || !e.input && 0 !== e.avail_in) return R; r = e.state, r.mode === j && (r.mode = X), s = e.next_out, a = e.output, l = e.avail_out, i = e.next_in, o = e.input, d = e.avail_in, f = r.hold, h = r.bits, p = d, w = l, xe = O; e: for (;;) switch (r.mode) { case P: if (0 === r.wrap) { r.mode = X; break; } for (; h < 16;) { if (0 === d) break e; d--, f += o[i++] << h, h += 8; } if (2 & r.wrap && 35615 === f) { r.check = 0, Le[0] = 255 & f, Le[1] = f >>> 8 & 255, r.check = v(r.check, Le, 2, 0), f = 0, h = 0, r.mode = D; break; } if (r.flags = 0, r.head && (r.head.done = !1), !(1 & r.wrap) || (((255 & f) << 8) + (f >> 8)) % 31) { e.msg = "incorrect header check", r.mode = fe; break; } if ((15 & f) !== S) { e.msg = "unknown compression method", r.mode = fe; break; } if (f >>>= 4, h -= 4, Ue = (15 & f) + 8, 0 === r.wbits) r.wbits = Ue; else if (Ue > r.wbits) { e.msg = "invalid window size", r.mode = fe; break; } r.dmax = 1 << Ue, e.adler = r.check = 1, r.mode = 512 & f ? G : j, f = 0, h = 0; break; case D: for (; h < 16;) { if (0 === d) break e; d--, f += o[i++] << h, h += 8; } if (r.flags = f, (255 & r.flags) !== S) { e.msg = "unknown compression method", r.mode = fe; break; } if (57344 & r.flags) { e.msg = "unknown header flags set", r.mode = fe; break; } r.head && (r.head.text = f >> 8 & 1), 512 & r.flags && (Le[0] = 255 & f, Le[1] = f >>> 8 & 255, r.check = v(r.check, Le, 2, 0)), f = 0, h = 0, r.mode = T; case T: for (; h < 32;) { if (0 === d) break e; d--, f += o[i++] << h, h += 8; } r.head && (r.head.time = f), 512 & r.flags && (Le[0] = 255 & f, Le[1] = f >>> 8 & 255, Le[2] = f >>> 16 & 255, Le[3] = f >>> 24 & 255, r.check = v(r.check, Le, 4, 0)), f = 0, h = 0, r.mode = F; case F: for (; h < 16;) { if (0 === d) break e; d--, f += o[i++] << h, h += 8; } r.head && (r.head.xflags = 255 & f, r.head.os = f >> 8), 512 & r.flags && (Le[0] = 255 & f, Le[1] = f >>> 8 & 255, r.check = v(r.check, Le, 2, 0)), f = 0, h = 0, r.mode = q; case q: if (1024 & r.flags) { for (; h < 16;) { if (0 === d) break e; d--, f += o[i++] << h, h += 8; } r.length = f, r.head && (r.head.extra_len = f), 512 & r.flags && (Le[0] = 255 & f, Le[1] = f >>> 8 & 255, r.check = v(r.check, Le, 2, 0)), f = 0, h = 0; } else r.head && (r.head.extra = null); r.mode = V; case V: if (1024 & r.flags && (m = r.length, m > d && (m = d), m && (r.head && (Ue = r.head.extra_len - r.length, r.head.extra || (r.head.extra = new Array(r.head.extra_len)), y.arraySet(r.head.extra, o, i, m, Ue)), 512 & r.flags && (r.check = v(r.check, o, m, i)), d -= m, i += m, r.length -= m), r.length)) break e; r.length = 0, r.mode = z; case z: if (2048 & r.flags) { if (0 === d) break e; m = 0; do Ue = o[i + m++], r.head && Ue && r.length < 65536 && (r.head.name += String.fromCharCode(Ue)); while (Ue && m < d); if (512 & r.flags && (r.check = v(r.check, o, m, i)), d -= m, i += m, Ue) break e; } else r.head && (r.head.name = null); r.length = 0, r.mode = Z; case Z: if (4096 & r.flags) { if (0 === d) break e; m = 0; do Ue = o[i + m++], r.head && Ue && r.length < 65536 && (r.head.comment += String.fromCharCode(Ue)); while (Ue && m < d); if (512 & r.flags && (r.check = v(r.check, o, m, i)), d -= m, i += m, Ue) break e; } else r.head && (r.head.comment = null); r.mode = Y; case Y: if (512 & r.flags) { for (; h < 16;) { if (0 === d) break e; d--, f += o[i++] << h, h += 8; } if (f !== (65535 & r.check)) { e.msg = "header crc mismatch", r.mode = fe; break; } f = 0, h = 0; } r.head && (r.head.hcrc = r.flags >> 9 & 1, r.head.done = !0), e.adler = r.check = 0, r.mode = j; break; case G: for (; h < 32;) { if (0 === d) break e; d--, f += o[i++] << h, h += 8; } e.adler = r.check = n(f), f = 0, h = 0, r.mode = J; case J: if (0 === r.havedict) return e.next_out = s, e.avail_out = l, e.next_in = i, e.avail_in = d, r.hold = f, r.bits = h, N; e.adler = r.check = 1, r.mode = j; case j: if (t === L || t === W) break e; case X: if (r.last) { f >>>= 7 & h, h -= 7 & h, r.mode = le; break; } for (; h < 3;) { if (0 === d) break e; d--, f += o[i++] << h, h += 8; } switch (r.last = 1 & f, f >>>= 1, h -= 1, 3 & f) { case 0: r.mode = K; break; case 1: if (u(r), r.mode = re, t === W) { f >>>= 2, h -= 2; break e; } break; case 2: r.mode = $; break; case 3: e.msg = "invalid block type", r.mode = fe; } f >>>= 2, h -= 2; break; case K: for (f >>>= 7 & h, h -= 7 & h; h < 32;) { if (0 === d) break e; d--, f += o[i++] << h, h += 8; } if ((65535 & f) !== (f >>> 16 ^ 65535)) { e.msg = "invalid stored block lengths", r.mode = fe; break; } if (r.length = 65535 & f, f = 0, h = 0, r.mode = Q, t === W) break e; case Q: r.mode = _; case _: if (m = r.length) { if (m > d && (m = d), m > l && (m = l), 0 === m) break e; y.arraySet(a, o, i, m, s), d -= m, i += m, l -= m, s += m, r.length -= m; break; } r.mode = j; break; case $: for (; h < 14;) { if (0 === d) break e; d--, f += o[i++] << h, h += 8; } if (r.nlen = (31 & f) + 257, f >>>= 5, h -= 5, r.ndist = (31 & f) + 1, f >>>= 5, h -= 5, r.ncode = (15 & f) + 4, f >>>= 4, h -= 4, r.nlen > 286 || r.ndist > 30) { e.msg = "too many length or distance symbols", r.mode = fe; break; } r.have = 0, r.mode = ee; case ee: for (; r.have < r.ncode;) { for (; h < 3;) { if (0 === d) break e; d--, f += o[i++] << h, h += 8; } r.lens[We[r.have++]] = 7 & f, f >>>= 3, h -= 3; } for (; r.have < 19;) r.lens[We[r.have++]] = 0; if (r.lencode = r.lendyn, r.lenbits = 7, Ee = { bits: r.lenbits }, xe = U(x, r.lens, 0, 19, r.lencode, 0, r.work, Ee), r.lenbits = Ee.bits, xe) { e.msg = "invalid code lengths set", r.mode = fe; break; } r.have = 0, r.mode = te; case te: for (; r.have < r.nlen + r.ndist;) { for (; Be = r.lencode[f & (1 << r.lenbits) - 1], me = Be >>> 24, be = Be >>> 16 & 255, ye = 65535 & Be, !(me <= h);) { if (0 === d) break e; d--, f += o[i++] << h, h += 8; } if (ye < 16) f >>>= me, h -= me, r.lens[r.have++] = ye; else { if (16 === ye) { for (ke = me + 2; h < ke;) { if (0 === d) break e; d--, f += o[i++] << h, h += 8; } if (f >>>= me, h -= me, 0 === r.have) { e.msg = "invalid bit length repeat", r.mode = fe; break; } Ue = r.lens[r.have - 1], m = 3 + (3 & f), f >>>= 2, h -= 2; } else if (17 === ye) { for (ke = me + 3; h < ke;) { if (0 === d) break e; d--, f += o[i++] << h, h += 8; } f >>>= me, h -= me, Ue = 0, m = 3 + (7 & f), f >>>= 3, h -= 3; } else { for (ke = me + 7; h < ke;) { if (0 === d) break e; d--, f += o[i++] << h, h += 8; } f >>>= me, h -= me, Ue = 0, m = 11 + (127 & f), f >>>= 7, h -= 7; } if (r.have + m > r.nlen + r.ndist) { e.msg = "invalid bit length repeat", r.mode = fe; break; } for (; m--;) r.lens[r.have++] = Ue; } } if (r.mode === fe) break; if (0 === r.lens[256]) { e.msg = "invalid code -- missing end-of-block", r.mode = fe; break; } if (r.lenbits = 9, Ee = { bits: r.lenbits }, xe = U(E, r.lens, 0, r.nlen, r.lencode, 0, r.work, Ee), r.lenbits = Ee.bits, xe) { e.msg = "invalid literal/lengths set", r.mode = fe; break; } if (r.distbits = 6, r.distcode = r.distdyn, Ee = { bits: r.distbits }, xe = U(k, r.lens, r.nlen, r.ndist, r.distcode, 0, r.work, Ee), r.distbits = Ee.bits, xe) { e.msg = "invalid distances set", r.mode = fe; break; } if (r.mode = re, t === W) break e; case re: r.mode = ne; case ne: if (d >= 6 && l >= 258) { e.next_out = s, e.avail_out = l, e.next_in = i, e.avail_in = d, r.hold = f, r.bits = h, A(e, w), s = e.next_out, a = e.output, l = e.avail_out, i = e.next_in, o = e.input, d = e.avail_in, f = r.hold, h = r.bits, r.mode === j && (r.back = -1); break; } for (r.back = 0; Be = r.lencode[f & (1 << r.lenbits) - 1], me = Be >>> 24, be = Be >>> 16 & 255, ye = 65535 & Be, !(me <= h);) { if (0 === d) break e; d--, f += o[i++] << h, h += 8; } if (be && 0 === (240 & be)) { for (ge = me, ve = be, Ae = ye; Be = r.lencode[Ae + ((f & (1 << ge + ve) - 1) >> ge)], me = Be >>> 24, be = Be >>> 16 & 255, ye = 65535 & Be, !(ge + me <= h);) { if (0 === d) break e; d--, f += o[i++] << h, h += 8; } f >>>= ge, h -= ge, r.back += ge; } if (f >>>= me, h -= me, r.back += me, r.length = ye, 0 === be) { r.mode = de; break; } if (32 & be) { r.back = -1, r.mode = j; break; } if (64 & be) { e.msg = "invalid literal/length code", r.mode = fe; break; } r.extra = 15 & be, r.mode = oe; case oe: if (r.extra) { for (ke = r.extra; h < ke;) { if (0 === d) break e; d--, f += o[i++] << h, h += 8; } r.length += f & (1 << r.extra) - 1, f >>>= r.extra, h -= r.extra, r.back += r.extra; } r.was = r.length, r.mode = ae; case ae: for (; Be = r.distcode[f & (1 << r.distbits) - 1], me = Be >>> 24, be = Be >>> 16 & 255, ye = 65535 & Be, !(me <= h);) { if (0 === d) break e; d--, f += o[i++] << h, h += 8; } if (0 === (240 & be)) { for (ge = me, ve = be, Ae = ye; Be = r.distcode[Ae + ((f & (1 << ge + ve) - 1) >> ge)], me = Be >>> 24, be = Be >>> 16 & 255, ye = 65535 & Be, !(ge + me <= h);) { if (0 === d) break e; d--, f += o[i++] << h, h += 8; } f >>>= ge, h -= ge, r.back += ge; } if (f >>>= me, h -= me, r.back += me, 64 & be) { e.msg = "invalid distance code", r.mode = fe; break; } r.offset = ye, r.extra = 15 & be, r.mode = ie; case ie: if (r.extra) { for (ke = r.extra; h < ke;) { if (0 === d) break e; d--, f += o[i++] << h, h += 8; } r.offset += f & (1 << r.extra) - 1, f >>>= r.extra, h -= r.extra, r.back += r.extra; } if (r.offset > r.dmax) { e.msg = "invalid distance too far back", r.mode = fe; break; } r.mode = se; case se: if (0 === l) break e; if (m = w - l, r.offset > m) { if (m = r.offset - m, m > r.whave && r.sane) { e.msg = "invalid distance too far back", r.mode = fe; break; } m > r.wnext ? (m -= r.wnext, b = r.wsize - m) : b = r.wnext - m, m > r.length && (m = r.length), we = r.window; } else we = a, b = s - r.offset, m = r.length; m > l && (m = l), l -= m, r.length -= m; do a[s++] = we[b++]; while (--m); 0 === r.length && (r.mode = ne); break; case de: if (0 === l) break e; a[s++] = r.length, l--, r.mode = ne; break; case le: if (r.wrap) { for (; h < 32;) { if (0 === d) break e; d--, f |= o[i++] << h, h += 8; } if (w -= l, e.total_out += w, r.total += w, w && (e.adler = r.check = r.flags ? v(r.check, a, w, s - w) : g(r.check, a, w, s - w)), w = l, (r.flags ? f : n(f)) !== r.check) { e.msg = "incorrect data check", r.mode = fe; break; } f = 0, h = 0; } r.mode = ue; case ue: if (r.wrap && r.flags) { for (; h < 32;) { if (0 === d) break e; d--, f += o[i++] << h, h += 8; } if (f !== (4294967295 & r.total)) { e.msg = "incorrect length check", r.mode = fe; break; } f = 0, h = 0; } r.mode = ce; case ce: xe = M; break e; case fe: xe = C; break e; case he: return H; case pe: default: return R; } return e.next_out = s, e.avail_out = l, e.next_in = i, e.avail_in = d, r.hold = f, r.bits = h, (r.wsize || w !== e.avail_out && r.mode < fe && (r.mode < le || t !== B)) && c(e, e.output, e.next_out, w - e.avail_out) ? (r.mode = he, H) : (p -= e.avail_in, w -= e.avail_out, e.total_in += p, e.total_out += w, r.total += w, r.wrap && w && (e.adler = r.check = r.flags ? v(r.check, a, w, e.next_out - w) : g(r.check, a, w, e.next_out - w)), e.data_type = r.bits + (r.last ? 64 : 0) + (r.mode === j ? 128 : 0) + (r.mode === re || r.mode === Q ? 256 : 0), (0 === p && 0 === w || t === B) && xe === O && (xe = I), xe); }
            function h(e) { if (!e || !e.state) return R; var t = e.state; return t.window && (t.window = null), e.state = null, O; }
            function p(e, t) { var r; return e && e.state ? (r = e.state, 0 === (2 & r.wrap) ? R : (r.head = t, t.done = !1, O)) : R; }
            function w(e, t) { var r, n, o, a = t.length; return e && e.state ? (r = e.state, 0 !== r.wrap && r.mode !== J ? R : r.mode === J && (n = 1, n = g(n, t, a, 0), n !== r.check) ? C : (o = c(e, t, a, a)) ? (r.mode = he, H) : (r.havedict = 1, O)) : R; }
            var m, b, y = e("../utils/common"), g = e("./adler32"), v = e("./crc32"), A = e("./inffast"), U = e("./inftrees"), x = 0, E = 1, k = 2, B = 4, L = 5, W = 6, O = 0, M = 1, N = 2, R = -2, C = -3, H = -4, I = -5, S = 8, P = 1, D = 2, T = 3, F = 4, q = 5, V = 6, z = 7, Z = 8, Y = 9, G = 10, J = 11, j = 12, X = 13, K = 14, Q = 15, _ = 16, $ = 17, ee = 18, te = 19, re = 20, ne = 21, oe = 22, ae = 23, ie = 24, se = 25, de = 26, le = 27, ue = 28, ce = 29, fe = 30, he = 31, pe = 32, we = 852, me = 592, be = 15, ye = be, ge = !0;
            r.inflateReset = i, r.inflateReset2 = s, r.inflateResetKeep = a, r.inflateInit = l, r.inflateInit2 = d, r.inflate = f, r.inflateEnd = h, r.inflateGetHeader = p, r.inflateSetDictionary = w, r.inflateInfo = "pako inflate (from Nodeca project)";
          },
          "zlib/constants.js": function(e, t, r) {
            "use strict";
            t.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
          },
          "zlib/messages.js": function(e, t, r) {
            "use strict";
            t.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
          },
          "zlib/zstream.js": function(e, t, r) {
            "use strict";
            function n() { this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0; }
            t.exports = n;
          },
          "zlib/gzheader.js": function(e, t, r) {
            "use strict";
            function n() { this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1; }
            t.exports = n;
          },
          "zlib/adler32.js": function(e, t, r) {
            "use strict";
            function n(e, t, r, n) { for (var o = 65535 & e | 0, a = e >>> 16 & 65535 | 0, i = 0; 0 !== r;) { i = r > 2e3 ? 2e3 : r, r -= i; do o = o + t[n++] | 0, a = a + o | 0; while (--i); o %= 65521, a %= 65521; } return o | a << 16 | 0; }
            t.exports = n;
          },
          "zlib/crc32.js": function(e, t, r) {
            "use strict";
            function n() { for (var e, t = [], r = 0; r < 256; r++) { e = r; for (var n = 0; n < 8; n++) e = 1 & e ? 3988292384 ^ e >>> 1 : e >>> 1; t[r] = e; } return t; }
            function o(e, t, r, n) { var o = a, i = n + r; e ^= -1; for (var s = n; s < i; s++) e = e >>> 8 ^ o[255 & (e ^ t[s])]; return e ^ -1; }
            var a = n();
            t.exports = o;
          },
          "zlib/inffast.js": function(e, t, r) {
            "use strict";
            var n = 30, o = 12;
            t.exports = function(e, t) {
              var r, a, i, s, d, l, u, c, f, h, p, w, m, b, y, g, v, A, U, x, E, k, B, L, W;
              r = e.state, a = e.next_in, L = e.input, i = a + (e.avail_in - 5), s = e.next_out, W = e.output, d = s - (t - e.avail_out), l = s + (e.avail_out - 257), u = r.dmax, c = r.wsize, f = r.whave, h = r.wnext, p = r.window, w = r.hold, m = r.bits, b = r.lencode, y = r.distcode, g = (1 << r.lenbits) - 1, v = (1 << r.distbits) - 1;
              e: do {
                m < 15 && (w += L[a++] << m, m += 8, w += L[a++] << m, m += 8), A = b[w & g];
                t: for (;;) {
                  if (U = A >>> 24, w >>>= U, m -= U, U = A >>> 16 & 255, 0 === U) W[s++] = 65535 & A;
                  else {
                    if (!(16 & U)) {
                      if (0 === (64 & U)) { A = b[(65535 & A) + (w & (1 << U) - 1)]; continue t; }
                      if (32 & U) { r.mode = o; break e; }
                      e.msg = "invalid literal/length code", r.mode = n; break e;
                    }
                    x = 65535 & A, U &= 15, U && (m < U && (w += L[a++] << m, m += 8), x += w & (1 << U) - 1, w >>>= U, m -= U), m < 15 && (w += L[a++] << m, m += 8, w += L[a++] << m, m += 8), A = y[w & v];
                    r: for (;;) {
                      if (U = A >>> 24, w >>>= U, m -= U, U = A >>> 16 & 255, !(16 & U)) {
                        if (0 === (64 & U)) { A = y[(65535 & A) + (w & (1 << U) - 1)]; continue r; }
                        e.msg = "invalid distance code", r.mode = n; break e;
                      }
                      if (E = 65535 & A, U &= 15, m < U && (w += L[a++] << m, m += 8, m < U && (w += L[a++] << m, m += 8)), E += w & (1 << U) - 1, E > u) { e.msg = "invalid distance too far back", r.mode = n; break e; }
                      if (w >>>= U, m -= U, U = s - d, E > U) {
                        if (U = E - U, U > f && r.sane) { e.msg = "invalid distance too far back", r.mode = n; break e; }
                        if (k = 0, B = p, 0 === h) { if (k += c - U, U < x) { x -= U; do W[s++] = p[k++]; while (--U); k = s - E, B = W; } }
                        else if (h < U) { if (k += c + h - U, U -= h, U < x) { x -= U; do W[s++] = p[k++]; while (--U); if (k = 0, h < x) { U = h, x -= U; do W[s++] = p[k++]; while (--U); k = s - E, B = W; } } }
                        else if (k += h - U, U < x) { x -= U; do W[s++] = p[k++]; while (--U); k = s - E, B = W; }
                        for (; x > 2;) W[s++] = B[k++], W[s++] = B[k++], W[s++] = B[k++], x -= 3;
                        x && (W[s++] = B[k++], x > 1 && (W[s++] = B[k++]));
                      } else {
                        k = s - E;
                        do W[s++] = W[k++], W[s++] = W[k++], W[s++] = W[k++], x -= 3; while (x > 2);
                        x && (W[s++] = W[k++], x > 1 && (W[s++] = W[k++]));
                      }
                      break;
                    }
                    break;
                  }
                }
              } while (a < i && s < l);
              x = m >> 3, a -= x, m -= x << 3, w &= (1 << m) - 1, e.next_in = a, e.next_out = s, e.avail_in = a < i ? 5 + (i - a) : 5 - (a - i), e.avail_out = s < l ? 257 + (l - s) : 257 - (s - l), r.hold = w, r.bits = m;
            };
          },
          "zlib/inftrees.js": function(e, t, r) {
            "use strict";
            var n = e("../utils/common"), o = 15, a = 852, i = 592, s = 0, d = 1, l = 2,
                u = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0],
                c = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78],
                f = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0],
                h = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
            t.exports = function(e, t, r, p, w, m, b, y) {
              var g, v, A, U, x, E, k, B, L, W = y.bits, O = 0, M = 0, N = 0, R = 0, C = 0, H = 0, I = 0, S = 0, P = 0, D = 0, T = null, F = 0, q = new n.Buf16(o + 1), V = new n.Buf16(o + 1), z = null, Z = 0;
              for (O = 0; O <= o; O++) q[O] = 0;
              for (M = 0; M < p; M++) q[t[r + M]]++;
              for (C = W, R = o; R >= 1 && 0 === q[R]; R--);
              if (C > R && (C = R), 0 === R) return w[m++] = 20971520, w[m++] = 20971520, y.bits = 1, 0;
              for (N = 1; N < R && 0 === q[N]; N++);
              for (C < N && (C = N), S = 1, O = 1; O <= o; O++) if (S <<= 1, S -= q[O], S < 0) return -1;
              if (S > 0 && (e === s || 1 !== R)) return -1;
              for (V[1] = 0, O = 1; O < o; O++) V[O + 1] = V[O] + q[O];
              for (M = 0; M < p; M++) 0 !== t[r + M] && (b[V[t[r + M]]++] = M);
              if (e === s ? (T = z = b, E = 19) : e === d ? (T = u, F -= 257, z = c, Z -= 257, E = 256) : (T = f, z = h, E = -1), D = 0, M = 0, O = N, x = m, H = C, I = 0, A = -1, P = 1 << C, U = P - 1, e === d && P > a || e === l && P > i) return 1;
              for (;;) {
                k = O - I, b[M] < E ? (B = 0, L = b[M]) : b[M] > E ? (B = z[Z + b[M]], L = T[F + b[M]]) : (B = 96, L = 0), g = 1 << O - I, v = 1 << H, N = v;
                do v -= g, w[x + (D >> I) + v] = k << 24 | B << 16 | L | 0; while (0 !== v);
                for (g = 1 << O - 1; D & g;) g >>= 1;
                if (0 !== g ? (D &= g - 1, D += g) : D = 0, M++, 0 === --q[O]) { if (O === R) break; O = t[r + b[M]]; }
                if (O > C && (D & U) !== A) {
                  for (0 === I && (I = C), x += N, H = O - I, S = 1 << H; H + I < R && (S -= q[H + I], !(S <= 0));) H++, S <<= 1;
                  if (P += 1 << H, e === d && P > a || e === l && P > i) return 1;
                  A = D & U, w[A] = C << 24 | H << 16 | x - m | 0;
                }
              }
              return 0 !== D && (w[x + D] = O - I << 24 | 64 << 16 | 0), y.bits = C, 0;
            };
          }
        };
        for (var r in t) t[r].folder = r.substring(0, r.lastIndexOf("/") + 1);
        var n = function(e) {
          var r = [];
          return e = e.split("/").every(function(e) { return ".." == e ? r.pop() : "." == e || "" == e || r.push(e); }) ? r.join("/") : null, e ? t[e] || t[e + ".js"] || t[e + "/index.js"] : null;
        },
        o = function(e, t) { return e ? n(e.folder + "node_modules/" + t) || o(e.parent, t) : null; },
        a = function(e, t) {
          var r = t.match(/^\//) ? null : e ? t.match(/^\.\.?\//) ? n(e.folder + t) : o(e, t) : n(t);
          if (!r) throw "module not found: " + t;
          return r.exports || (r.parent = e, r(a.bind(null, r), r, r.exports = {})), r.exports;
        };
        return a(null, e);
      },
      decompress: function(e) {
        this.exports || (this.exports = this.require("inflate.js"));
        try { return this.exports.inflate(e); } catch (e) {}
      },
      hasUnityMarker: function(e) {
        var t = 10, r = "UnityWeb Compressed Content (gzip)";
        if (t > e.length || 31 != e[0] || 139 != e[1]) return !1;
        var n = e[3];
        if (4 & n) {
          if (t + 2 > e.length) return !1;
          if (t += 2 + e[t] + (e[t + 1] << 8), t > e.length) return !1;
        }
        if (8 & n) {
          for (; t < e.length && e[t];) t++;
          if (t + 1 > e.length) return !1;
          t++;
        }
        if (16 & n) {
          var sub = e.subarray(t, t + r.length + 1);
          var str = "";
          for (var i = 0; i < sub.length; i++) str += String.fromCharCode(sub[i]);
          return str == r + "\0";
        }
        return !1;
      }
    },
    brotli: {
      require: function(e) {
        var t = {
          "decompress.js": function(e, t, r) { t.exports = e("./dec/decode").BrotliDecompressBuffer; },
          "dec/bit_reader.js": function(e, t, r) {
            function n(e) { this.buf_ = new Uint8Array(a), this.input_ = e, this.reset(); }
            const o = 4096, a = 8224, i = 8191, s = new Uint32Array([0, 1, 3, 7, 15, 31, 63, 127, 255, 511, 1023, 2047, 4095, 8191, 16383, 32767, 65535, 131071, 262143, 524287, 1048575, 2097151, 4194303, 8388607, 16777215]);
            n.READ_SIZE = o, n.IBUF_MASK = i, n.prototype.reset = function() {
              this.buf_ptr_ = 0, this.val_ = 0, this.pos_ = 0, this.bit_pos_ = 0, this.bit_end_pos_ = 0, this.eos_ = 0, this.readMoreInput();
              for (var e = 0; e < 4; e++) this.val_ |= this.buf_[this.pos_] << 8 * e, ++this.pos_;
              return this.bit_end_pos_ > 0;
            }, n.prototype.readMoreInput = function() {
              if (!(this.bit_end_pos_ > 256)) if (this.eos_) {
                if (this.bit_pos_ > this.bit_end_pos_) throw new Error("Unexpected end of input " + this.bit_pos_ + " " + this.bit_end_pos_);
              } else {
                var e = this.buf_ptr_, t = this.input_.read(this.buf_, e, o);
                if (t < 0) throw new Error("Unexpected end of input");
                if (t < o) { this.eos_ = 1; for (var r = 0; r < 32; r++) this.buf_[e + t + r] = 0; }
                if (0 === e) { for (var r = 0; r < 32; r++) this.buf_[8192 + r] = this.buf_[r]; this.buf_ptr_ = o; }
                else this.buf_ptr_ = 0;
                this.bit_end_pos_ += t << 3;
              }
            }, n.prototype.fillBitWindow = function() {
              for (; this.bit_pos_ >= 8;) this.val_ >>>= 8, this.val_ |= this.buf_[this.pos_ & i] << 24, ++this.pos_, this.bit_pos_ = this.bit_pos_ - 8 >>> 0, this.bit_end_pos_ = this.bit_end_pos_ - 8 >>> 0;
            }, n.prototype.readBits = function(e) {
              32 - this.bit_pos_ < e && this.fillBitWindow();
              var t = this.val_ >>> this.bit_pos_ & s[e];
              return this.bit_pos_ += e, t;
            }, t.exports = n;
          },
          "dec/context.js": function(e, t, r) {
            r.lookup = new Uint8Array([0,0,0,0,0,0,0,0,0,4,4,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,12,16,12,12,20,12,16,24,28,12,12,32,12,36,12,44,44,44,44,44,44,44,44,44,44,32,32,24,40,28,12,12,48,52,52,52,48,52,52,52,48,52,52,52,52,52,48,52,52,52,52,52,48,52,52,52,52,52,24,12,28,12,12,12,56,60,60,60,56,60,60,60,56,60,60,60,60,60,56,60,60,60,60,60,56,60,60,60,60,60,24,12,28,12,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,56,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,7,7,7,7,8,8,8,8,9,9,9,9,10,10,10,10,11,11,11,11,12,12,12,12,13,13,13,13,14,14,14,14,15,15,15,15,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,22,22,22,22,23,23,23,23,24,24,24,24,25,25,25,25,26,26,26,26,27,27,27,27,28,28,28,28,29,29,29,29,30,30,30,30,31,31,31,31,32,32,32,32,33,33,33,33,34,34,34,34,35,35,35,35,36,36,36,36,37,37,37,37,38,38,38,38,39,39,39,39,40,40,40,40,41,41,41,41,42,42,42,42,43,43,43,43,44,44,44,44,45,45,45,45,46,46,46,46,47,47,47,47,48,48,48,48,49,49,49,49,50,50,50,50,51,51,51,51,52,52,52,52,53,53,53,53,54,54,54,54,55,55,55,55,56,56,56,56,57,57,57,57,58,58,58,58,59,59,59,59,60,60,60,60,61,61,61,61,62,62,62,62,63,63,63,63,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),
            r.lookupOffsets = new Uint16Array([1024,1536,1280,1536,0,256,768,512]);
          },
          "dec/decode.js": function(e, t, r) {
            function n(e) { var t; return 0 === e.readBits(1) ? 16 : (t = e.readBits(3), t > 0 ? 17 + t : (t = e.readBits(3), t > 0 ? 8 + t : 17)); }
            function o(e) { if (e.readBits(1)) { var t = e.readBits(3); return 0 === t ? 1 : e.readBits(t) + (1 << t); } return 0; }
            function a() { this.meta_block_length = 0, this.input_end = 0, this.is_uncompressed = 0, this.is_metadata = !1; }
            function i(e) {
              var t, r, n, o = new a;
              if (o.input_end = e.readBits(1), o.input_end && e.readBits(1)) return o;
              if (t = e.readBits(2) + 4, 7 === t) {
                if (o.is_metadata = !0, 0 !== e.readBits(1)) throw new Error("Invalid reserved bit");
                if (r = e.readBits(2), 0 === r) return o;
                for (n = 0; n < r; n++) {
                  var i = e.readBits(8);
                  if (n + 1 === r && r > 1 && 0 === i) throw new Error("Invalid size byte");
                  o.meta_block_length |= i << 8 * n;
                }
              } else for (n = 0; n < t; ++n) {
                var s = e.readBits(4);
                if (n + 1 === t && t > 4 && 0 === s) throw new Error("Invalid size nibble");
                o.meta_block_length |= s << 4 * n;
              }
              return ++o.meta_block_length, o.input_end || o.is_metadata || (o.is_uncompressed = e.readBits(1)), o;
            }
            function s(e, t, r) { var n; return r.fillBitWindow(), t += r.val_ >>> r.bit_pos_ & T, n = e[t].bits - D, n > 0 && (r.bit_pos_ += D, t += e[t].value, t += r.val_ >>> r.bit_pos_ & (1 << n) - 1), r.bit_pos_ += e[t].bits, e[t].value; }
            function d(e, t, r, n) {
              for (var o = 0, a = N, i = 0, s = 0, d = 32768, l = [], u = 0; u < 32; u++) l.push(new B(0, 0));
              for (L(l, 0, 5, e, q); o < t && d > 0;) {
                var c, f = 0;
                if (n.readMoreInput(), n.fillBitWindow(), f += n.val_ >>> n.bit_pos_ & 31, n.bit_pos_ += l[f].bits, c = 255 & l[f].value, c < R) i = 0, r[o++] = c, 0 !== c && (a = c, d -= 32768 >> c);
                else {
                  var h, p, w = c - 14, m = 0;
                  if (c === R && (m = a), s !== m && (i = 0, s = m), h = i, i > 0 && (i -= 2, i <<= w), i += n.readBits(w) + 3, p = i - h, o + p > t) throw new Error("[ReadHuffmanCodeLengths] symbol + repeat_delta > num_symbols");
                  for (var b = 0; b < p; b++) r[o + b] = s;
                  o += p, 0 !== s && (d -= p << 15 - s);
                }
              }
              if (0 !== d) throw new Error("[ReadHuffmanCodeLengths] space = " + d);
              for (; o < t; o++) r[o] = 0;
            }
            function l(e, t, r, n) {
              var o, a = 0, i = new Uint8Array(e);
              if (n.readMoreInput(), o = n.readBits(2), 1 === o) {
                for (var s, l = e - 1, u = 0, c = new Int32Array(4), f = n.readBits(2) + 1; l;) l >>= 1, ++u;
                for (s = 0; s < f; ++s) c[s] = n.readBits(u) % e, i[c[s]] = 2;
                switch (i[c[0]] = 1, f) {
                  case 1: break;
                  case 3: if (c[0] === c[1] || c[0] === c[2] || c[1] === c[2]) throw new Error("[ReadHuffmanCode] invalid symbols"); break;
                  case 2: if (c[0] === c[1]) throw new Error("[ReadHuffmanCode] invalid symbols"); i[c[1]] = 1; break;
                  case 4: if (c[0] === c[1] || c[0] === c[2] || c[0] === c[3] || c[1] === c[2] || c[1] === c[3] || c[2] === c[3]) throw new Error("[ReadHuffmanCode] invalid symbols"); n.readBits(1) ? (i[c[2]] = 3, i[c[3]] = 3) : i[c[0]] = 2;
                }
              } else {
                var s, h = new Uint8Array(q), p = 32, w = 0, m = [new B(2, 0), new B(2, 4), new B(2, 3), new B(3, 2), new B(2, 0), new B(2, 4), new B(2, 3), new B(4, 1), new B(2, 0), new B(2, 4), new B(2, 3), new B(3, 2), new B(2, 0), new B(2, 4), new B(2, 3), new B(4, 5)];
                for (s = o; s < q && p > 0; ++s) {
                  var b, y = V[s], g = 0;
                  n.fillBitWindow(), g += n.val_ >>> n.bit_pos_ & 15, n.bit_pos_ += m[g].bits, b = m[g].value, h[y] = b, 0 !== b && (p -= 32 >> b, ++w);
                }
                if (1 !== w && 0 !== p) throw new Error("[ReadHuffmanCode] invalid num_codes or space");
                d(h, e, i, n);
              }
              if (a = L(t, r, D, i, e), 0 === a) throw new Error("[ReadHuffmanCode] BuildHuffmanTable failed: ");
              return a;
            }
            function u(e, t, r) { var n, o; return n = s(e, t, r), o = O.kBlockLengthPrefixCode[n].nbits, O.kBlockLengthPrefixCode[n].offset + r.readBits(o); }
            function c(e, t, r) { var n; return e < z ? (r += Z[e], r &= 3, n = t[r] + Y[e]) : n = e - z + 1, n; }
            function f(e, t) { for (var r = e[t], n = t; n; --n) e[n] = e[n - 1]; e[0] = r; }
            function h(e, t) { var r, n = new Uint8Array(256); for (r = 0; r < 256; ++r) n[r] = r; for (r = 0; r < t; ++r) { var o = e[r]; e[r] = n[o], o && f(n, o); } }
            function p(e, t) { this.alphabet_size = e, this.num_htrees = t, this.codes = new Array(t + t * G[e + 31 >>> 5]), this.htrees = new Uint32Array(t); }
            function w(e, t) {
              var r, n, a, i = { num_htrees: null, context_map: null }, d = 0;
              t.readMoreInput();
              var u = i.num_htrees = o(t) + 1, c = i.context_map = new Uint8Array(e);
              if (u <= 1) return i;
              for (r = t.readBits(1), r && (d = t.readBits(4) + 1), n = [], a = 0; a < F; a++) n[a] = new B(0, 0);
              for (l(u + d, n, 0, t), a = 0; a < e;) {
                var f;
                if (t.readMoreInput(), f = s(n, 0, t), 0 === f) c[a] = 0, ++a;
                else if (f <= d) for (var p = 1 + (1 << f) + t.readBits(f); --p;) {
                  if (a >= e) throw new Error("[DecodeContextMap] i >= context_map_size");
                  c[a] = 0, ++a;
                } else c[a] = f - d, ++a;
              }
              return t.readBits(1) && h(c, e), i;
            }
            function m(e, t, r, n, o, a, i) { var d, l = 2 * r, u = r, c = s(t, r * F, i); d = 0 === c ? o[l + (1 & a[u])] : 1 === c ? o[l + (a[u] - 1 & 1)] + 1 : c - 2, d >= e && (d -= e), n[r] = d, o[l + (1 & a[u])] = d, ++a[u]; }
            function b(e, t, r, n, o, a) {
              var i, s = o + 1, d = r & o, l = a.pos_ & E.IBUF_MASK;
              if (t < 8 || a.bit_pos_ + (t << 3) < a.bit_end_pos_) for (; t-- > 0;) a.readMoreInput(), n[d++] = a.readBits(8), d === s && (e.write(n, s), d = 0);
              else {
                if (a.bit_end_pos_ < 32) throw new Error("[CopyUncompressedBlockToOutput] br.bit_end_pos_ < 32");
                for (; a.bit_pos_ < 32;) n[d] = a.val_ >>> a.bit_pos_, a.bit_pos_ += 8, ++d, --t;
                if (i = a.bit_end_pos_ - a.bit_pos_ >> 3, l + i > E.IBUF_MASK) {
                  for (var u = E.IBUF_MASK + 1 - l, c = 0; c < u; c++) n[d + c] = a.buf_[l + c];
                  i -= u, d += u, t -= u, l = 0;
                }
                for (var c = 0; c < i; c++) n[d + c] = a.buf_[l + c];
                if (d += i, t -= i, d >= s) { e.write(n, s), d -= s; for (var c = 0; c < d; c++) n[c] = n[s + c]; }
                for (; d + t >= s;) {
                  if (i = s - d, a.input_.read(n, d, i) < i) throw new Error("[CopyUncompressedBlockToOutput] not enough bytes");
                  e.write(n, s), t -= i, d = 0;
                }
                if (a.input_.read(n, d, t) < t) throw new Error("[CopyUncompressedBlockToOutput] not enough bytes");
                a.reset();
              }
            }
            function y(e) { var t = e.bit_pos_ + 7 & -8, r = e.readBits(t - e.bit_pos_); return 0 == r; }
            function g(e) { var t = new U(e), r = new E(t); n(r); var o = i(r); return o.meta_block_length; }
            function v(e, t) { var r = new U(e); null == t && (t = g(e)); var n = new Uint8Array(t), o = new x(n); return A(r, o), o.pos < o.buffer.length && (o.buffer = o.buffer.subarray(0, o.pos)), o.buffer; }
            function A(e, t) {
              var r, a, d, f, h, g, v, A, U, x = 0, L = 0, N = 0, R = 0, D = [16, 15, 11, 4], T = 0, q = 0, V = 0, Z = [new p(0, 0), new p(0, 0), new p(0, 0)];
              const Y = 128 + E.READ_SIZE;
              U = new E(e), N = n(U), a = (1 << N) - 16, d = 1 << N, f = d - 1, h = new Uint8Array(d + Y + k.maxDictionaryWordLength), g = d, v = [], A = [];
              for (var G = 0; G < 3240; G++) v[G] = new B(0, 0), A[G] = new B(0, 0);
              for (; !L;) {
                var J, j, X, K, Q, _, $, ee, te, re = 0, ne = [1 << 28, 1 << 28, 1 << 28], oe = [0], ae = [1, 1, 1], ie = [0, 1, 0, 1, 0, 1], se = [0], de = null, le = null, ue = null, ce = 0, fe = null, he = 0, pe = 0, we = null, me = 0, be = 0, ye = 0;
                for (r = 0; r < 3; ++r) Z[r].codes = null, Z[r].htrees = null;
                U.readMoreInput();
                var ge = i(U);
                if (re = ge.meta_block_length, x + re > t.buffer.length) { var ve = new Uint8Array(x + re); ve.set(t.buffer), t.buffer = ve; }
                if (L = ge.input_end, J = ge.is_uncompressed, ge.is_metadata) for (y(U); re > 0; --re) U.readMoreInput(), U.readBits(8);
                else if (0 !== re) if (J) U.bit_pos_ = U.bit_pos_ + 7 & -8, b(t, re, x, h, f, U), x += re;
                else {
                  for (r = 0; r < 3; ++r) ae[r] = o(U) + 1, ae[r] >= 2 && (l(ae[r] + 2, v, r * F, U), l(I, A, r * F, U), ne[r] = u(A, r * F, U), se[r] = 1);
                  for (U.readMoreInput(), j = U.readBits(2), X = z + (U.readBits(4) << j), K = (1 << j) - 1, Q = X + (48 << j), le = new Uint8Array(ae[0]), r = 0; r < ae[0]; ++r) U.readMoreInput(), le[r] = U.readBits(2) << 1;
                  var Ae = w(ae[0] << S, U);
                  _ = Ae.num_htrees, de = Ae.context_map;
                  var Ue = w(ae[2] << P, U);
                  for ($ = Ue.num_htrees, ue = Ue.context_map, Z[0] = new p(C, _), Z[1] = new p(H, ae[1]), Z[2] = new p(Q, $), r = 0; r < 3; ++r) Z[r].decode(U);
                  for (fe = 0, we = 0, ee = le[oe[0]], be = W.lookupOffsets[ee], ye = W.lookupOffsets[ee + 1], te = Z[1].htrees[0]; re > 0;) {
                    var xe, Ee, ke, Be, Le, We, Oe, Me, Ne, Re, Ce;
                    for (U.readMoreInput(), 0 === ne[1] && (m(ae[1], v, 1, oe, ie, se, U), ne[1] = u(A, F, U), te = Z[1].htrees[oe[1]]), --ne[1], xe = s(Z[1].codes, te, U), Ee = xe >> 6, Ee >= 2 ? (Ee -= 2, Oe = -1) : Oe = 0, ke = O.kInsertRangeLut[Ee] + (xe >> 3 & 7), Be = O.kCopyRangeLut[Ee] + (7 & xe), Le = O.kInsertLengthPrefixCode[ke].offset + U.readBits(O.kInsertLengthPrefixCode[ke].nbits), We = O.kCopyLengthPrefixCode[Be].offset + U.readBits(O.kCopyLengthPrefixCode[Be].nbits), q = h[x - 1 & f], V = h[x - 2 & f], Re = 0; Re < Le; ++Re) U.readMoreInput(), 0 === ne[0] && (m(ae[0], v, 0, oe, ie, se, U), ne[0] = u(A, 0, U), ce = oe[0] << S, fe = ce, ee = le[oe[0]], be = W.lookupOffsets[ee], ye = W.lookupOffsets[ee + 1]), Ne = W.lookup[be + q] | W.lookup[ye + V], he = de[fe + Ne], --ne[0], V = q, q = s(Z[0].codes, Z[0].htrees[he], U), h[x & f] = q, (x & f) === f && t.write(h, d), ++x;
                    if (re -= Le, re <= 0) break;
                    if (Oe < 0) {
                      var Ne;
                      if (U.readMoreInput(), 0 === ne[2] && (m(ae[2], v, 2, oe, ie, se, U), ne[2] = u(A, 2160, U), pe = oe[2] << P, we = pe), --ne[2], Ne = 255 & (We > 4 ? 3 : We - 2), me = ue[we + Ne], Oe = s(Z[2].codes, Z[2].htrees[me], U), Oe >= X) {
                        var He, Ie, Se;
                        Oe -= X, Ie = Oe & K, Oe >>= j, He = (Oe >> 1) + 1, Se = (2 + (1 & Oe) << He) - 4, Oe = X + (Se + U.readBits(He) << j) + Ie;
                      }
                    }
                    if (Me = c(Oe, D, T), Me < 0) throw new Error("[BrotliDecompress] invalid distance");
                    if (R = x < a && R !== a ? x : a, Ce = x & f, Me > R) {
                      if (!(We >= k.minDictionaryWordLength && We <= k.maxDictionaryWordLength)) throw new Error("Invalid backward reference. pos: " + x + " distance: " + Me + " len: " + We + " bytes left: " + re);
                      var Se = k.offsetsByLength[We], Pe = Me - R - 1, De = k.sizeBitsByLength[We], Te = (1 << De) - 1, Fe = Pe & Te, qe = Pe >> De;
                      if (Se += Fe * We, !(qe < M.kNumTransforms)) throw new Error("Invalid backward reference. pos: " + x + " distance: " + Me + " len: " + We + " bytes left: " + re);
                      var Ve = M.transformDictionaryWord(h, Ce, Se, We, qe);
                      if (Ce += Ve, x += Ve, re -= Ve, Ce >= g) { t.write(h, d); for (var ze = 0; ze < Ce - g; ze++) h[ze] = h[g + ze]; }
                    } else {
                      if (Oe > 0 && (D[3 & T] = Me, ++T), We > re) throw new Error("Invalid backward reference. pos: " + x + " distance: " + Me + " len: " + We + " bytes left: " + re);
                      for (Re = 0; Re < We; ++Re) h[x & f] = h[x - Me & f], (x & f) === f && t.write(h, d), ++x, --re;
                    }
                    q = h[x - 1 & f], V = h[x - 2 & f];
                  }
                  x &= 1073741823;
                }
                t.write(h, x & f);
              }
            }
            var U = e("./streams").BrotliInput, x = e("./streams").BrotliOutput, E = e("./bit_reader"), k = e("./dictionary"), B = e("./huffman").HuffmanCode, L = e("./huffman").BrotliBuildHuffmanTable, W = e("./context"), O = e("./prefix"), M = e("./transform");
            const N = 8, R = 16, C = 256, H = 704, I = 26, S = 6, P = 2, D = 8, T = 255, F = 1080, q = 18, V = new Uint8Array([1, 2, 3, 4, 0, 5, 17, 6, 16, 7, 8, 9, 10, 11, 12, 13, 14, 15]), z = 16, Z = new Uint8Array([3, 2, 1, 0, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2]), Y = new Int8Array([0, 0, 0, 0, -1, 1, -2, 2, -3, 3, -1, 1, -2, 2, -3, 3]), G = new Uint16Array([256, 402, 436, 468, 500, 534, 566, 598, 630, 662, 694, 726, 758, 790, 822, 854, 886, 920, 952, 984, 1016, 1048, 1080]);
            p.prototype.decode = function(e) {
              var t, r, n = 0;
              for (t = 0; t < this.num_htrees; ++t) this.htrees[t] = n, r = l(this.alphabet_size, this.codes, n, e), n += r;
            }, r.BrotliDecompressedSize = g, r.BrotliDecompressBuffer = v, r.BrotliDecompress = A, k.init();
          },
          "dec/dictionary-browser.js": function(e, t, r) {
            t.exports = {
              init: function() {
                var b64 = e("./dictionary.bin");
                var str = typeof atob !== "undefined" ? atob(b64) : Buffer.from(b64, "base64").toString("binary");
                var buf = new Uint8Array(str.length);
                for (var i = 0; i < str.length; i++) buf[i] = str.charCodeAt(i);
                return buf;
              }
            };
          },
          "dec/dictionary.js": function(e, t, r) {
            var n = e("./dictionary-browser");
            r.init = function() { r.dictionary = n.init(); },
            r.offsetsByLength = new Uint32Array([0, 0, 0, 0, 0, 4096, 9216, 21504, 35840, 44032, 53248, 63488, 74752, 87040, 93696, 100864, 104704, 106752, 108928, 113536, 115968, 118528, 119872, 121280, 122016]),
            r.sizeBitsByLength = new Uint8Array([0, 0, 0, 0, 10, 10, 11, 11, 10, 10, 10, 10, 10, 9, 9, 8, 7, 7, 8, 7, 7, 6, 6, 5, 5]),
            r.minDictionaryWordLength = 4, r.maxDictionaryWordLength = 24;
          },
          "dec/dictionary.bin.js": function(e, t, r) {
            t.exports = "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";
          }
        };
        for (var r in t) t[r].folder = r.substring(0, r.lastIndexOf("/") + 1);
        var n = function(e) {
          var r = [];
          return e = e.split("/").every(function(e) { return ".." == e ? r.pop() : "." == e || "" == e || r.push(e); }) ? r.join("/") : null, e ? t[e] || t[e + ".js"] || t[e + "/index.js"] : null;
        },
        o = function(e, t) { return e ? n(e.folder + "node_modules/" + t) || o(e.parent, t) : null; },
        a = function(e, t) {
          var r = t.match(/^\//) ? null : e ? t.match(/^\.\.?\//) ? n(e.folder + t) : o(e, t) : n(t);
          if (!r) throw "module not found: " + t;
          return r.exports || (r.parent = e, r(a.bind(null, r), r, r.exports = {})), r.exports;
        };
        return a(null, e);
      },
      decompress: function(e) {
        this.exports || (this.exports = this.require("decompress.js"));
        try { return this.exports(e); } catch (e) {}
      },
      hasUnityMarker: function(e) {
        var t = 1, r = "UnityWeb Compressed Content (brotli)";
        if (t > e.length) return !1;
        var sub = e.subarray(t, t + r.length + 1);
        var str = "";
        for (var i = 0; i < sub.length; i++) str += String.fromCharCode(sub[i]);
        return str == r + "\0";
      }
    }
  }
};
