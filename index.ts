enum CarType {
  PRIVATE = "Private",
  TRUCK = "Truck",
}

class Car {
  constructor(
    public plateNumber: string,
    public carType: CarType,
  ) {}
}

class Observation {
  constructor(
    public car: Car,
    public speed: number,
    public date: Date,
    public seatBelt: boolean,
  ) {}
}

enum RuleType {
  TRUCK_SPEED = "Truck Speed",
  PRIVATE_SPEED = "Private Speed",
  SEAT_BELT = "Seat Belt",
}

class Violation {
  constructor(
    public message: string,
    public typeRule: RuleType,
    public fee: number,
  ) {}
}
interface Rule {
  check(observation: Observation): Violation | null;
}

class TruckSpeedRule implements Rule {
  check(observation: Observation): Violation | null {
    if (observation.car.carType === CarType.TRUCK) {
      if (observation.speed > 60) {
        return new Violation(
          `speed of ${observation.speed} exceeded max allowed 60`,
          RuleType.TRUCK_SPEED,
          300,
        );
      }
    }
    return null;
  }
}

class PrivateSpeedRule implements Rule {
  check(observation: Observation): Violation | null {
    if (observation.car.carType === CarType.PRIVATE) {
      if (observation.speed > 80) {
        return new Violation(
          `speed of ${observation.speed} exceeded max allowed 80`,
          RuleType.PRIVATE_SPEED,
          300,
        );
      }
    }
    return null;
  }
}

class SeatBeltRule implements Rule {
  check(observation: Observation): Violation | null {
    if (!observation.seatBelt) {
      return new Violation("Seatbelt not fastened", RuleType.SEAT_BELT, 100);
    }
    return null;
  }
}

class Fine {
  constructor(
    public car: Car,
    public violations: Violation[],
    public totalFee: number,
  ) {}
}

class QuRadar {
  private fines: Fine[] = [];
  private violationRulesCount: Map<RuleType, number> = new Map();
  constructor(private rules: Rule[]) {}

  handleObservation(observation: Observation): void {
    let violations: Violation[] = [];
    let totalFee = 0;
    for (const rule of this.rules) {
      const violation = rule.check(observation);
      if (violation) {
        violations.push(violation);
        totalFee += violation.fee;
        this.violationRulesCount.set(
          violation.typeRule,
          (this.violationRulesCount.get(violation.typeRule) || 0) + 1,
        );
      }
    }

    if (violations.length > 0) {
      this.fines.push(new Fine(observation.car, violations, totalFee));
    }
  }

  getAllPossibleFines(): Fine[] {
    return this.fines;
  }

  getAllViolationRulesCount() {
    return this.violationRulesCount;
  }
}

const car1 = new Car("ABC123", CarType.PRIVATE);
const observation1 = new Observation(car1, 90, new Date(), false);

const quRadar = new QuRadar([
  new TruckSpeedRule(),
  new PrivateSpeedRule(),
  new SeatBeltRule(),
]);

quRadar.handleObservation(observation1);

const fines = quRadar.getAllPossibleFines();

for (let fine = 0; fine < fines.length; fine++) {
  console.log(`Fine ${fine + 1}`);
  console.log(`- Traffic fine for car ${fines[fine].car.plateNumber}`);
  console.log(`- Total amount: ${fines[fine].totalFee} EGP`);
  console.log(`- Violations:`);
  for (let vio of fines[fine].violations) {
    console.log(`-- ${vio.message} : ${vio.fee} EGP`);
  }
}
