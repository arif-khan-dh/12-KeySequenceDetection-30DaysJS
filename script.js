const phTargetTxt = document.getElementById('ph-targetTxt');
const phShadow = document.getElementById('ph-shadow');
const phEmpty = document.getElementById('ph-empty');
const phrasesEl = document.getElementById('phrases');

phTargetTxt.addEventListener('keydown', handleKeyDownEvent);
phTargetTxt.addEventListener('keyup', handleKeyUpEvent);

populatePhrases();

let isOnCurrPhrase = true;
let currPhrase = [];

(() => {
    phTargetTxt.value = '';
})();

function handleKeyDownEvent(e) {
    console.log(e.type);
    if(e.key === 'Tab' && isOnCurrPhrase) {     
        phTargetTxt.value += phShadow.textContent;
        phShadow.textContent = '';
        phEmpty.textContent = phTargetTxt.value;
        currPhrase = [];
        isOnCurrPhrase = false;
        e.preventDefault();
    }
}

function handleKeyUpEvent(e) {
    phEmpty.textContent = phTargetTxt.value;    
    if(!reservedkeys.includes(e.key)) {
        if (e.key === 'Backspace') {
            currPhrase.pop();
        } else {
            if (isOnCurrPhrase) {
                currPhrase.push(e.key);
                
            } else {
                const lastWord = getLastWord();
                currPhrase = [];
                if(lastWord === ' ') {                    
                    phShadow.textContent = '';                    
                } else {
                    lastWord.split('').forEach(letter => currPhrase.push(letter));
                }
                isOnCurrPhrase = true;
                
            }                        
        }
        processSuggestions();
    }    
    if(phTargetTxt.value === '') phShadow.textContent = '';
}

function processSuggestions() {
    let subStr = currPhrase.join('');
    // phShadow.textContent = subStr;
    if(subStr.trim().length > 0) {
        let prePhrases = fetchPreliminaryPhrases(subStr.trim());
        if(prePhrases.length > 0) {
            let suggestionPhrase = prePhrases[0].slice(subStr.length);
            if(suggestionPhrase.length === 0) {
                isOnCurrPhrase = false;
            }
            phShadow.textContent = suggestionPhrase;
        }
        else {
            phShadow.textContent = '';
            isOnCurrPhrase = false;
        }
    } else {
        phShadow.textContent = '';
    }
}

function fetchPreliminaryPhrases(subStr) {
    let preliminaryPhrases = phrases.filter(phrase => {
        if(phrase.toLowerCase().startsWith(subStr.toLowerCase())) {
            return phrase;
        }
    });
    return preliminaryPhrases;
}

function getLastWord() {
    let writtenText = phEmpty.textContent;
    let result;
    if(writtenText[writtenText.length - 1] !== ' ') {
        let lastWordStartsAt = writtenText.trimEnd().lastIndexOf(' ') + 1 ;
         result = writtenText.slice(lastWordStartsAt)
    } else 
        result = ' ';
    
    
    return result;
}


function populatePhrases() {
    
    phrases.forEach( phrase => {
        let spanContainer = document.createElement('div');
        let span = document.createElement('span');
        span.textContent = phrase;
        spanContainer.appendChild(span);
        phrasesEl.appendChild(spanContainer);

        // let span = document.createElement('span');
        // span.textContent = phrase;
        // phrasesEl.appendChild(span);
    });
}