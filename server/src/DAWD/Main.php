<?php
namespace DAWD;
use DAWD\Program\{Form, Report};

final class Main {
  private function __construct() {
  }

  public static function main() {
    $program_id = substr(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), 1);
    if (!preg_match('/^[SAI][A-Z0-9]+$/', $program_id)) {
      goto notFound;
    }
    switch (substr($program_id, 0, 1)) {
      case 'S': $program_dir = getenv('DAWD_SYSTEM_PROGRAM_DIR'); break;
      case 'A': $program_dir = getenv('DAWD_APPLICATION_PROGRAM_DIR'); break;
      case 'I': $program_dir = getenv('DAWD_INSTALLATION_PROGRAM_DIR'); break;
    }
    if ($program_dir === FALSE) {
      goto notFound;
    }

    $program_path = "$program_dir/$program_id.php";
    if (!file_exists($program_path)) {
      goto notFound;
    }
    $program = require_once $program_path;

    $program->fold(function(Form $form) {
      echo "Form\n";
    }, function(Report $report) {
      echo "Report\n";
      $document = $report->execute();
      var_dump($document);
    });
    return;

  notFound:
    header('HTTP/1.1 404 Not Found');
  }
}
