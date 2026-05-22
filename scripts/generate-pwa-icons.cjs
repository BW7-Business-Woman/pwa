const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

const input = path.resolve(__dirname, '..', 'public', 'logo-pwa.jpg');
const out192 = path.resolve(__dirname, '..', 'public', 'icon-192.png');
const out512 = path.resolve(__dirname, '..', 'public', 'icon-512.png');

async function run() {
  try {
    await sharp(input).resize(192, 192, { fit: 'cover' }).png().toFile(out192);
    await sharp(input).resize(512, 512, { fit: 'cover' }).png().toFile(out512);
    console.log('Generated', out192, out512);
  } catch (err) {
    console.error('Failed to generate icons:', err);
    process.exit(1);
  }
}

run();
