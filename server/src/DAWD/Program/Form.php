<?php
namespace DAWD\Program;
use DAWD\Program;

final class Form extends Program {
  public function fold(callable $onForm, callable $onReport) {
    return $onForm($this);
  }
}
