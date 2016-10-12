/**
 * Created by chriswri on 18/03/15.
 */


;(function () {
    const SECONDS_IN_MINUTE = 60;

    var running = true;

    // remember - the flows are converted to liters/sec
    var circ = {
        fa: 5.0 / SECONDS_IN_MINUTE,
        fv: 5.0 / SECONDS_IN_MINUTE,
        fc: 5.0 / SECONDS_IN_MINUTE,

        va: 0.85,
        vv: 3.25,
        vra: 0.1,

        ca: 0.00355,
        cv: 0.0825,
        cra: 0.005,

        ra: 19.34 * SECONDS_IN_MINUTE,
        rv: 0.74 * SECONDS_IN_MINUTE,

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

        fan: 5.0 * SECONDS_IN_MINUTE,
        hs: 1.0,

        dt: 0.05,
	pms: 7.1,

        starling: function (pra) {
            var r2 = 6 * (pra + 4);
            var r3 = Math.pow(r2, 2.5);
            var r4 = (r3 / (5000 + r3)) * 13 + 0.5;
            return r4 / SECONDS_IN_MINUTE ;
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
		this.pms = (this.vrae + this.vae + this.vve) / (this.cra + this.ca + this.cv);
            }
        }
    }

    var canvas = new fabric.Canvas('c');
    canvas.backgroundColor = "gray";
    
    canvas.on('mouse:down', function (options) {
        if (options.target) {
            if (options.target.id) {
                (deltaFunctions[options.target.id])();
            };
        };
    });

    var deltaFunctions = {
        ra_dec: function () {
            if (circ.ra > 1) {
                circ.ra -= 30;
            };
            canvas.renderAll();
        },
        ra_inc: function () {
            if (circ.ra < 3000) {
                circ.ra += 30;
            };
            canvas.renderAll();
        },
        rv_dec: function () {
            if (circ.rv > 10) {
                circ.rv -= 2;
            };
            canvas.renderAll();
        },
        rv_inc: function () {
            if (circ.rv < 3000) {
                circ.rv += 2;
            };
            canvas.renderAll();
        },
        vvo_dec: function () {
            console.log('vvo_dec');
            if (circ.vvo > 1) {
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
	   cv_dec: function () {
            console.log('cv_dec');
            if (circ.cv > 0.001) {
                circ.cv -= 0.001;
            };
            canvas.renderAll()
        },
        cv_inc: function () {
            console.log('cv_inc');
            if (circ.cv < 1.20) {
                circ.cv += 0.001;
            };
            canvas.renderAll();
        },
        ca_dec: function () {
            console.log('cv_dec');
            if (circ.ca > 0.0001) {
                circ.ca -= 0.0005;
            };
            canvas.renderAll()
        },
        ca_inc: function () {
            console.log('cv_inc');
            if (circ.ca < 1.20) {
                circ.ca += 0.0005;
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

   fabric.Image.fromURL('images/circulation.png', function(circ_image) {
        var scale = 1.0;
        circ_image.set({
            left: (canvas.width - scale * circ_image.width) / 2,
            top: (canvas.height - scale * circ_image.height) / 2 - 50,
            scaleX: scale,
            scaleY: scale,
            selectable: false
        });
        canvas.add(circ_image);
        canvas.sendToBack(circ_image);
        canvas.calcOffset();
        canvas.renderAll();
    });

    var ra = new fabric.Text("Ra: " + (circ.ra/SECONDS_IN_MINUTE).toFixed(0), {
        left: 700,
        top: 520,
        fontFamily: 'Verdana',
        fontSize: 32,
        selectable: false
    });

   var ra_inc = new fabric.Text("+", {
        left: 785,
        top: 550,
        fontFamily: 'Verdana',
        fontSize: 32,
        selectable: false,
        fill: '#00ff00', 
        id: "ra_inc"
    });

    var ra_dec = new fabric.Text("_", {
        left: 700,
        top: 535,
        fontFamily: 'Verdana',
        fontSize: 32,
        selectable: false,
	fill: '#00ff00',
        id: "ra_dec"
    });

    var rv = new fabric.Text("Rv: " + (circ.rv/SECONDS_IN_MINUTE).toFixed(2), {
        left: 100,
        top: 520,
        fontFamily: 'Verdana',
        fontSize: 32,
        selectable: false
    });

    var rv_inc = new fabric.Text("+", {
        left: 220,
        top: 550,
        fontFamily: 'Verdana',
        fontSize: 32,
        selectable: false,
        fill: '#00ff00', 
        id: "rv_inc"
    });

    var rv_dec = new fabric.Text("_", {
        left: 100,
        top: 535,
        fontFamily: 'Verdana',
        fontSize: 32,
        selectable: false,
    fill: '#00ff00',
        id: "rv_dec"
    });


    var cv = new fabric.Text("Cv: " + circ.cv.toFixed(4), {
        left: 100,
        top: 280,
        fontFamily: 'Verdana',
        fontSize: 32,
        selectable: false
    });

   var cv_inc = new fabric.Text("+", {
       left: 260,
       top: 310,
        fontFamily: 'Verdana',
        fontSize: 32,
        selectable: false,
        fill: '#00ff00', 
        id: "cv_inc"
    });

    var cv_dec = new fabric.Text("_", {
        left: 100,
        top: 295,
        fontFamily: 'Verdana',
        fontSize: 32,
        selectable: false,
	fill: '#00ff00',
        id: "cv_dec"
    });

    var ca = new fabric.Text("Ca: " + circ.ca.toFixed(4), {
        left: 700,
        top: 280,
        fontFamily: 'Verdana',
        fontSize: 32,
        selectable: false
    });

   var ca_inc = new fabric.Text("+", {
       left: 860,
       top: 310,
        fontFamily: 'Verdana',
        fontSize: 32,
        selectable: false,
        fill: '#00ff00', 
        id: "ca_inc"
    });

    var ca_dec = new fabric.Text("_", {
        left: 700,
        top: 295,
        fontFamily: 'Verdana',
        fontSize: 32,
        selectable: false,
    fill: '#00ff00',
        id: "ca_dec"
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

    var pra = new fabric.Text("Pra: " + circ.pra.toFixed(1), {
        left: 300,
        top: 80,
        fontSize: 32,
        fontFamily: 'Verdana',
        fill: '#000000',
        selectable: false

    });

    var pms = new fabric.Text("Pms: " + circ.pms.toFixed(1), {
        left: 10,
        top: 620,
        fontSize: 32,
        fontFamily: 'Verdana',
        fill: '#000000',
        selectable: false

    });

    var fa = new fabric.Text("fa: " + (circ.fa * 60).toFixed(1), {
        left: 700,
        top: 120,
        fontSize: 32,
        fontFamily: 'Verdana',
        fill: '#000000',
        selectable: false
    });

    var fv = new fabric.Text("fv: " + (circ.fv * 60).toFixed(1), {
        left: 100,
        top: 120,
        fontSize: 32,
        fontFamily: 'Verdana',
        fill: '#000000',
        selectable: false
    });


    var vae = new fabric.Text("Vae: " + circ.vve.toFixed(2), {
        left: 700,
        top: 440,
        fontFamily: 'Verdana',
        fill: '#000000',
        fontSize: 32,
        selectable: false
    });


    var vve = new fabric.Text("Vve: " + circ.vve.toFixed(2), {
        left: 100,
        top: 440,
        fontFamily: 'Verdana',
        fill: '#000000',
        fontSize: 32,
        selectable: false
    });

    var va = new fabric.Text(circ.va.toFixed(1), {
        left: 100,
        top: 80,
        fontFamily: 'Verdana'
    });

    var pa = new fabric.Text("Pa: " + circ.pa.toFixed(0),  {
        left: 700,
        top: 200,
        fontFamily: 'Verdana',
        fontSize: 32,
        fill: '#000000',
        selectable: false
    });

    var vao = new fabric.Text("Va0: " + circ.vao.toFixed(2), {
	   left: 700,
	   top: 360,
	   fontFamily: 'Verdana',
	   fontSize: 32,
	   fill: '#000000',
	   selectable: false
    });

    var vvo = new fabric.Text("Vv0: " + circ.vvo.toFixed(2), {
        left: 100,
        top: 360,
        fontFamily: 'Verdana',
        fontSize: 32,
        fill: '#000000',
        selectable: false
    });

    var vvo_dec = new fabric.Text("_", {
        left: 100,
        top: 370,
        fontFamily: 'Verdana',
        fontSize: 32,
        selectable: false,
	fill: '#00ff00',
        id: "vvo_dec"
    });

    var vvo_inc = new fabric.Text("+", {
        left: 235,
        top: 385,
        fontFamily: 'Verdana',
        fontSize: 32,
        selectable: false,
	fill: '#00ff00',
        id: "vvo_inc"
    });

    var hs = new fabric.Text("HS: " + circ.hs.toFixed(2), {
        left: 415,
        top: 200,
        fontFamily: 'Verdana',
        fontSize: 32,
        fill: '#000000',
    });

    var hs_dec = new fabric.Text("_", {
        left: 415,
        top: 210,
        fontFamily: 'Verdana',
        fontSize: 32,
        selectable: false,
	fill: '#00ff00',
        id: "hs_dec"
    });

    var hs_inc = new fabric.Text("+", {
        left: 535,
        top: 225,
        fontFamily: 'Verdana',
        fontSize: 32,
        selectable: false,
	fill: "#00ff00",
        id: "hs_inc"
    });

    var vv = new fabric.Text(circ.vv.toFixed(1), {
        left: 100,
        top: 100,
        fontFamily: 'Verdana',
        fontSize: 32,
        fill: '#0000FF',
        selectable: false
    });

    var pv = new fabric.Text("Pv: " + circ.pv.toFixed(1), {
        left: 100,
        top: 200,
        fontFamily: 'Verdana',
        fontSize: 32,
        fill: '#000000',
        selectable: false
    });

    var run = new fabric.Text("Pause", {
        left: 800,
        top: 620,
        fontFamily: 'Verdana',
        fontsize: 32,
        fill: '#00ff00',
        selectable: false,
        id: "run_toggle"
    });

    // not displaying venous return = fv here
    canvas.add(rv, rv_inc, rv_dec, ca, ca_dec, ca_inc, fv, pms, ra, pra, fa, pa, vvo, vao, pv, cv, cv_inc, cv_dec, hs, ra_inc, ra_dec, vvo_inc, vvo_dec, vae, vve, hs_inc, hs_dec, run);
   
    canvas.bringToFront(fa);


    var update_display = function () {
        fa.set({text: "fa: " + (circ.fa * 60).toFixed((1))});
        fv.set({text: "fv: " + (circ.fv * 60).toFixed((1))});
        pms.set({text: "Pms: " + circ.pms.toFixed(1)});
        vra.set({text: "Vra: " + circ.vra.toFixed(1)});
        ra.set({text: "Ra: " + (circ.ra/SECONDS_IN_MINUTE).toFixed(0)});
        rv.set({text: "Rv: " + (circ.rv/SECONDS_IN_MINUTE).toFixed(2)});
        pra.set({text: "Pra: " + circ.pra.toFixed(1)});
        pa.set({text: "Pa: " + circ.pa.toFixed(0)});
	    cv.set({text: "Cv: " + circ.cv.toFixed(4)});
        ca.set({text: "Ca: " + circ.ca.toFixed(4)});
        pv.set({text: "Pv: " + circ.pv.toFixed(1)});
        hs.set({text: "HS: " + circ.hs.toFixed(2)});
        vvo.set({text: "Vv0: " + circ.vvo.toFixed(2)});
        vao.set({text: "Va0: " + circ.vao.toFixed(2)});
        vve.set({text: "Vve: " + circ.vve.toFixed(2)});
        vae.set({text: "Vae: " + circ.vae.toFixed(2)});
  
        canvas.renderAll();
    };


    var iterations = 0;


    // every second, call circ.iterate(20) - that's one sec. worth of iteration
    setInterval(function () {
        if (running) {
            circ.iterate(20);
        }
	update_display();
    }, 1000)
})();
