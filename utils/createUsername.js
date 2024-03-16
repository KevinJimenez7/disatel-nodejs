function createUsername (firstName, lastName){
    return firstName.trim()[0] + lastName.trim()
}

module.exports = createUsername