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
  }
}

module.exports = {
  MappableObjectForFront,
  MappableObjectForBack
};
