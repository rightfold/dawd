<?php
namespace DAWD\Program;
use DAWD\{Document, Program};

final class Report extends Program {
  private $execute;

  public function __construct(callable $execute) {
    $this->execute = $execute;
  }

  public function execute(): Document {
    return ($this->execute)();
  }

  public function fold(callable $onForm, callable $onReport) {
    return $onReport($this);
  }
}
