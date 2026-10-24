/* WhatPhone — shared helpers for calculator & test apps */
function toggleFaq(btn){var item=btn.closest('.faq-item'),open=item.classList.toggle('open');btn.setAttribute('aria-expanded',open?'true':'false');}
function showToast(msg){var t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(t._h);t._h=setTimeout(function(){t.classList.remove('show')},2400);}
function copyText(text){if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(function(){showToast('Copied to clipboard')},function(){showToast('Copy failed')});}else{showToast('Copy not supported here');}}
function $(id){return document.getElementById(id);}
document.addEventListener('DOMContentLoaded',function(){if(typeof Header!=='undefined')Header.render();if(typeof Footer!=='undefined')Footer.render();});
