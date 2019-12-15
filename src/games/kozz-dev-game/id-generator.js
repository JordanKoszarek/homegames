const max = 25;
function generateId() {
    return "U"+Math.floor(Math.random() * Math.floor(max));
}

module.exports = generateId;
