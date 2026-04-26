const fs = require('fs');
const path = require('path');

const SRC_DIR = './src';

const TEXT_REGEX = />\s*([^<>{}\n\t]+)\s*</g;
const ATTR_REGEX = /(placeholder|title|label|aria-label)="([^"]+)"/g;
const VAL_REGEX = /(title|message|label|description|placeholder):\s*["']([^"']+)["']/g;

const BLACKLIST = ['promise', 'void', 'string', 'number', 'boolean', 'any', 'object', 'undefined', 'null'];

function generateKey(text) {
    return text
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/['']/g, '_') // Sostituisce gli apostrofi con underscore
        .replace(/[^a-z0-9 ]/g, '') // Rimuove tutto il resto che non è alfanumerico
        .trim()
        .replace(/\s+/g, '_');
}

function isRealText(text) {
    const t = text.trim();
    if (/^\d/.test(t)) return false;
    if (/[&|?=:(){}[\]]/.test(t)) return false;
    if (!/[a-zA-ZÀ-ÿ]/.test(t)) return false;
    if (t.length < 2 || BLACKLIST.includes(t.toLowerCase())) return false;
    return true;
}

function transformFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;

    content = content.replace(TEXT_REGEX, (match, text) => {
        if (isRealText(text)) {
            const key = generateKey(text);
            const leadingMatch = match.match(/^>\s*/);
            const trailingMatch = match.match(/\s*</);
            return `${leadingMatch ? leadingMatch[0] : '>'}<Trans id="${key}" />${trailingMatch ? trailingMatch[0] : '<'}`;
        }
        return match;
    });

    content = content.replace(ATTR_REGEX, (match, attr, text) => {
        if (isRealText(text)) {
            const key = generateKey(text);
            return `${attr}={i18n._("${key}")}`;
        }
        return match;
    });

    content = content.replace(VAL_REGEX, (match, prop, text) => {
        if (isRealText(text)) {
            const key = generateKey(text);
            // Usiamo i doppi apici per la stringa interna per evitare conflitti con l'apostrofo
            return `${prop}: i18n._("${key}")`;
        }
        return match;
    });

    if (content !== originalContent) {
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
        console.log(`✅ Trasformato: ${filePath}`);
    }
}

function walk(dir) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            if (fullPath.includes('service') || fullPath.includes('api') || fullPath.includes('interface') || fullPath.endsWith('.d.ts')) return;
            transformFile(fullPath);
        }
    });
}

console.log("🚀 Avvio trasformazione (Fix apostrofi)...");
walk(SRC_DIR);
console.log("✨ Completato! esegui npm run lang:extract");