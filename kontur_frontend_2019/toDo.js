String.prototype.count = function(string) {
    return (this.length - this.replace(new RegExp(string, 'g'), '').length);
};

class ToDo {
    constructor(toDo, fileName) {
        return {
            'importance': toDo.length === 3 ? toDo[2].count('!') : toDo[0].count('!'),
            'user': toDo.length === 3 ? toDo[0].trim() : '',
            'date': toDo.length === 3 ? toDo[1].trim() : '',
            'comment': toDo.length === 3 ? toDo[2].trim() : toDo[0].trim(),
            'fileName': fileName
        }
    }

    static getRegexp() {
        return /(?<=[/]{2}\s*todo\s*:?\s*)[^\n]*/gmi;
    }

    static importanceFilter(element) {
        return element['importance'];
    }

    static userFilter(user) {
        return element => element['user'].toLowerCase() === user.toLowerCase();
    }

    static dateFilter(date) {
        return (toDo) => {
            if (toDo['date']) {
                const tDate = new Date(toDo['date']);
                return tDate.toString() !== 'Invalid Date' ?  tDate >= date : false;
            }

            return false;
        }
    }

    static dateSorter(toDo1, toDo2) {
        const date1 = new Date(toDo1['date']);
        const date2 = new Date(toDo2['date']);

        return date1.toString() === 'Invalid Date'
            ? date2.toString() === 'Invalid Date' ? 0 : 1
            : date2.toString() === 'Invalid Date' ? -1: date2 - date1;
    }

    static userSorter(toDo1, toDo2) {
        return toDo1['user']
            ? toDo2['user'] ? toDo1['user'].localeCompare(toDo2['user']) : -1
            : toDo2['user'] ? 1 : 0;
    }

    static importanceSorter(toDo1, toDo2) {
        return toDo2['importance'] - toDo1['importance'];
    }
}

module.exports = {
    ToDo,
};
