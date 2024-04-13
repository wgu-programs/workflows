import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';

const convertToMP3 = async (filePath, apiKey, voice = 'en-US-Wavenet-F') => {
    const content = fs.readFileSync(filePath, 'utf8');
    const apiUrl = 'https://api.elevenlabs.io/speech';
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: content,
            voice: voice
        })
    });

    if (!response.ok) {
        console.error(`Failed to convert ${filePath} to MP3: ${response.statusText}`);
        process.exit(1);
    }

    const buffer = await response.arrayBuffer();
    const mp3Path = path.join(path.dirname(filePath), `${path.basename(filePath, '.md')}.mp3`);
    fs.writeFileSync(mp3Path, Buffer.from(buffer));

    console.log(`Converted ${filePath} to ${mp3Path}`);
};

const [,, filePath, apiKey, voice] = process.argv;

convertToMP3(filePath, apiKey, voice).catch(console.error);