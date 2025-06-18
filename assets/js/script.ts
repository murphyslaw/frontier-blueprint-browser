import { durationFormat, volumeFormat } from "../../lib/format.ts";

function updateElements(root: HTMLElement, attribute: 'quantity' | 'duration' | 'volume' | 'mass', runs: number, cb: (value: number) => string) {
  const elements = root.querySelectorAll<HTMLElement>(`[data-${attribute}]`) ?? [];

  for (const element of elements) {
    let value = Number(element.dataset[attribute]);
    value *= runs;
    element.textContent = cb(value);

    if (attribute === 'volume') {
      if (value > 990) {
        element.classList.add('critical');
      } else if (value > 520) {
        element.classList.add('warning');
      } else {
        element.classList.remove('critical', 'warning');
      }
    }
  }
}

function runsChangeHandler(event: Event) {
  const input: HTMLInputElement = event.currentTarget as HTMLInputElement;
  const blueprintWrapper = input.closest<HTMLElement>('[data-blueprintTypeID]');

  if (!blueprintWrapper) return;

  updateElements(blueprintWrapper, 'quantity',Number(input.value), (value) => String(value));
  updateElements(blueprintWrapper, 'duration',Number(input.value), (value) => durationFormat(value));
  updateElements(blueprintWrapper, 'volume',Number(input.value), (value) => volumeFormat(value));
  updateElements(blueprintWrapper, 'mass',Number(input.value), (value) => String(value));
}

function searchChangeHandler(event: Event) {
  const inputElement: HTMLInputElement = event.currentTarget as HTMLInputElement;
  const typeElements = document.querySelectorAll<HTMLDetailsElement>('[data-name]');

  const activeGroups = new Set<string>();

  for (const typeElement of typeElements) {
    const name = typeElement.dataset.name;

    if (!name) continue;

    if (fuzzySearch(name, inputElement.value)) {
      typeElement.style.display = 'block';

      const groupElement = typeElement.closest<HTMLElement>('[data-group]');
      const groupName = groupElement?.dataset?.group;

      if (groupName) {
        activeGroups.add(groupName);
      }
    } else {
      typeElement.style.display = 'none';
    }
  }

  const groupElements = document.querySelectorAll<HTMLElement>('[data-group]');

  for (const groupElement of groupElements) {
    const groupName = groupElement?.dataset?.group;
    if (groupName && activeGroups.has(groupName)) {
      groupElement.style.display = 'block';
    } else {
      groupElement.style.display = 'none';
    }
  }
}

// see https://learnersbucket.com/examples/interview/implement-a-fuzzy-search-in-javascript/
function fuzzySearch(str: string, query: string): boolean {
  // convert the query and str
  // for case-insensitive search
  str = str.toLowerCase();
  query = query.toLowerCase();

  // use two variables to track the
  // current character
  // and last searched position in the string
  let i = 0, lastSearched = -1, current = query[i];
  while (current) {
     // if the character is not present
     // return false
     if (!~(lastSearched = str.indexOf(current, lastSearched + 1))){
        return false;
     };

     current = query[++i];
  };

  // if the search completes
  // return true
  return true;
};

document.addEventListener('DOMContentLoaded', function() {
  const runsInputs = document.querySelectorAll<HTMLInputElement>('input[id^="runs-"]');

  for (const input of runsInputs) {
    input.addEventListener("change", runsChangeHandler)
  }

  const searchInput = document.querySelector<HTMLInputElement>('input#search');
  searchInput?.addEventListener("input", searchChangeHandler);
});
