// ==UserScript==
// @name         Jira descriptive link
// @namespace    https://openuserjs.org/users/floodmeadows
// @description  Adds a copyable link to issue details, for pasting into messages etc.
// @copyright    2026, floodmeadows (https://openuserjs.org/users/floodmeadows)
// @license      MIT
// @version      1.1
// @include      https://*/browse/*
// @include      https://*/projects/*
// @grant        none
// ==/UserScript==

// ==OpenUserJS==
// @author       floodmeadows
// ==/OpenUserJS==

/* jshint esversion: 11 */

(function () {
  'use strict';

  // -----------------------------
  // CONFIGURATION
  // -----------------------------
  const markerId = 'copy-descriptive-link-button-added';
  let issueKey = "";
  let issueName = "";
  let issueUrl = "";

  // -----------------------------
  // INITIALISE
  // -----------------------------
  function init() {
    issueKey = document.getElementById('key-val')?.textContent.trim();
    issueName = getIssueName();
    issueUrl = document.URL;
    checkIfButtonNeedsAdding();
  }

  function checkIfButtonNeedsAdding() {
    console.log("start called")
    setTimeout(() => {
      const target = document.getElementById('key-val').parentElement.parentElement; //<ol>
      if (!target) {
        console.log("Target element not found. Can't add button.")
        return
      }
      if (document.getElementById(markerId)) {
        console.log("Marker element not found. Returning without adding button.")
        return;
      }
      console.log("Injecting button...");
      const marker = document.createElement('span');
      marker.id = markerId;
      target.after(marker);
      addButton(target, "Copy descriptive link", copyTextToClipboard);
      applyAdditionalFormatting();
    }, 500); // delay to allow DOM to settle
}

  function addButton(target, buttonText, callbackFunction) {
  const button = document.createElement("button");
  button.addEventListener("click", callbackFunction);
  button.setAttribute("id","copy-descriptive-link");
  button.setAttribute("class","aui-button");
  target.after(button);
  const textNode = document.createTextNode(buttonText);
  button.appendChild(textNode);
}

function applyAdditionalFormatting() {
  document.getElementById('key-val').parentElement.parentElement.style.display = "inline-block";
  document.getElementById('summary-val').style.display = "block";
  document.getElementById('copy-descriptive-link').style.display = "inline-block";
  document.getElementById('copy-descriptive-link').style.border = "none";
  document.getElementById('copy-descriptive-link').style.padding = "0.4em 0.8em";
 }

  function getIssueName() {
    let issueNameH1 = document.querySelector('h1#summary-val')
    let issueNameDiv = document.querySelector('div#summary-val')
    let issueNameH2 = document.querySelector('h2#summary-val')
    let issueName = ''
    if (issueNameH1 !== null) {
        issueName = issueNameH1.childNodes[0].nodeValue;
    } else if (issueNameDiv !== null) {
        issueName = issueNameDiv.childNodes[0].childNodes[0].nodeValue
    } else if (issueNameH2 !== null) {
        issueName = issueNameH2.childNodes[0].nodeValue
    }

    return issueName
  }


  function constructTextForClipboard() {
    var textForClipboard = new Object();
    textForClipboard.text = `'${issueName}' (${issueUrl})`;
    textForClipboard.html = `<a href="${issueUrl}">'${issueName}' (${issueKey})</a>`;

    return textForClipboard;
}

function copyTextToClipboard() {
  console.log("copyTextToClipboard() called.");

  const textForClipboard = constructTextForClipboard();

  const contentTypeText = "text/plain";
  const contentTypeHtml = "text/html";
  const blobText = new Blob([textForClipboard.text], { type: contentTypeText });
  const blobHtml = new Blob([textForClipboard.html], { type: contentTypeHtml });
  const data = new ClipboardItem({
      [contentTypeText]: blobText,
      [contentTypeHtml]: blobHtml
  });

  navigator.clipboard
      .write([data])
      .then(
          (response) => {
              console.log("Success writing to the clipboard.");
              console.log(new Array(textForClipboard.text, textForClipboard.html));
          },
          (response) => {
              console.log("Error writing to the clipboard: " + response.text);
          }
      );
}

  // -----------------------------
  // OBSERVER TO HANDLE DOM CHANGES
  // -----------------------------

  const observer = new MutationObserver((mutationsList, observer) => {
    console.log("DOM changed, checking buttons...");
    checkIfButtonNeedsAdding();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  window.__observerActive = true;
  console.log("MutationObserver started");

  // Run on initial load
  init();
})();
