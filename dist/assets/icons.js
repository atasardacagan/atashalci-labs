// UI arrows are CSS line drawings, never font glyphs or platform emoji.
export function setArrowLabel(element, label, direction = 'right') {
  element.textContent = label;
  if (!direction) return;
  const arrow = document.createElement('span');
  arrow.className = `ui-arrow ui-arrow--${direction}`;
  arrow.setAttribute('aria-hidden', 'true');
  element.append(' ', arrow);
}
