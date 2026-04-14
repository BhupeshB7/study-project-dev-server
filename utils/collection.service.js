export class CollectionService {
  static buildQuery(filter) {
    if (!filter) return {};

    if (filter.and) {
      return {
        $and: filter.and.map((item) =>
          this.buildCondition(item.field, item.op, item.value),
        ),
      };
    }

    if (filter.or) {
      return {
        $or: filter.or.map((item) =>
          this.buildCondition(item.field, item.op, item.value),
        ),
      };
    }

    return this.buildCondition(filter.field, filter.op, filter.value);
  }

  static buildSort(sort = []) {
    const sortObj = {};
    sort.forEach((item) => {
      sortObj[item.field] = item.dir === "asc" ? 1 : -1;
    });
    return sortObj;
  }

  static buildSelect(select) {
    return Array.isArray(select) ? select.join(" ") : "";
  }

  static getPagination(page = 1, limit = 24) {
    const skip = (page - 1) * limit;
    return { skip, limit };
  }

  static buildCondition(field, op, value) {
    const dateFields = [
      "createdAt",
      "updatedAt",
      "admissionDate",
      "joiningDate",
      "dob",
    ];

    if (
      dateFields.includes(field) &&
      op === "eq" &&
      typeof value === "string" &&
      /^\d{4}$/.test(value)
    ) {
      const year = parseInt(value, 10);
      return {
        [field]: {
          $gte: new Date(`${year}-01-01T00:00:00.000Z`),
          $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
        },
      };
    }

    switch (op) {
      case "eq":
        return { [field]: value };
      case "ne":
        return { [field]: { $ne: value } };
      case "gt":
        return { [field]: { $gt: value } };
      case "gte":
        return { [field]: { $gte: value } };
      case "lt":
        return { [field]: { $lt: value } };
      case "lte":
        return { [field]: { $lte: value } };
      case "contains":
        return { [field]: { $regex: value, $options: "i" } };
      case "in":
        return { [field]: { $in: Array.isArray(value) ? value : [value] } };
      case "between":
        if (Array.isArray(value) && value.length === 2) {
          return { [field]: { $gte: value[0], $lte: value[1] } };
        }
        return {};
      default:
        return {};
    }
  }
}
