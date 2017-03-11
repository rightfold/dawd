<?php
namespace DAWD;

final class Authentication {
  private function __construct() {
  }

  public static function authenticate($db, string $username, string $password): bool {
    $result = pg_query_params($db, "
      SELECT password_hash
      FROM users
      WHERE username = $1
    ", [$username]);
    $row = pg_fetch_row($result);
    return $row !== FALSE && password_verify($password, $row[0]);
  }
}
