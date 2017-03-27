function createConstants(constantNames) {
    const obj = {};

    for(const constantName of constantNames) {
        obj[constantName] = Symbol(constantName);
    }

    return obj;
}

