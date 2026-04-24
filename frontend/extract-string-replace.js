const fs = require('fs');
const path = require('path');

const SRC_DIR = './src';

// Regex per testo tra tag e attributi
const TEXT_REGEX = />\s*([^<>{}\n\t]+)\s*</g;
const ATTR_REGEX = /(placeholder|title|label|aria-label)="([^"]+)"/g;

const BLACKLIST = ['promise', 'void', 'string', 'number', 'boolean', 'any', 'object', 'undefined', 'null'];

function generateKey(text) {
    return text
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9 ]/g, '')
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

    // 1. Sostituzione testo -> <Trans id="chiave" />
    content = content.replace(TEXT_REGEX, (match, text) => {
        if (isRealText(text)) {
            const key = generateKey(text);
            const leadingMatch = match.match(/^>\s*/);
            const trailingMatch = match.match(/\s*</);
            const leadingSpace = leadingMatch ? leadingMatch[0] : '>';
            const trailingSpace = trailingMatch ? trailingMatch[0] : '<';
            
            // TAG AUTO-CHIUDENTE SENZA TESTO
            return `${leadingSpace}<Trans id="${key}" />${trailingSpace}`;
        }
        return match;
    });

    // 2. Sostituzione attributi -> i18n._("chiave")
    content = content.replace(ATTR_REGEX, (match, attr, text) => {
        if (isRealText(text)) {
            const key = generateKey(text);
            return `${attr}={i18n._("${key}")}`;
        }
        return match;
    });

    if (content !== originalContent) {
        let imports = [];
        
        // Import da @lingui/react per il componente
        if (content.includes('<Trans id=') && !content.includes('from "@lingui/react"')) {
            imports.push('import { Trans } from "@lingui/react";');
        }
        
        // Import da @lingui/core per la logica (i18n._ sostituisce t)
        if (content.includes('i18n._(') && !content.includes('from "@lingui/core"')) {
            imports.push('import { i18n } from "@lingui/core";');
        }

        if (imports.length > 0) {
            content = imports.join('\n') + '\n' + content;
        }

        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`✅ Trasformato correttamente: ${filePath}`);
    }
}

function walk(dir) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (fullPath.endsWith('.tsx')) {
            if (fullPath.includes('service') || fullPath.includes('api') || fullPath.includes('interface')) return;
            transformFile(fullPath);
        }
    });
}

console.log("🚀 Trasformazione finale: solo ID e import corretti...");
walk(SRC_DIR);
console.log("✨ Fatto!");