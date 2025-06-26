import { greaterEq, Model, solve } from "npm:yalps";
import { Blueprint, Material, Requirements } from "./Blueprint.ts";
import { BlueprintDB } from "./BlueprintDB.ts";
import { Refinery, ResourceTypeID } from "./Refinery.ts";
import { Type } from "./Type.ts";
import { TypeDB } from "./TypeDB.ts";

export type Plan = Record<
  string,
  { quantity: number; typeID?: number; type: Type }
>;

export class ProductionPlan {
  private model: Model;

  constructor(
    blueprint: Blueprint,
    private refinery: Refinery,
    private blueprintDB: BlueprintDB,
    private blueprints: Blueprint[],
    private typeDB: TypeDB,
  ) {
    // Collect requirements for given blueprint
    const requirements: Requirements = this.getRequirements(blueprint);

    // Build constraints for each material
    const constraints: Record<Material, ReturnType<typeof greaterEq>> = {};
    for (const [typeId, quantity] of Object.entries(requirements)) {
      constraints[typeId] = greaterEq(quantity);
    }

    const variables: Record<
      ResourceTypeID,
      Record<Material | "total", number>
    > = {};

    // Build variables for all refineries and their blueprints
    Object.entries(this.refinery.resources).map(
      ([blueprintTypeID, resourceDefinition]) => {
        // Initialize with a "total" field for minimization, where the total is
        // based on the cost of the resources
        const total = resourceDefinition.cost;
        const data: Record<Material | "total", number> = { total };

        for (const material in requirements) {
          data[material] = resourceDefinition.produces[material] || 0;
        }

        variables[blueprintTypeID] = data;
      },
    );

    // Build variables for each type, but adjust their cost so
    // that blueprints are preferred if possible
    this.typeDB.all().forEach((item) => {
      const typeID: string = String(item.typeID);
      variables[typeID] = { [typeID]: 1, total: Number.MAX_SAFE_INTEGER };
    });

    // Build the model
    this.model = {
      direction: "minimize" as const,
      objective: "total",
      constraints,
      variables,
      integers: true,
    };

    console.log(this.model);
  }

  private getRequirements(
    blueprint: Blueprint,
    requirements: Requirements = {},
    runs: number = 1,
  ): Requirements {
    for (const input of blueprint.inputs) {
      const typeID = input.typeID;

      // Find blueprint that produces this material
      const producer = this.blueprints.find((blueprint) =>
        blueprint.outputs.some((output) => output.typeID === typeID)
      );

      if (producer) {
        requirements = this.getRequirements(
          producer, // TODO: what is the best blueprint to choose, to not use hard-coded first
          requirements,
          input.quantity * runs,
        );
      } else {
        requirements[String(typeID)] = (requirements[String(typeID)] || 0) +
          input.quantity * runs;
      }
    }

    return requirements;
  }

  public execute(): Plan {
    const solution = solve(this.model);

    const variables = solution.variables.reduce<Plan>(
      (acc, [variable, coefficient]) => {
        const typeID = Number(variable);
        const type = this.typeDB.get(typeID);

        if (type) {
          acc[typeID] = {
            quantity: coefficient,
            type,
            typeID: Number(variable),
          };
        } else {
          const blueprint = this.blueprintDB.get(typeID);

          if (!blueprint) {
            throw new Error(`neither type nor blueprint "${typeID}"`);
          }

          blueprint.inputs.forEach((input) => {
            const inputType = this.typeDB.get(input.typeID);
            if (!inputType) return;

            acc[String(inputType.typeID)] = {
              quantity: coefficient * input.quantity,
              type: inputType,
              typeID: blueprint.blueprintTypeID,
            };
          });
        }

        return acc;
      },
      {},
    );

    return variables;
  }
}
