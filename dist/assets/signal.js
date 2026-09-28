import { t, getLocale, onLocaleChange } from './i18n.js';
// A procedural typographic surface; one full-screen draw, no external textures.
const canvas = document.querySelector('#signal-canvas');
const stage = document.querySelector('#signal-stage');
const energy = document.querySelector('#signal-energy');
const pause = document.querySelector('#signal-pause');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const modes = [...document.querySelectorAll('[data-signal-mode]')];
let gl = null;
try { gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power' }); } catch {}
let program, texture, buffer, shaders = [], uniforms = {}, frame = 0, last = 0, time = 0;
let visible = false, manualPause = false, mode = 0, intensity = .45;
let pointer = [.5, .5], target = [.5, .5], width = 0, height = 0;
const stopped = () => reduced.matches || manualPause || document.documentElement.classList.contains('motion-paused');
const vertexSource = 'attribute vec2 aPosition; varying vec2 vUV; void main(){vUV=(aPosition+1.)*.5;gl_Position=vec4(aPosition,0.,1.);}';
const fragmentSource = `
precision mediump float;
varying vec2 vUV;
uniform sampler2D uType;
uniform float uTime;
uniform float uEnergy;
uniform float uMode;
uniform vec2 uPointer;
uniform vec2 uResolution;
float mask(vec2 p) {
  if(p.x<0.||p.x>1.||p.y<0.||p.y>1.)return 0.;
  return texture2D(uType,p).a;
}
void main(){
  vec2 uv=vUV;
  float phase=uv.x*12.-uTime*.7;
  float field=sin(phase+uv.y*5.)*.5+sin(uv.y*13.+uTime*.45)*.24;
  float influence=exp(-distance(uv,uPointer)*4.);
  float amplitude=.035+uEnergy*.15;
  vec2 p=uv;
  p.y+=(field+influence*sin(uv.x*18.+uTime)*.65)*amplitude;
  p.x+=sin(uv.y*9.+uTime*.3)*amplitude*.15;
  p.y=(p.y-.5)*2.05+.5;
  float face=mask(p);
  float depth=(.035+uEnergy*.07)*(field+.85);
  float side=mask(p+vec2(-depth*.24,depth));
  vec3 ink=vec3(.065,.11,.075),paper=vec3(.947,.95,.885),orange=vec3(1.,.333,.196);
  float light=.83+.17*sin(phase+1.4);
  vec3 color=orange;
  if(uMode<.5){
    color=mix(color,ink,side*.98);
    color=mix(color,paper*light,face);
    float stripe=smoothstep(.28,.36,fract(p.y*62.));
    color=mix(color,color*.86,(1.-stripe)*side*(1.-face));
  }else if(uMode<1.5){
    float echo1=mask(p+vec2(.022,.18)),echo2=mask(p+vec2(-.022,-.18));
    color=mix(color,ink*.6+orange*.4,echo1*.8);
    color=mix(color,ink*.3+orange*.7,echo2*.8);
    color=mix(color,ink,side);
    color=mix(color,paper*light,face);
  }else{
    float bands=smoothstep(.34,.42,fract(p.y*(45.+uEnergy*50.)+field*1.5));
    color=mix(ink,orange,bands*face);
    float edge=abs(face-mask(p+vec2(0.,.008)));
    color=mix(color,paper,edge*.9);
    color=mix(color,orange*.74,(1.-face)*smoothstep(.98,1.,sin(uv.y*180.+field*8.))*.45);
  }
  gl_FragColor=vec4(color,1.);
}`;
function releaseShaders() {
  if (gl && !gl.isContextLost()) shaders.forEach(shader => gl.deleteShader(shader));
  shaders = [];
}
function releaseResources() {
  releaseShaders();
  if (gl && !gl.isContextLost()) {
    if (texture) gl.deleteTexture(texture);
    if (buffer) gl.deleteBuffer(buffer);
    if (program) gl.deleteProgram(program);
  }
  program = texture = buffer = null; uniforms = {};
}
function compile(type, source) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('Signal shader unavailable');
  shaders.push(shader);
  gl.shaderSource(shader, source); gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { throw new Error('Signal shader unavailable'); }
  return shader;
}
function fallback() {
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
  releaseResources();
  stage.removeAttribute('data-rendered');
  canvas.hidden = true;
  stage.classList.add('fallback');
  pause.disabled = true;
  pause.textContent = t('visual.signalStatic');
  document.querySelector('.signal-caption>span:last-child').textContent = t('visual.signalFallback');
}
function typeTexture() {
  const bitmap = document.createElement('canvas');
  bitmap.width = 1024; bitmap.height = 256;
  const ctx = bitmap.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = '900 235px Arial';
  ctx.translate(512, 128);
  ctx.scale(930 / ctx.measureText('SIGNAL').width, 1);
  ctx.fillText('SIGNAL', 0, 12);
  texture = gl.createTexture();
  if (!texture) throw new Error('Signal texture unavailable');
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmap);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}
function render(now) {
  frame = 0;
  if (!program || !visible || document.hidden) return;
  if (now - last < 33 && !stopped()) { frame = requestAnimationFrame(render); return; }
  const elapsed = Math.min(60, now - last || 33); last = now;
  if (!stopped()) time += elapsed / 1000;
  const blend = stopped() ? 1 : .12;
  pointer = pointer.map((value, i) => value + (target[i] - value) * blend);
  gl.uniform1f(uniforms.Time, time);
  gl.uniform1f(uniforms.Energy, intensity);
  gl.uniform1f(uniforms.Mode, mode);
  gl.uniform2f(uniforms.Pointer, pointer[0], pointer[1]);
  gl.uniform2f(uniforms.Resolution, width, height);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  if (!stage.hasAttribute('data-rendered')) stage.setAttribute('data-rendered', '');
  if (!stopped()) frame = requestAnimationFrame(render);
}
function requestDraw() {
  if (!frame && program && visible && !document.hidden) frame = requestAnimationFrame(render);
}
function resize() {
  const rect = stage.getBoundingClientRect();
  const ratio = Math.min(devicePixelRatio || 1, innerWidth < 700 ? 1.2 : 1.5);
  width = Math.max(1, Math.round(rect.width * ratio)); height = Math.max(1, Math.round(rect.height * ratio));
  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;
  if (program) gl.viewport(0, 0, width, height);
  requestDraw();
}
function updatePause() {
  if (!program) return;
  const globalPause = document.documentElement.classList.contains('motion-paused');
  const locked = reduced.matches || globalPause;
  pause.disabled = locked;
  pause.setAttribute('aria-pressed', String(stopped()));
  pause.textContent = t(reduced.matches ? 'visual.signalReduced' : globalPause ? 'visual.signalGlobalPause' : manualPause ? 'visual.signalResume' : 'visual.signalPause');
  if (frame) { cancelAnimationFrame(frame); frame = 0; }
  requestDraw();
}
function setup() {
  releaseResources();
  if (!gl) { fallback(); return; }
  try {
    const vertex = compile(gl.VERTEX_SHADER, vertexSource), fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    program = gl.createProgram();
    if (!program) throw new Error('Signal program unavailable');
    gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Signal unavailable');
    gl.useProgram(program);
    buffer = gl.createBuffer();
    if (!buffer) throw new Error('Signal buffer unavailable');
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const location = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(location); gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
    ['Time','Energy','Mode','Pointer','Resolution'].forEach(key => { uniforms[key] = gl.getUniformLocation(program, 'u' + key); });
    typeTexture();
    gl.uniform1i(gl.getUniformLocation(program, 'uType'), 0);
    stage.classList.remove('fallback'); canvas.hidden = false;
    document.querySelector('.signal-caption>span:last-child').textContent = t('visual.signalLive');
    resize(); updatePause();
  } catch { fallback(); } finally { releaseShaders(); }
}
energy.addEventListener('input', () => {
  intensity = Number(energy.value) / 100;
  document.querySelector('#signal-energy-value').value = new Intl.NumberFormat(getLocale(),{style:'percent',maximumFractionDigits:0}).format(Number(energy.value)/100);
  energy.setAttribute('aria-valuetext', t('visual.signalEnergy',{amount:energy.value}));
  stage.style.setProperty('--signal-spacing', String(intensity * .025) + 'em');
  requestDraw();
});
modes.forEach(button => button.addEventListener('click', () => {
  mode = Number(button.dataset.signalMode);
  modes.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
  document.querySelector('#signal-mode-label').textContent = t('visual.signalModes')[mode];
  stage.dataset.mode = String(mode);
  canvas.dataset.cursorTone = mode === 2 ? 'dark' : 'accent';
  requestDraw();
}));
stage.addEventListener('pointermove', event => {
  if (event.pointerType === 'touch' || stopped() || !program) return;
  const rect = stage.getBoundingClientRect();
  target = [(event.clientX - rect.left) / rect.width, 1 - (event.clientY - rect.top) / rect.height];
  if (!stopped()) requestDraw();
});
stage.addEventListener('pointerleave', () => { target = [.5,.5]; if (!stopped()) requestDraw(); });
pause.addEventListener('click', () => { manualPause = !manualPause; updatePause(); });
reduced.addEventListener('change', updatePause);
new MutationObserver(updatePause).observe(document.documentElement, { attributes:true, attributeFilter:['class'] });
new ResizeObserver(resize).observe(stage);
new IntersectionObserver(([entry]) => {
  visible = entry.isIntersecting;
  if (visible) requestDraw();
  else if (frame) { cancelAnimationFrame(frame); frame = 0; }
}).observe(stage);
document.addEventListener('visibilitychange', () => {
  if (document.hidden && frame) { cancelAnimationFrame(frame); frame = 0; }
  else requestDraw();
});
canvas.addEventListener('webglcontextlost', event => {
  event.preventDefault();
  // The driver has already invalidated these objects; do not delete stale handles after restore.
  program = texture = buffer = null; shaders = []; uniforms = {};
  fallback();
});
canvas.addEventListener('webglcontextrestored', setup);
document.querySelector('.signal-console')?.removeAttribute('inert');
stage.closest('#lab-003')?.setAttribute('data-signal-ready', '');
function translateSignal() {
  document.querySelector('#signal-mode-label').textContent = t('visual.signalModes')[mode];
  document.querySelector('#signal-energy-value').value = new Intl.NumberFormat(getLocale(),{style:'percent',maximumFractionDigits:0}).format(intensity);
  energy.setAttribute('aria-valuetext', t('visual.signalEnergy',{amount:energy.value}));
  document.querySelector('.signal-caption>span:last-child').textContent = t(program ? 'visual.signalLive' : 'visual.signalFallback');
  if (program) updatePause(); else pause.textContent = t('visual.signalStatic');
}
onLocaleChange(translateSignal);
setup();
translateSignal();
