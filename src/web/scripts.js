const qrcode = new QRCode(document.getElementById('qrcode'), {
  text: 'digivac',
  width: 300,
  height: 300,
  colorDark: '#2352FF',
  lightDark: '#fff',
  correctLevel: QRCode.CorrectLevel.H
});