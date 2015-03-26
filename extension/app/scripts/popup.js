'use strict';

$("form").on('submit', function(e) {
  e.preventDefault();

  chrome.runtime.sendMessage({ name: $('#name').val() }, function(response) {});

  console.log($('#name').val());
});

