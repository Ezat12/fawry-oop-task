var CarType;
(function (CarType) {
    CarType["PRIVATE"] = "Private";
    CarType["TRUCK"] = "Truck";
})(CarType || (CarType = {}));
var Car = /** @class */ (function () {
    function Car(plateNumber, carType) {
        this.plateNumber = plateNumber;
        this.carType = carType;
    }
    return Car;
}());
var Observation = /** @class */ (function () {
    function Observation(car, speed, date, seatBelt) {
        this.car = car;
        this.speed = speed;
        this.date = date;
        this.seatBelt = seatBelt;
    }
    return Observation;
}());
var RuleType;
(function (RuleType) {
    RuleType["TRUCK_SPEED"] = "Truck Speed";
    RuleType["PRIVATE_SPEED"] = "Private Speed";
    RuleType["SEAT_BELT"] = "Seat Belt";
})(RuleType || (RuleType = {}));
var Violation = /** @class */ (function () {
    function Violation(message, typeRule, fee) {
        this.message = message;
        this.typeRule = typeRule;
        this.fee = fee;
    }
    return Violation;
}());
var TruckSpeedRule = /** @class */ (function () {
    function TruckSpeedRule() {
    }
    TruckSpeedRule.prototype.check = function (observation) {
        if (observation.car.carType === CarType.TRUCK) {
            if (observation.speed > 60) {
                return new Violation("speed of ".concat(observation.speed, " exceeded max allowed 60"), RuleType.TRUCK_SPEED, 300);
            }
        }
        return null;
    };
    return TruckSpeedRule;
}());
var PrivateSpeedRule = /** @class */ (function () {
    function PrivateSpeedRule() {
    }
    PrivateSpeedRule.prototype.check = function (observation) {
        if (observation.car.carType === CarType.PRIVATE) {
            if (observation.speed > 80) {
                return new Violation("speed of ".concat(observation.speed, " exceeded max allowed 80"), RuleType.PRIVATE_SPEED, 300);
            }
        }
        return null;
    };
    return PrivateSpeedRule;
}());
var SeatBeltRule = /** @class */ (function () {
    function SeatBeltRule() {
    }
    SeatBeltRule.prototype.check = function (observation) {
        if (!observation.seatBelt) {
            return new Violation("Seatbelt not fastened", RuleType.SEAT_BELT, 100);
        }
        return null;
    };
    return SeatBeltRule;
}());
var Fine = /** @class */ (function () {
    function Fine(car, violations, totalFee) {
        this.car = car;
        this.violations = violations;
        this.totalFee = totalFee;
    }
    return Fine;
}());
var QuRadar = /** @class */ (function () {
    function QuRadar(rules) {
        this.rules = rules;
        this.fines = [];
        this.violationRulesCount = new Map();
    }
    QuRadar.prototype.handleObservation = function (observation) {
        var violations = [];
        var totalFee = 0;
        for (var _i = 0, _a = this.rules; _i < _a.length; _i++) {
            var rule = _a[_i];
            var violation = rule.check(observation);
            if (violation) {
                violations.push(violation);
                totalFee += violation.fee;
                this.violationRulesCount.set(violation.typeRule, (this.violationRulesCount.get(violation.typeRule) || 0) + 1);
            }
        }
        if (violations.length > 0) {
            this.fines.push(new Fine(observation.car, violations, totalFee));
        }
    };
    QuRadar.prototype.getAllPossibleFines = function () {
        return this.fines;
    };
    QuRadar.prototype.getAllViolationRulesCount = function () {
        return this.violationRulesCount;
    };
    return QuRadar;
}());
var car1 = new Car("ABC123", CarType.PRIVATE);
var observation1 = new Observation(car1, 90, new Date(), false);
var quRadar = new QuRadar([
    new TruckSpeedRule(),
    new PrivateSpeedRule(),
    new SeatBeltRule(),
]);
quRadar.handleObservation(observation1);
var fines = quRadar.getAllPossibleFines();
for (var fine = 0; fine < fines.length; fine++) {
    console.log("Fine ".concat(fine + 1));
    console.log("- Traffic fine for car ".concat(fines[fine].car.plateNumber));
    console.log("- Total amount: ".concat(fines[fine].totalFee, " EGP"));
    console.log("- Violations:");
    for (var _i = 0, _a = fines[fine].violations; _i < _a.length; _i++) {
        var vio = _a[_i];
        console.log("-- ".concat(vio.message, " : ").concat(vio.fee, " EGP"));
    }
}
