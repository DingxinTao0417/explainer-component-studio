import puppeteer from 'puppeteer-core';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sounds } from '../sound-assets.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const base = process.env.SFX_PREVIEW_URL || 'http://localhost:3031/';
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--autoplay-policy=no-user-gesture-required'],
});
let report;
try {
  const page = await browser.newPage();
  await page.goto(base + 'catalog.html', { waitUntil: 'domcontentloaded' });
  const results = await page.evaluate(async (items) => {
    const audioContext = new AudioContext({ sampleRate: 48000 });
    await audioContext.resume();
    const results = [];
    for (const sound of items) {
      const response = await fetch(sound.src);
      const array = await response.arrayBuffer();
      const buffer = await audioContext.decodeAudioData(array);
      const gain = audioContext.createGain();
      gain.gain.value = sound.defaultGain;
      gain.connect(audioContext.destination);
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(gain);
      const ended = new Promise(resolve => source.onended = resolve);
      // Play a brief head of each sound to exercise actual WebAudio scheduling.
      source.start(0, 0, Math.min(.1, buffer.duration));
      await ended;
      let max = 0;
      for (let channel=0; channel<buffer.numberOfChannels; channel++) {
        const samples = buffer.getChannelData(channel);
        for (let i=0;i<samples.length;i++) max=Math.max(max, Math.abs(samples[i]));
      }
      results.push({ id:sound.id, httpStatus:response.status, decoded:true, scheduledPlaybackEnded:true,
        duration:buffer.duration, expectedDuration:sound.duration, sampleRate:buffer.sampleRate,
        channels:buffer.numberOfChannels, peak:max, pass:response.ok && Math.abs(buffer.duration-sound.duration)<.0001 && max>0 && max<.72 });
      source.disconnect(); gain.disconnect();
    }
    await audioContext.close();
    return results;
  }, sounds);
  report = { verifiedAt:new Date().toISOString(), mode:'Chrome WebAudio decode and playback scheduling; not subjective listening or output-device verification',
    source:base, count:results.length, allPassed:results.every(result=>result.pass), results };
  await fs.writeFile(path.join(root,'reports','sfx-browser-check.json'), JSON.stringify(report,null,2));
} finally { await browser.close(); }
console.log(JSON.stringify(report,null,2));
if (!report?.allPassed) process.exitCode = 1;
