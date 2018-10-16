const { Subject } = require('rxjs');

const deserializeArgs = require('./deserializeArgs');

function nodePlugin() {
    this.add('role:fw,cmd:createActor', (msg, response) => {
        this.act('role:fw,cmd:createSubject',msg, (err, resolve) => {
            console.log("reponse from createSubject : ", resolve);
        });
        response(null, {answer: 'ok'});
    });


    this.add('role:fw,cmd:createSubject', (msg, response) => {
        const m = deserializeArgs(msg);
        const s = new Subject();

        const arr1 = m.operations.map(o => {
            const op = require('rxjs/operators')[o.operator];
            return op.apply(op, o.args); // filter(i => i%2 === 0)
        });

        s.pipe.apply(s, arr1).subscribe(console.log, console.log);

        m.values.forEach(i => s.next(i));

        s.complete();
        response(null, { answer: 'executed create subject' });
    });
}

module.exports = nodePlugin;
