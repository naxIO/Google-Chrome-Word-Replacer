// Replace words in a text node based on the given wordReplacements object
function replaceWords(textNode, wordReplacements) {
  const text = textNode.nodeValue;
  const regex = new RegExp('\\b(?:' + Object.keys(wordReplacements).join('|') + ')\\b', 'gi');
  const replacedText = text.replace(regex, (match) => {
    return wordReplacements[match] || match;
  });

  if (replacedText !== text) {
    textNode.nodeValue = replacedText;
  }
}

// Recursively traverse the DOM tree and process text nodes with replaceWords
function walk(node, wordReplacements) {
  let child, next;

  if (node.tagName && node.tagName.toLowerCase() === 'script') {
    return;
  }

  if (node.tagName && node.tagName.toLowerCase() === 'style') {
    return;
  }

  const ELEMENT_NODE = 1;
  const DOCUMENT_NODE = 9;
  const DOCUMENT_FRAGMENT_NODE = 11;
  const TEXT_NODE = 3;

  switch (node.nodeType) {
    case ELEMENT_NODE:
    case DOCUMENT_NODE:
    case DOCUMENT_FRAGMENT_NODE:
      child = node.firstChild;
      while (child) {
        next = child.nextSibling;
        walk(child, wordReplacements);
        child = next;
      }
      break;

    case TEXT_NODE:
      replaceWords(node, wordReplacements);
      break;
  }
}

// Observe DOM changes and apply word replacements to new nodes
function observeDOMChanges(wordReplacements) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      Array.from(mutation.addedNodes).forEach((node) => {
        walk(node, wordReplacements);
      });
    });
  });

  observer.observe(document, {
    childList: true,
    subtree: true,
  });

  return observer;
}

// Retrieve user-defined word replacements from browser storage
chrome.storage.local.get({ wordReplacements: {} }, function(data) {
  let wordReplacements = data.wordReplacements;

  // Add event listener to update word replacements when they are changed by the user
  chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace === 'local' && changes.wordReplacements) {
      wordReplacements = changes.wordReplacements.newValue;
    }
  });

  // Add event listener to update the DOM when the page has finished loading
  window.addEventListener('load', function() {
    // Call the walk function initially
    walk(document.body, wordReplacements);
    
    // Set up an interval to call the walk function every 2 seconds (2000 ms)
    setInterval(() => {
      walk(document.body, wordReplacements);
    }, 2000);

    // Observe DOM changes and apply word replacements to new nodes
    observeDOMChanges(wordReplacements);
  });
});