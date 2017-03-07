<?php
namespace DAWD;

final class Document {
  private $sections;

  public function __construct() {
    $this->sections = [];
  }

  public function sections(): array {
    return $this->sections;
  }

  public function append(string $section, $value): void {
    if (array_key_exists($section, $this->sections)) {
      $this->sections[$section] .= $value;
    } else {
      $this->sections[$section] = $value;
    }
  }
}
