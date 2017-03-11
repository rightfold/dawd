<?php
namespace DAWD;
use DAWD\Program\{Form, Report};

final class Main {
  private function __construct() {
  }

  public static function main() {
    $db = pg_connect('user=postgres dbname=dawd');

    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    switch ($path) {
      case '/SLOGIN': self::login($db); break;
      default: self::program($path); break;
    }
  }

  private static function login($db) {
    switch ($_SERVER['REQUEST_METHOD']) {
      case 'GET':
        ?>
          <form action="/SLOGIN" method="POST">
            <input type="text" name="username">
            <input type="password" name="password">
            <input type="submit">
          </form>
        <?
        break;
      case 'POST':
        $username = strtolower(trim($_POST['username']));
        $password = trim($_POST['password']);

        $result = pg_query_params($db, "
          SELECT password_hash
          FROM users
          WHERE username = $1
        ", [$username]);
        $row = pg_fetch_row($result);
        if ($row === FALSE || !password_verify($password, $row[0])) {
          echo 'bad creds';
          return;
        }
        echo 'welcome';

        break;
      default:
        header('HTTP/1.1 405 Method Not Allowed');
        break;
    }
  }

  private static function program(string $path): void {
    $program_id = substr($path, 1);
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
