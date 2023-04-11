function createReplacementPairElement(pair) {
  const div = document.createElement("div");
  div.className = "replacement-pair";

  const searchWordInput = document.createElement("input");
  searchWordInput.type = "text";
  searchWordInput.placeholder = "Search Word";
  searchWordInput.value = pair.searchWord || "";
  div.appendChild(searchWordInput);

  const replaceWordInput = document.createElement("input");
  replaceWordInput.type = "text";
  replaceWordInput.placeholder = "Replace Word";
  replaceWordInput.value = pair.replaceWord || "";
  div.appendChild(replaceWordInput);

  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.addEventListener("click", () => {
    div.remove();
  });
  div.appendChild(removeButton);

  return div;
}

function loadReplacements() {
  chrome.storage.local.get({ wordReplacements: {} }, function (data) {
    const wordReplacements = data.wordReplacements;
    const wordReplacementsDiv = document.getElementById("wordReplacements");

    for (const searchWord in wordReplacements) {
      const pair = {
        searchWord: searchWord,
        replaceWord: wordReplacements[searchWord],
      };
      wordReplacementsDiv.appendChild(createReplacementPairElement(pair));
    }
  });
}

function addReplacement() {
  const wordReplacementsDiv = document.getElementById("wordReplacements");
  wordReplacementsDiv.appendChild(createReplacementPairElement({}));
}

function saveReplacements() {
  const wordReplacementsDiv = document.getElementById("wordReplacements");
  const pairs = wordReplacementsDiv.querySelectorAll("div");

  const wordReplacements = {};

  pairs.forEach((pairDiv) => {
    const searchWordInput = pairDiv.querySelector("input[type=text]:first-child");
    const replaceWordInput = pairDiv.querySelector("input[type=text]:last-child");

    if (searchWordInput.value && replaceWordInput.value) {
      wordReplacements[searchWordInput.value] = replaceWordInput.value;
    }
  });

  chrome.storage.local.set({ wordReplacements }, function () {
    alert("Word replacements saved.");
  });
}

document.getElementById("addReplacement").addEventListener("click", addReplacement);
document.getElementById("saveReplacements").addEventListener("click", saveReplacements);
loadReplacements();
