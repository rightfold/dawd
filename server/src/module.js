'use strict';

function ActionModule(name, level, render) {
  this.name = name;
  this.level = level;
  this.render = render;
}

function ReportModule(name, level, render) {
  this.name = name;
  this.level = level;
  this.render = render;
}

var Type = {
  Action: 0,
  Report: 1,
};

var Level = {
  System: 0,
  Application: 1,
  Installation: 2,
};

function moduleTypePathSegment($module) {
  if ($module instanceof ActionModule || $module === Type.Action) {
    return 'action';
  }
  if ($module instanceof ReportModule || $module === Type.Report) {
    return 'report';
  }
  throw Error('Unknown module class: ' + $module.constructor.name);
}

function levelPathSegment(level) {
  switch (level) {
    case Level.System:       return 'system';
    case Level.Application:  return 'application';
    case Level.Installation: return 'installation';
  }
}

module.exports = {
  ActionModule: ActionModule,
  ReportModule: ReportModule,
  Type: Type,
  Level: Level,
  moduleTypePathSegment: moduleTypePathSegment,
  levelPathSegment: levelPathSegment,
};
