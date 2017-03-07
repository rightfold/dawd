<?php
use DAWD\Document;
use DAWD\Program\Report;

return new Report(function() {
  $document = new Document();
  $document->append('default', 'Hello, world!');
  return $document;
});
