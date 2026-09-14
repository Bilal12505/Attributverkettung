import {Loader} from './loader.js';

class DropdownBuilder {
  constructor(modus) {
    this.loadScreen = new Loader();
    this.modus = modus;
  }

  async processAttributeChaining() {
    await this.loadScreen.showLoader();
    await this.chainAttributes();
    await this.loadScreen.hideLoader();
  }

  async buildDropdown() {
    const properties = await this.getProperties();
    this.addAttribute(properties);
  }

  async getProperties() {
    const domain = document.querySelector('.domain');
    const propertyType = await desiteAPI.getPropertyTypeList(`${domain.value}`);
    const properties = propertyType.map((property) =>
      property.Name.replace(/"/g, '')
    );
    return properties;
  }

  async addAttribute(properties) {
    properties.sort();
    const attributeSection = document.querySelector('.main-attributes');
    if (!attributeSection) return;

    const select = document.createElement('select');
    select.className = 'dropdown';

    select.innerHTML = properties
      .map((prop) => `<option>${prop}</option>`)
      .join('');

    attributeSection.appendChild(select);

    const domain = document.querySelector('.domain');
    domain.disabled = true;
  }

  async removeAttribute() {
    const domain = document.querySelector('.domain');
    const dropdowns = document.querySelectorAll('.dropdown');
    if (dropdowns.length) {
      dropdowns[dropdowns.length - 1].remove();
      dropdowns.length === 1 ? domain.disabled = false : domain.disabled = true;
    }
  }

  async chainAttributes() {
    const domainValue = document.querySelector('.domain').value;
    const separatorValue = document.querySelector('.seperator').value;
    const attributes = [...document.querySelectorAll('.dropdown')].map(attr => attr.value);
    const inputValue = document.querySelector('.attribute-name').value;

    const elements = this.modus === "all"
        ? await desiteAPI.getAllElements(domainValue)
        : await desiteAPI.getSelectedElements(domainValue);

    for (let i = 0; i < elements.length; i++) {
        const propertyValues = await Promise.all(attributes.map(async (attribute) => {
            const propertyType = await desiteAPI.getPropertyTypeList(domainValue, attribute);
            return desiteAPI.getPropertyValue(elements[i], attribute, propertyType[0].DataType);
        }));

        const linkedValue = propertyValues.join(separatorValue);
        await desiteAPI.setPropertyValue(elements[i], inputValue, 'xs:string', linkedValue);

        console.log(`Bauteil ${i + 1} von ${elements.length} abgeschlossen`);
    }
}

  
  
}

const buttonAdd = document.querySelector('.main-buttons-add');
buttonAdd.addEventListener('click', () =>
  new DropdownBuilder().buildDropdown()
);

const buttonRemove = document.querySelector('.main-buttons-remove');
buttonRemove.addEventListener('click', () =>
    new DropdownBuilder().removeAttribute()
);

const buttonExecution = document.querySelectorAll('.button-execution');
buttonExecution[0].addEventListener('click', () =>
    new DropdownBuilder("all").processAttributeChaining()
);

buttonExecution[1].addEventListener('click', () =>
    new DropdownBuilder("selected").processAttributeChaining()
);