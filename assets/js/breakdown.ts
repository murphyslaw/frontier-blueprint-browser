import { Blueprint } from "../../lib/Blueprint.ts";
import { BlueprintDB } from "../../lib/BlueprintDB.ts";
import { massFormat, volumeFormat } from "../../lib/format.ts";
import { Plan, ProductionPlan } from "../../lib/ProductionPlan.ts";
import { Refinery } from "../../lib/Refinery.ts";
import { StructureDB } from "../../lib/StructureDB.ts";
import { TypeDB } from "../../lib/TypeDB.ts";
import { Blueprints, Structures, Types } from "../../types/types.d.ts";

const Storage = {
  set(key: string, value: unknown): void {
    localStorage[key] = JSON.stringify(value);
  },

  get<T>(key: string): T | null {
    const value: T | null = localStorage[key]
      ? JSON.parse(localStorage[key])
      : null;

    return value;
  },
};

async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}: ${url}`);
  }

  const json: T = await response.json();

  return json;
}

function appendPlan(wrapper: HTMLElement, plan: Plan) {
  const table = document.createElement("table");
  const tbody = document.createElement("tbody");

  table.appendChild(tbody);

  for (const data of Object.values(plan)) {
    const tr = document.createElement("tr");

    const tdQuantity = document.createElement("td");
    const spanQuantity = document.createElement("span");
    spanQuantity.innerText = String(data.quantity);
    spanQuantity.dataset.quantity = String(data.quantity);

    tdQuantity.appendChild(spanQuantity);
    tdQuantity.append("x");

    tr.appendChild(tdQuantity);

    const tdName = document.createElement("td");
    const divName = document.createElement("div");
    divName.style = "display: flex; align-items: center; gap: 0.5rem;";
    const imgName = document.createElement("img");
    imgName.src = `/assets/images/type-${data.type.iconID}.png`;

    divName.appendChild(imgName);
    divName.append(String(data.type.typeName));

    tdName.appendChild(divName);

    tr.appendChild(tdName);

    const tdVolume = document.createElement("td");
    const spanVolumeWrapper = document.createElement("span");
    const spanVolume = document.createElement("span");
    spanVolume.innerText = volumeFormat(data.quantity * data.type.volume);
    spanVolume.dataset.volume = String(data.quantity * data.type.volume);
    const abbrVolume = document.createElement("abbr");
    abbrVolume.title = "cubic meters";
    abbrVolume.innerText = "m";
    const supVolume = document.createElement("sup");
    supVolume.innerText = "3";

    abbrVolume.appendChild(supVolume);

    spanVolumeWrapper.appendChild(spanVolume);
    spanVolumeWrapper.appendChild(abbrVolume);

    tdVolume.appendChild(spanVolumeWrapper);

    tr.appendChild(tdVolume);

    const tdMass = document.createElement("td");
    const spanMassWrapper = document.createElement("span");
    const spanMass = document.createElement("span");
    spanMass.innerText = massFormat(data.quantity * data.type.mass);
    spanMass.dataset.Mass = String(data.quantity * data.type.mass);
    const abbrMass = document.createElement("abbr");
    abbrMass.title = "kilograms";
    abbrMass.innerText = "kg";

    spanMassWrapper.appendChild(spanMass);
    spanMassWrapper.appendChild(abbrMass);

    tdMass.appendChild(spanMassWrapper);

    tr.appendChild(tdMass);

    tbody.appendChild(tr);
  }

  const breakdownWrapper = wrapper.querySelector<HTMLElement>("#breakdown");

  console.log(breakdownWrapper);
  breakdownWrapper?.appendChild(table);
}

function clickHandler(event: Event): void {
  const button: HTMLButtonElement = event.currentTarget as HTMLButtonElement;
  if (!button) return;

  const blueprintsJSON = Storage.get<Blueprints>("blueprints");
  if (!blueprintsJSON) return;
  const blueprintDB = BlueprintDB.fromJSON(blueprintsJSON);

  const typesJSON = Storage.get<Types>("types");
  if (!typesJSON) return;
  const typeDB = TypeDB.fromJSON(typesJSON);

  const structuresJSON = Storage.get<Structures>("structures");
  if (!structuresJSON) return;
  const structureDB = StructureDB.fromJSON(structuresJSON);

  const blueprintWrapper = button.closest<HTMLElement>(
    "[data-typeID]",
  );
  const typeID = blueprintWrapper?.dataset.typeid;
  if (!typeID) return;

  const blueprint = blueprintDB.findByOutput(Number(typeID))[0];

  const refinery = new Refinery(
    structureDB.find({ types: ["refinery"] }).map((r) => r.blueprintTypeIDs)
      .flat(),
    blueprintDB,
  );

  const structures = structureDB.find({
    types: ["printer", "assembler", "shipyard"],
  });

  const blueprints: Blueprint[] = structures.map((structure) =>
    blueprintDB.find({ blueprintTypeIDs: structure.blueprintTypeIDs })
  ).flat();

  const productionPlan = new ProductionPlan(
    blueprint,
    refinery,
    blueprintDB,
    blueprints,
    typeDB,
  );

  const plan = productionPlan.execute();

  console.table(plan);

  appendPlan(blueprintWrapper, plan);
}

// document.addEventListener("DOMContentLoaded", () => {
//   fetchData<Blueprints>(
//     new URL("/assets/data/blueprints.json", location.origin).href,
//   ).then((blueprints) => Storage.set("blueprints", blueprints));

//   fetchData<Types>(new URL("/assets/data/types.json", location.origin).href)
//     .then((types) => Storage.set("types", types));

//   fetchData<Structures>(
//     new URL("/assets/data/structures.json", location.origin).href,
//   ).then((structures) => Storage.set("structures", structures));

//   const buttons = document.querySelectorAll<HTMLButtonElement>(
//     "#breakdown > button",
//   );

//   for (const button of buttons) {
//     button.addEventListener("click", clickHandler);
//   }
// });
