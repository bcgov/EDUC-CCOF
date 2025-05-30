class MappableObject {
  constructor(input, mappings, from, to) {
    this.data = {};

    if (!input || !mappings) {
      return;
    }

    for (const item of mappings) {
      if (input[item[from]] !== undefined) {
        this.data[item[to]] = input[item[from]];
      }
    }
  }

  toJSON() {
    return this.data;
  }
}

class MappableObjectForFront extends MappableObject {
  constructor(input, mappings) {
    super(input, mappings, 'back', 'front');
  }
}

class MappableObjectForBack extends MappableObject {
  constructor(input, mappings) {
    super(input, mappings, 'front', 'back');

    const keys = Object.keys(this.data);
    for (let key of keys) {
      if (key.endsWith('@OData.Community.Display.V1.FormattedValue')) {
        delete this.data[key];
      }
    }
  }
}

/**
 * Dynamics can take a selector with a list of fields
 * Use this function to generate a list of fields based on mappings
 */
function getMappingString(mappings) {
  let retVal = mappings
    .map((item) => {
      return item.back;
    })
    .join(',');
  return retVal;
}

module.exports = {
  MappableObjectForFront,
  MappableObjectForBack,
  getMappingString,
};
