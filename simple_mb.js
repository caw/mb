/**
 * Created by chriswri on 18/03/15.
 */

(function () {

    var SEC_IN_MIN = 60

    // The flows need to be in L/s, and the values for 'ra' and 'rv' need to be modified accordingly
    var circ = {
        fa: 5.0 / SEC_IN_MIN,
        fv: 5.0 / SEC_IN_MIN,
        fc: 5.0 / SEC_IN_MIN,

        va: 0.85,
        vv: 3.25,
        vra: 0.1,

        ca: 0.00355,
        cv: 0.0825,
        cra: 0.005,

        ra: 19.34 * SEC_IN_MIN,
        rv: 0.74 * SEC_IN_MIN,

        pa: 100,
        pv: 3.7,
        pra: 0.0,

        dva: 0.0,
        dvv: 0.0,
        dvra: 0.0,

        vao: 0.495,
        vvo: 2.95,
        vrao: 0.1,
        vae: 0.355,
        vve: 0.3,
        vrae: 0.0,

        pga: 96.3,
        pgv: 3.7,

        fan: 5.0 / SEC_IN_MIN,
        hs: 1.0,

        dt: 0.05,


        starling: function (pra) {
            var r2 = 6 * (pra + 4);
            var r3 = Math.pow(r2, 2.5);
            var r4 = (r3 / (5000 + r3)) * 13 + 0.5;
            return r4 / SEC_IN_MIN;
        },

        iterate: function (n) {
            var i;
            for (i = 0; i < n; i++) {
                this.vrae = this.vra - this.vrao;
                this.pra = this.vrae / this.cra;
                this.fan = this.starling(this.pra);
                this.fa = this.fan * this.hs;
                this.dva = this.fa - this.fc;
                this.vae = this.va - this.vao;
                this.pa = this.vae / this.ca;
                this.pga = this.pa - this.pv;
                this.fc = this.pga / this.ra;
                this.dvv = this.fc - this.fv;
                this.vve = this.vv - this.vvo;
                this.pv = this.vve / this.cv;
                this.pgv = this.pv - this.pra;
                this.fv = this.pgv / this.rv;
                this.dvra = this.fv - this.fa;

                this.va = this.va + this.dva * this.dt;
                this.vv = this.vv + this.dvv * this.dt;
                this.vra = this.vra + this.dvra * this.dt;

		console.log(this.pa);
            }
        }
    }

    console.log(circ);
    circ.iterate(20);
    console.log(circ.pa);
    circ.vvo = 3.5
    circ.iterate(20);
    console.log(circ.pa);
    
/*
    var canvas = new fabric.Canvas('c');

    canvas.on('mouse:down', function (options) {
        if (options.target) {
            if (options.target.id) {
                console.log(options.target.id);
                (deltaFunctions[options.target.id])();
            };
        };
    });

    var deltaFunctions = {
        ra_dec: function () {
            console.log('ra_dec');
            if (circ.ra > 1) {
                circ.ra -= 0.5;
            };
            canvas.renderAll();
        },
        ra_inc: function () {
            console.log('ra_inc');
            if (circ.ra < 30) {
                circ.ra += 0.5;
            };
            canvas.renderAll();
        },
        vvo_dec: function () {
            console.log('vvo_dec');
            if (circ.vvo > 0.2) {
                circ.vvo -= 0.05;
            };
            canvas.renderAll()
        },
        vvo_inc: function () {
            console.log('vvo_inc');
            if (circ.vvo < 6.0) {
                circ.vvo += 0.05;
            };
            canvas.renderAll();
        },
        hs_dec: function () {
            console.log('hs_dec' + circ.hs);
            if (circ.hs > 0) {
                circ.hs -= 0.05;
            };
            if (circ.hs <= 0) {
                circ.hs = 0;
            };
            console.log('hs_dec' + circ.hs);
            canvas.renderAll();
        },
        hs_inc: function () {
            console.log('hs_inc');
            if (circ.hs < 3.0) {
                circ.hs += 0.05;
            };
            canvas.renderAll();
        },

        run_toggle: function () {
            if (running) {
                console.log('pausing');
                running = false;
                run.set({text: "Resume"});
            } else {
                console.log('resuming');
                running = true;
                run.set({text: "Pause"});
            };
            canvas.renderAll();
        }
    };

    fabric.loadSVGFromURL('images/circ_image.svg', function(objects, options) {
        var circ_image = fabric.util.groupSVGElements(objects, options);
        var scale = 1.5
        circ_image.set({
            left: (canvas.width - scale * circ_image.width) / 2,
            top: (canvas.height - scale * circ_image.height) / 2 - 100,
            scaleX: scale,
            scaleY: scale,
            selectable: false
        });
        canvas.add(circ_image);
        canvas.sendToBack(circ_image);
        canvas.calcOffset();
        canvas.renderAll();
    });

    var ra = new fabric.Text("RA: " + circ.ra.toFixed(2), {
        left: 320,
        top: 440,
        fontFamily: 'Verdana',
        fontSize: 32,
        stroke: '#00FF00',
        textDecoration: 'underline',
        selectable: false
    });

    var ra_dec = new fabric.Text("_", {
        left: 320,
        top: 460,
        fontFamily: 'Verdana',
        fontSize: 32,
        selectable: false,
        id: "ra_dec"
    });

    var ra_inc = new fabric.Text("+", {
        left: 465,
        top: 470,
        fontFamily: 'Verdana',
        fontSize: 32,
        selectable: false,
        id: "ra_inc"
    });

    var vrae = new fabric.Text(circ.vrae.toFixed(1), {
        left: 100,
        top: 100,
        fontFamily: 'Verdana'
    });

    var vra = new fabric.Text(circ.vra.toFixed(1), {
        left: 100,
        top: 100,
        fontFamily: 'Verdana'
    });

    var pra = new fabric.Text("PRA: " + circ.pra.toFixed(0), {
        left: 180,
        top: 20,
        fontSize: 32,
        fontFamily: 'Verdana',
        stroke: '#0000FF',
        selectable: false

    });

    var fa = new fabric.Text(circ.fa.toFixed(1), {
        left: 370,
        top: 50,
        fontSize: 32,
        fontFamily: 'Verdana',
        stroke: '#0000FF',
        selectable: false
    });

    var fv = new fabric.Text("VR: " + circ.fv.toFixed(1), {
        left: 10,
        top: 280,
        fontSize: 32,
        fontFamily: 'Verdana',
        stroke: '#0000FF',
        selectable: false
    });

    var vae = new fabric.Text(circ.vae.toFixed(1), {
        left: 100,
        top:100,
        fontFamily: 'Verdana'
    });

    var vve = new fabric.Text("VVE: " + circ.vve.toFixed(2), {
        left: 10,
        top: 520,
        fontFamily: 'Verdana',
        stroke: '#0000ff',
        fontSize: 32,
        selectable: false
    });

    var va = new fabric.Text(circ.va.toFixed(1), {
        left: 100,
        top: 80,
        fontFamily: 'Verdana'
    });

    var pa = new fabric.Text("MAP: " + circ.pa.toFixed(0), {
        left: 500,
        top: 20,
        fontFamily: 'Verdana',
        fontSize: 32,
        stroke: '#0000FF',
        selectable: false
    });

    var vvo = new fabric.Text("VV_0: " + circ.vvo.toFixed(2), {
        left: 10,
        top: 440,
        fontFamily: 'Verdana',
        fontSize: 32,
        stroke: '#00FF00',
        textDecoration: 'underline'
    });

    var vvo_dec = new fabric.Text("_", {
        left: 10,
        top: 460,
        fontFamily: 'Verdana',
        fontSize: 32,
        selectable: false,
        id: "vvo_dec"
    });

    var vvo_inc = new fabric.Text("+", {
        left: 170,
        top: 470,
        fontFamily: 'Verdana',
        fontSize: 32,
        selectable: false,
        id: "vvo_inc"
    });

    var hs = new fabric.Text("HS: " + circ.hs.toFixed(2), {
        left: 335,
        top: 130,
        fontFamily: 'Verdana',
        fontSize: 32,
        stroke: '#00FF00',
        textDecoration: 'underline'
    });

    var hs_dec = new fabric.Text("_", {
        left: 335,
        top: 145,
        fontFamily: 'Verdana',
        fontSize: 32,
        selectable: false,
        id: "hs_dec"
    });

    var hs_inc = new fabric.Text("+", {
        left: 455,
        top: 160,
        fontFamily: 'Verdana',
        fontSize: 32,
        selectable: false,
        id: "hs_inc"
    });

    var vv = new fabric.Text(circ.vv.toFixed(1), {
        left: 100,
        top: 100,
        fontFamily: 'Verdana',
        fontSize: 32,
        stroke: '#0000FF',
        selectable: false
    });

    var pv = new fabric.Text("PV: " + circ.pv.toFixed(1), {
        left: 10,
        top: 180,
        fontFamily: 'Verdana',
        fontSize: 32,
        stroke: '#0000FF',
        selectable: false
    });

    var run = new fabric.Text("Start", {
        left: 600,
        top: 540,
        fontFamily: 'Verdana',
        fontsize: 32,
        stroke: '#FF0000',
        selectable: false,
        id: "run_toggle"
    });

    canvas.add(ra, pra, fa, fv, pa, vvo, pv, hs, ra_inc, ra_dec, vvo_inc, vvo_dec, vve, hs_inc, hs_dec, run);
    canvas.bringToFront(fa);


    var update_display = function () {
        fa.set({text: circ.fa.toFixed((1))});
        vra.set({text: "VRA: " + circ.vra.toFixed(1)});
        ra.set({text: "RA: " + circ.ra.toFixed(2)});
        pra.set({text: "PRA: " + circ.pra.toFixed(1)});
        pa.set({text: "MAP: " + circ.pa.toFixed(0)});
        pv.set({text: "PV: " + circ.pv.toFixed(1)});
        fv.set({text: "VR: " + circ.fv.toFixed(1)});
        vvo.set({text: "VVO: " + circ.vvo.toFixed(2)});
        hs.set({text: "HS: " + circ.hs.toFixed(2)});
        vve.set({text: "VVE: " + circ.vve.toFixed(2)});
        run.set({text: running ? "Pause" : "Resume"});
        canvas.renderAll();
        //setting the text area:
        if (iterations % 10 === 0) {
            console.log(iterations);
            var log = $("#log").val();
            new_string = log.concat(Math.random().toString() + "\n");
            $("#log").val(new_string);
            textarea_update_counter = 0;
        };
    };


    var iterations = 0;

    setInterval(function () {
        if (running) {
            iterations += 1; //ms
            circ.iterate(1);
            update_display();
        }
    }, 60)
*/
})();


/*
(function () {
    console.log('hi')
    var canvas = new fabric.Canvas('c');
    console.log(canvas);
    var rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: 'red',
        width: 20,
        height: 20
    });
    canvas.add(rect);
})();
*/
