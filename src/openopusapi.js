"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Composer = void 0;
var Composer = /** @class */ (function () {
    function Composer() {
    }
    Composer.prototype.getBirthDate = function () {
        return new Date(this.birth);
    };
    Composer.prototype.getDeathDate = function () {
        if (this.death == null)
            return new Date(); //if alive use today date
        else
            return new Date(this.death);
    };
    return Composer;
}());
exports.Composer = Composer;
//# sourceMappingURL=openopusapi.js.map