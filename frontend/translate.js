const fs = require('fs');
const path = require('path');
const translate = require('google-translate-api-x');

const languages = ['en', 'fr', 'de', 'es', 'pt'];
const sourceFile = './src/locales/it/messages.json';

async function translateJSON() {
    if (!fs.existsSync(sourceFile)) {
        console.error("Errore: Il file locales/it/messages.json non esiste!");
        return;
    }

    const data = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));

    for (const lang of languages) {
        const targetDir = path.join(__dirname, 'src', 'locales', lang);
        const targetFile = path.join(targetDir, 'messages.json');

        // Crea la cartella se non esiste
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        const translatedData = {};
        console.log(`Traduzione in corso: [${lang}]...`);

        for (const [key, value] of Object.entries(data)) {
            try {
                const res = await translate(value, { from: 'it', to: lang });
                translatedData[key] = res.text;
            } catch (err) {
                console.error(`Errore su chiave "${key}" per ${lang}:`, err.message);
                translatedData[key] = value; // Fallback al valore originale
            }
        }

        fs.writeFileSync(targetFile, JSON.stringify(translatedData, null, 2), 'utf8');
        console.log(`✅ File creato: ${targetFile}`);
    }
}

translateJSON();