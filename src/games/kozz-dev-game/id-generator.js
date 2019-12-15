const max = 999999999999;
function generateId() {
    return "U"+Math.floor(Math.random() * Math.floor(max));
}

module.exports = generateId;
