// --- Navigation Logic (Matches your project document structure) ---
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    // Deactivate all nav buttons
    document.querySelectorAll('.nav').forEach(nav => nav.classList.remove('active'));

    // Show selected page
    document.getElementById('page-' + pageId).classList.add('active');
    
    // Activate nav button if it exists
    let navBtn = document.getElementById('nav-' + pageId);
    if(navBtn) navBtn.classList.add('active');
}

// --- Caesar Cipher Logic ---
function runCaesar(isDecrypt) {
    const text = document.getElementById("caesar-text").value;
    const shift = parseInt(document.getElementById("caesar-key").value) || 0;
    let result = '';
    
    let effectiveShift = isDecrypt ? (26 - shift) % 26 : shift;
    
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        if (char.match(/[A-Z]/)) {
            let code = ((char.charCodeAt(0) - 65 + effectiveShift) % 26) + 65;
            result += String.fromCharCode(code);
        } else if (char.match(/[a-z]/)) {
            let code = ((char.charCodeAt(0) - 97 + effectiveShift) % 26) + 97;
            result += String.fromCharCode(code);
        } else {
            result += char; 
        }
    }
    document.getElementById("caesar-result").value = result;
}

// --- RC4 Cipher Logic ---
function runRC4(isDecrypt) {
    let text = document.getElementById("rc4-text").value;
    const keyStr = document.getElementById("rc4-key").value;
    
    if (!text || !keyStr) {
        document.getElementById("rc4-result").value = "";
        return;
    }

    // Key-Scheduling Algorithm (KSA)
    let S = Array.from({length: 256}, (_, i) => i);
    let j = 0;
    for (let i = 0; i < 256; i++) {
        j = (j + S[i] + keyStr.charCodeAt(i % keyStr.length)) % 256;
        [S[i], S[j]] = [S[j], S[i]];
    }

    // Pseudo-Random Generation Algorithm (PRGA) & XOR
    let i = 0; j = 0;
    let result = "";

    if (!isDecrypt) {
        // Encrypt to Hex
        for (let k = 0; k < text.length; k++) {
            i = (i + 1) % 256;
            j = (j + S[i]) % 256;
            [S[i], S[j]] = [S[j], S[i]];
            let K = S[(S[i] + S[j]) % 256];
            let charCode = text.charCodeAt(k) ^ K;
            result += charCode.toString(16).padStart(2, '0');
        }
        document.getElementById("rc4-result").value = result.toUpperCase();
    } else {
        // Decrypt from Hex
        text = text.replace(/\s+/g, '');
        if (text.length % 2 !== 0) {
            document.getElementById("rc4-result").value = "Error: Invalid Hex";
            return;
        }
        for (let k = 0; k < text.length; k += 2) {
            let byte = parseInt(text.substring(k, k+2), 16);
            if (isNaN(byte)) {
                document.getElementById("rc4-result").value = "Error: Non-Hex character";
                return;
            }
            i = (i + 1) % 256;
            j = (j + S[i]) % 256;
            [S[i], S[j]] = [S[j], S[i]];
            let K = S[(S[i] + S[j]) % 256];
            result += String.fromCharCode(byte ^ K);
        }
        document.getElementById("rc4-result").value = result;
    }
}
