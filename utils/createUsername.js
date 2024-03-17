function createUsername (firstName, lastName){
    return firstName.trim()[0] + lastName.replace(/\s/g, "")
}

module.exports = createUsername