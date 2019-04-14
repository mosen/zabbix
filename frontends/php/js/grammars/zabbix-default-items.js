var items = {
  'agent.hostname': {
    "title": "Agent host name",
    "type": "string",
    "description": "Returns the actual value of the agent hostname from a configuration file"
  },
  'agent.ping': {
    "title": "Agent availability check.",
    "type": "boolean",
    "description": "Use the nodata() trigger function to check for host unavailability."
  },
  'agent.version': {
    "title": "Version of Zabbix agent.",
    "type": "string",
    "description": "Example of returned value: '1.8.2'"
  },
  'kernel.maxfiles': {
    "title": "Maximum number of opened files supported by OS.",
    "type": "int",
    "description": ""
  },
  'kernel.maxproc': {
    "title": "Maximum number of processes supported by OS.",
    "type": "int",
    "description": ""
  },
  'log': {
    "title": "Log file monitoring.",
    "description": "The item must be configured as an active check.\n" +
      "If file is missing or permissions do not allow access, item turns unsupported.",
    "args": [
      { name: "file", "title": "full path and name of log file" },
      { name: "<regexp>", "title": "regular expression describing the required pattern" },
      { name: "<encoding>", "title": "code page identifier" },
      { name: "<maxlines>", "title": "maximum number of new lines per second the agent will send to Zabbix server or proxy." }
    ]
  },
  "log.count": {
    "title": "Count of matched lines in log file monitoring.",
    "args": [
      { name: "file", "title": "full path and name of log file" },
      { name: "<regexp>", "title": "regular expression describing the required pattern" },
      { name: "<encoding>", "title": "code page identifier" },
      { name: "<maxproclines>", "title": "maximum number of new lines per second the agent will send to Zabbix server or proxy." },
      { name: "<mode>", "title": "all (default), skip - skip processing of older data (affects only newly created items)" },
      { name: "<maxdelay>", "title": "maximum delay in seconds." }
    ]
  },
  "logrt": {
    "title": "Log file monitoring with log rotation support."
  },
  "logrt.count": {
    "title": "Count of matched lines in log file monitoring with log rotation support."
  },
  "net.dns": {

  },
  "net.dns.record": {

  },
  "net.if.collisions": {

  },
  "net.if.discovery": {

  },
  "net.if.in": {

  },
  "net.if.out": {

  },
  "net.if.total": {

  },
  "net.tcp.listen": {

  },
  "net.tcp.port": {

  },
  "net.tcp.service": {

  },
  "net.tcp.service.perf": {

  },
  "net.udp.listen": {

  },
  "net.udp.service": {

  },
  "net.udp.service.perf": {

  },
  "proc.cpu.util": {

  },
  "proc.mem": {

  },
  "proc.num": {

  },
  "sensor": {

  },
  "system.boottime": {

  },
  "system.cpu.discovery": {

  },
  "system.cpu.intr": {

  },
  "system.cpu.load": {

  },
  "system.cpu.num": {

  },
  "system.cpu.switches": {

  },
  "system.cpu.util": {

  },
  "system.hostname": {

  },
  "system.hw.chassis": {

  },
  "system.hw.cpu": {

  },
  "system.hw.devices": {

  },
  "system.hw.macaddr": {

  },
  "system.localtime": {

  },
  "system.run": {

  },
  "system.stat": {

  },
  "system.sw.arch": {

  },
  "system.sw.os": {

  },
  "system.sw.packages": {

  },
  "system.swap.in": {

  },
  "system.swap.out": {

  },
  "system.swap.size": {

  },
  "system.uname": {

  },
  "system.uptime": {

  },
  "system.users.num": {

  },
  "vfs.dev.read": {

  },
  "vfs.dev.write": {

  },
  "vfs.dir.count": {

  },
  "vfs.dir.size": {

  },
  "vfs.file.cksum": {

  },
  "vfs.file.contents": {

  },
  "vfs.file.exists": {

  },
  "vfs.file.md5sum": {

  },
  "vfs.file.regexp": {

  },
  "vfs.file.regmatch": {

  },
  "vfs.file.size": {

  },
  "vfs.file.time": {

  },
  "vfs.fs.discovery": {

  },
  "vfs.fs.inode": {

  },
  "vfs.fs.size": {

  },
  "vm.memory.size": {

  },
  "web.page.get": {

  },
  "web.page.perf": {

  },
  "web.page.regexp": {

  },
  "zabbix.stats": {

  }
};

var functions = [
  "abschange",
  "avg",
  "band",
  "change",
  "count",
  "date",
  "dayofmonth",
  "delta",
  "diff",
  "forecast",
  "fuzzytime",
  "iregexp",
  "last",
  "logeventid",
  "logseverity",
  "logsource",
  "max",
  "min",
  "nodata",
  "now",
  "percentile",
  "prev",
  "regexp",
  "str",
  "strlen",
  "sum",
  "time",
  "timeleft"
];

// https://www.zabbix.com/documentation/4.2/manual/appendix/macros/supported_by_location
var macros = {
  "ACTION.ID": {},
  "ACTION.NAME": {},
  "ALERT.MESSAGE": {},
  "ALERT.SENDTO": {},
  "ALERT.SUBJECT": {},
  "DATE": {},
  "DISCOVERY.DEVICE.IPADDRESS": {},
  "DISCOVERY.DEVICE.DNS": {},
  "DISCOVERY.DEVICE.STATUS": {},
  "DISCOVERY.DEVICE.UPTIME": {},
  "DISCOVERY.RULE.NAME": {}
};

var suggestions = {
  "items": items,
  "functions": functions
};