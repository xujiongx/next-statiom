export function flexible() {
  const doc = window.document;
  const docEl = doc.documentElement;

  // 调整body标签的fontSize
  function setBodyFontSize() {
    if (doc.body) {
      doc.body.style.fontSize = '16px';
    } else {
      doc.addEventListener('DOMContentLoaded', setBodyFontSize);
    }
  }
  setBodyFontSize();

  // 设置html的fontSize
  function setRemUnit() {
    const rem = docEl.clientWidth / 10;
    docEl.style.fontSize = rem + 'px';
  }

  setRemUnit();

  // 监听resize事件
  window.addEventListener('resize', setRemUnit);
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      setRemUnit();
    }
  });
}
