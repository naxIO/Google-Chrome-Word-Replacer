function loadReplacements() {
  chrome.storage.local.get({ wordReplacements: {} }, function (data) {
    const wordReplacements = data.wordReplacements;
    Object.entries(wordReplacements).forEach(([word, replacement]) => {
      addReplacementPair(word, replacement);
    });
  });
}

function addReplacementPair(word = '', replacement = '') {
  const wordReplacementsDiv = document.getElementById('wordReplacements');

  const pairDiv = document.createElement('div');
  pairDiv.classList.add('word-pair');

  const wordInput = document.createElement('input');
  wordInput.setAttribute('type', 'text');
  wordInput.setAttribute('placeholder', 'Word');
  wordInput.value = word;
  pairDiv.appendChild(wordInput);

  const replacementInput = document.createElement('input');
  replacementInput.setAttribute('type', 'text');
  replacementInput.setAttribute('placeholder', 'Replacement');
  replacementInput.value = replacement;
  pairDiv.appendChild(replacementInput);

  const removeButton = document.createElement('button');
  removeButton.innerText = 'Remove';
  removeButton.addEventListener('click', () => {
    wordReplacementsDiv.removeChild(pairDiv);
  });
  pairDiv.appendChild(removeButton);

  wordReplacementsDiv.appendChild(pairDiv);
}

function addReplacement() {
  addReplacementPair();
}

function saveReplacements() {
  const pairs = document.querySelectorAll('#wordReplacements .word-pair');
  const wordReplacements = {};

  pairs.forEach((pair) => {
    const wordInput = pair.querySelector('input:nth-child(1)');
    const replacementInput = pair.querySelector('input:nth-child(2)');

    if (wordInput.value && replacementInput.value) {
      wordReplacements[wordInput.value] = replacementInput.value;
    }
  });

  chrome.storage.local.set({ wordReplacements }, function () {
    alert('Replacements saved!');
  });
}

document.getElementById("addReplacement").addEventListener("click", addReplacement);
document.getElementById("saveReplacements").addEventListener("click", saveReplacements);
loadReplacements();
