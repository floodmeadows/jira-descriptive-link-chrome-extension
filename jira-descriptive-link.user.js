// ==UserScript==
// @name         Jira descriptive link
// @namespace    https://openuserjs.org/users/floodmeadows
// @description  Adds a copyable link to issue details, for pasting into messages etc.
// @copyright    2023, floodmeadows (https://openuserjs.org/users/floodmeadows)
// @license      MIT
// @version      0.3
// @include      https://jira.*.uk/browse/*
// @grant        none
// ==/UserScript==

// ==OpenUserJS==
// @author       floodmeadows
// ==/OpenUserJS==

/* jshint esversion: 6 */

(function () {
  'use strict';

  addLink();

  const target = document.getElementById('key-val').parentElement.parentElement; //<ol>
  addButton("Copy descriptive link", target, copyTextToClipboard);
  applyAdditionalFormatting();
})();

function addLink() {
const issueKey = document.getElementById("key-val").childNodes[0].nodeValue;
const issueName = document.getElementById("summary-val").childNodes[0].nodeValue;
const newElement = document.createElement("div");
const h = '<a href="' + document.URL + '">\'' + issueName + '\' (' + issueKey + ')</a>';
newElement.innerHTML = h;
const target = document.getElementById('summary-val');
target.parentNode.appendChild(newElement);
}

function constructTextForClipboard() {
  const issueKey = document.getElementById("key-val").childNodes[0].nodeValue;
  const issueName = document.getElementById("summary-val").childNodes[0].nodeValue;

  var textForClipboard = new Object();
  textForClipboard.text = `'${issueName}' (${document.URL})`;
  textForClipboard.html = `<a href="${document.URL}">'${issueName}' (${issueKey})</a>`;

  return textForClipboard;
}

function addButton(buttonText, target, callbackFunction) {
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
