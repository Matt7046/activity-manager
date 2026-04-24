const fs = require('fs');
const path = require('path');

const SRC_DIR = './src'; 
const OUTPUT_FILE = './it.json';

const TEXT_BETWEEN_TAGS = />\s*([^<>{}\n\t]+)\s*</g;
const ATTRIBUTE_TEXT = /(?:placeholder|title|label|aria-label)="([^"]+)"/g;

const BLACKLIST = ['promise', 'void', 'string', 'number', 'boolean', 'any', 'object', 'undefined', 'null'];

let translations = {};

function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            walkDir(filePath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            extractFromFile(filePath);
        }
    });
}

function extractFromFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    let match;

    while ((match = TEXT_BETWEEN_TAGS.exec(content)) !== null) {
        processMatch(match[1]);
    }
    while ((match = ATTRIBUTE_TEXT.exec(content)) !== null) {
        processMatch(match[1]);
    }
}

function processMatch(rawText) {
    const text = rawText.trim();
    
    // --- NUOVI FILTRI POTENZIATI ---
    
    // 1. Esclude se è solo un numero (es: "0", "100")
    const isPureNumber = /^\d+$/.test(text);
    
    // 2. Esclude se contiene operatori logici o frammenti di ternari (es: "?", "||", "&&", "==")
    const isLogic = /[?|&!=<>+]/.test(text);
    
    // 3. Esclude se è troppo corto (meno di 2 caratteri) o nella blacklist
    const isTooShort = text.length < 2;
    const isBlacklisted = BLACKLIST.includes(text.toLowerCase());

    if (text && !isTooShort && !isPureNumber && !isLogic && !isBlacklisted) {
        const key = generateKey(text);
        translations[key] = text;
    }
}

function generateKey(text) {
    return text
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Rimuove accenti per la chiave
        .replace(/[^a-z0-9 ]/g, '') // Rimuove simboli
        .trim()
        .replace(/\s+/g, '_')
        .substring(0, 50);
}

console.log('--- Pulizia ed Estrazione in corso ---');
walkDir(SRC_DIR);

const ordered = Object.keys(translations).sort().reduce((obj, key) => {
    obj[key] = translations[key];
    return obj;
}, {});

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(ordered, null, 2), 'utf-8');
console.log(`Fatto! Il file ${OUTPUT_FILE} è ora più pulito.`);