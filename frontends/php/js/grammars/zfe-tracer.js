/**
 * This tracer should contain the functionality necessary for auto-suggest to make a reasonable suggestion about the
 * next section of a trigger expression.
 *
 * Trying to use the rightmost match for auto suggest
 *
 * @constructor
 */
function ZFETracer() {
    this.indentLevel = 0;
    this.lastMatch = null;
    this.rightMostMatch = [0, null];
    this.lastFail = [0, null];
    this.matches = [];
}

ZFETracer.prototype.trace = function (event) {
    var that = this;

    function log(event) {
        function repeat(string, n) {
            var result = "", i;

            for (i = 0; i < n; i++) {
                result += string;
            }

            return result;
        }

        function pad(string, length) {
            return string + repeat(" ", length - string.length);
        }

        if (typeof console === "object") {
            console.log(
                event.location.start.line + ":" + event.location.start.column + "-"
                + event.location.end.line + ":" + event.location.end.column + " "
                + pad(event.type, 10) + " "
                + repeat("  ", that.indentLevel) + event.rule
            );
        }
    }

    switch (event.type) {
        case "rule.enter":
            // log(event);
            this.indentLevel++;
            break;

        case "rule.match":
            this.indentLevel--;
            // log(event);
            this.lastMatch = event;
            if (event.location.end.column > this.rightMostMatch[0]) {
                this.rightMostMatch = [event.location.end.column, event];
            }
            this.matches.push(event);
            break;

        case "rule.fail":
            // if (this.indentLevel > this.lastFail[0]) { this.lastFail = [this.indentLevel, event]; }
            this.indentLevel--;
            // log(event);
            break;

        default:
            throw new Error("Invalid event type: " + event.type + ".");
    }
};

ZFETracer.prototype.clearMatches = function() {
    this.matches = [];
    this.lastMatch = null;
    this.lastFail = [0, null];
    this.rightMostMatch = [0, null];
};
