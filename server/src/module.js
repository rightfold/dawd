'use strict';

function ReportModule(name, level, render) {
  this.name = name;
  this.level = level;
  this.render = render;
}

var Level = {
  System: 0,
  Application: 1,
  Installation: 2,
};

module.exports = {
  ReportModule: ReportModule,
  Level: Level,
};
