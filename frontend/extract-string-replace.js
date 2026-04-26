const fs = require('fs');
const path = require('path');

const SRC_DIR = './src';

// 1. Regex per attributi (es: placeholder="Cerca")
const ATTR_REGEX = /(placeholder|title|label|aria-label)="([^"]+)"/g;

// 2. Regex per proprietà oggetti (es: message: "Salva")
const VAL_REGEX = /(title|message|label|description|placeholder):\s*(?:"([^"]+)"|'([^']+)')/g;

// 3. Regex per testo JSX
const JSX_TEXT_REGEX = />([^<>{}\n\t;()]+)</g;

// BLACKLIST estesa per includere tipi e termini tecnici comuni
const BLACKLIST = [
    'promise', 'Promise', 'void', 'string', 'number', 'boolean', 
    'any', 'object', 'undefined', 'null', 'dispatch', 'setstateaction', 'SetStateAction'
];

// Parole chiave che bloccano la trasformazione della riga
const TECH_KEYWORDS = [
    'Dispatch', 'SetStateAction', 'useState', 'useContext', 
    'interface', 'type ', 'Promise', '=>', 'ReactNode'
];

function generateKey(text) {
    if (!text) return '';
    return text
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/['’]/g, '_')
        .replace(/[^a-z0-9 ]/g, '')
        .trim()
        .replace(/\s+/g, '_');
}

function isRealText(text) {
    const t = text.trim();
    if (!t || t.length < 2 || /^\d+$/.test(t)) return false;
    
    // Se la parola è nella blacklist (case insensitive), scarta
    if (BLACKLIST.some(b => b.toLowerCase() === t.toLowerCase())) return false;
    
    // Se contiene simboli di assegnazione o logica, scarta
    if (/[=:{}\[\]()|]/.test(t)) return false; 
    
    if (!/[a-zA-ZÀ-ÿ]/.test(t)) return false;
    return true;
}

function transformFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    const lines = content.split('\n');
    const transformedLines = [];

    for (let line of lines) {
        // --- PROTEZIONE RIGIDA PER CODICE E INTERFACCE ---
        // Se la riga contiene tipi tecnici, frecce di funzione o definizioni, la saltiamo
        const isTechLine = TECH_KEYWORDS.some(keyword => line.includes(keyword));
        
        if (isTechLine) {
            transformedLines.push(line);
            continue;
        }

        // 1. Proprietà oggetti
        line = line.replace(VAL_REGEX, (match, prop, valD, valS) => {
            const text = valD || valS;
            if (isRealText(text)) {
                return `${prop}: i18n._("${generateKey(text)}")`;
            }
            return match;
        });

        // 2. Attributi
        line = line.replace(ATTR_REGEX, (match, attr, text) => {
            if (isRealText(text)) {
                return `${attr}={i18n._("${generateKey(text)}")}`;
            }
            return match;
        });

        // 3. Testo JSX
        line = line.replace(JSX_TEXT_REGEX, (match, text) => {
            if (isRealText(text)) {
                return `><Trans id="${generateKey(text)}" /><`;
            }
            return match;
        });

        transformedLines.push(line);
    }

    content = transformedLines.join('\n');

    if (content !== originalContent) {
        content = content.replace(/>+/g, '>').replace(/<+/g, '<');

        let imports = [];
        if (content.includes('<Trans id=') && !content.includes('from "@lingui/react"')) {
            imports.push('import { Trans } from "@lingui/react";');
        }
        if (content.includes('i18n._(') && !content.includes('from "@lingui/core"')) {
            imports.push('import { i18n } from "@lingui/core";');
        }

        if (imports.length > 0) {
            content = imports.join('\n') + '\n' + content;
        }

        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`✅ Trasformato in sicurezza: ${filePath}`);
    }
}

function walk(dir) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (fullPath.endsWith('.tsx')) {
            transformFile(fullPath);
        }
    });
}

console.log("🚀 Avvio trasformazione con protezione per Promise e Tipi...");
walk(SRC_DIR);
console.log("✨ Operazione completata!");
console.log("✨ Completato! esegui npm run lang:extract");