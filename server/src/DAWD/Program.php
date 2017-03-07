<?php
namespace DAWD;

abstract class Program {
  public abstract function fold(callable $onForm, callable $onReport);
}
