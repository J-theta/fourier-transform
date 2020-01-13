const Exps = document.getElementById("expressions")
const GraphElement = document.getElementById("graphs")
const resize = document.querySelector(".separator")
const resize2 = document.querySelector(".graph-sep")

function addnotes(text, calculator, id=undefined) {
    let currentState = calculator.getState()
    let expressions = currentState.expressions.list.filter(val => {
        if (val.type === "text") {
            return !!val.text
        } else if (val.type === "expression") {
            return !!val.latex
        }
    })
    let n = (id) ? id : expressions.length + 1
    let ids = expressions.map(val => {
        if (val.type === "text" && (val.text)) {
            return val.id
        }
    }).filter(x => x)
    if (!ids.includes(id)) {
        expressions.push({
            type: "text",
            id: n,
            text: text
        })
    } else {
        expressions.forEach((e, i) => {
            if (e.id === id) {
                let newxp = e
                    e.text = text
                expressions[i] = newxp
            }
        })
    }
    currentState.expressions.list = expressions
    calculator.setState({...currentState})
}

const defaultSettings = {
    keypad: false,
    invertedColors: true,
    expressions: false,
    border: false,
    xAxisMinorSubdivisions: 1,
    yAxisMinorSubdivisions: 1
}

const Settings = {
    Polar: { ...defaultSettings, polarMode: true, yAxisLabel: "Im", xAxisLabel: "R" },
    Expressions: {
        graphpaper: false,
        invertedColors: true,
        settingsMenu: false,
        keypad: false
    }
}


const Graphs = {
    Wave: document.getElementById("wave-graph"),
    Polar: document.getElementById("polar-graph"),
    Fourier: document.getElementById("fourier-graph")
}

const Calculators = {
    Wave: Desmos.GraphingCalculator(Graphs.Wave, {...defaultSettings, xAxisLabel: "t"}),
    Polar: Desmos.GraphingCalculator(Graphs.Polar, Settings.Polar),
    Fourier: Desmos.GraphingCalculator(Graphs.Fourier, {...defaultSettings, yAxisLabel: "x-coord", xAxisLabel: "frequência"}),
    Expressions: Desmos.GraphingCalculator(Exps, Settings.Expressions)
}


let x, y, dragStart = new Event("drag-start"), isDragging = false, isDragging2 = false
let dragEnds = new Event("drag-ends"), Dragging = new Event("Dragging")

window.addEventListener("dragstart", function(e) { e.preventDefault() })

window.addEventListener("mousemove", function(e) {
    let w = window.innerWidth
    let h = window.innerHeight
    x = e.clientX
    y = e.clientY
    let px = Math.round(x * 100 / w)
    let py = Math.round(y * 100 / h)

    if (px > 75) {
        x = w * .75
    } else if (px < 41) {
        x = w * .41
    }

    if (py > 70) {
        y = h * .7
    } else if (py < 20) {
        y = h * .2
    }
})

resize.addEventListener("dragstart", function(e) {
    e.preventDefault()
})

resize.addEventListener("mousedown", function(e) {
    isDragging = true
    resize.dispatchEvent(dragStart)
})

resize2.addEventListener("mousedown", function(e) {
    isDragging2 = true
    resize2.dispatchEvent(dragStart)
})

function dragging() {
    if (!isDragging) { return 0 }
    requestAnimationFrame(dragging)
    resize.dispatchEvent(Dragging)
}

function dragging2() {
    if (!isDragging2) { return 0 }
    requestAnimationFrame(dragging2)
    resize2.dispatchEvent(Dragging)
}

window.addEventListener("mouseup", function() {
    resize.dispatchEvent(dragEnds)
    resize2.dispatchEvent(dragEnds)
})

resize.addEventListener("drag-start", function() { dragging() })
resize2.addEventListener("drag-start", function() { dragging2() })
resize.addEventListener("drag-ends", function() { isDragging = false })
resize2.addEventListener("drag-ends", function() { isDragging2 = false })

resize.addEventListener("Dragging", function(e) {
    GraphElement.style.width = x + "px"
})

resize2.addEventListener("Dragging", function(e) {
    Graphs.Wave.style.height = y + "px"
})

function setExpressions() {
    let { Wave, Polar, Fourier } = Calculators
    addnotes("Aplicação por Jorge Pereira.", Calculators.Expressions)
    addnotes("Abaixo a função que representa uma onda no domínio do tempo com frequência f0 igual a 2.", Calculators.Expressions, "note-2")
    addnotes("Isso significa que a função oscila 2 vezes por segundo.", Calculators.Expressions, "note-1")
    
    Wave.setExpression({
        id: "wave",
        latex: "g(t) = \\cos(2\\pi f_{0}t)",
        secret: true,
        color: Desmos.Colors.ORANGE
    })
    Wave.setExpression({
        id: "f",
        latex: "f_{0} = 2",
        secret: true
    })
    Wave.setMathBounds({
        top: 2,
        bottom: -2,
        left: -4,
        right: 4
    })
    Fourier.setMathBounds({
        top: 5,
        bottom: -2,
        left: -1,
        right: 5
    })
    Polar.setExpression({
        id: "wave",
        latex: "g(t) = \\cos(2\\pi f_{0}t)",
        secret: true,
        color: Desmos.Colors.ORANGE,
        hidden: true
    })
    Polar.setExpression({
        id: "f",
        latex: "f_{0} = 2",
        secret: true
    })
    Polar.setExpression({
        id: "w",
        latex: "w = 2",
        secret: true
    })
    Polar.setExpression({
        id: "polar",
        latex: "r(\\theta) = g(\\frac{\\theta}{2\\pi w})",
        secret: true
    })


    Fourier.setExpression({
        id: "wave",
        latex: "g(t) = \\cos(2\\pi f_{0}t)",
        secret: true,
        color: Desmos.Colors.ORANGE,
        hidden: true
    })
    Fourier.setExpression({
        id: "f",
        latex: "f_{0} = 2",
        secret: true
    })
    Fourier.setExpression({
        id: "w",
        latex: "w = 2",
        secret: true
    })
    Fourier.setExpression({
        id: "a",
        latex: "a = 2",
        secret: true
    })
    Fourier.setExpression({
        id: "fourier",
        latex: "F(u) = \\int_{-a}^{a}(g(t)\\cdot \\cos(-2\\pi u t))dt \\{0 \\le u \\}",
        secret: true,
        color: "#00BB19"
    })
    Fourier.setExpression({
        id: "point-f",
        latex: "P = (w, F(w))",
        secret: true,
        color: Desmos.Colors.PURPLE
    })

    Calculators.Expressions.setExpression({
        id: "wave",
        latex: "g(t) = \\cos\\left(2\\pi f_{0}t\\right)",
        color: Desmos.Colors.ORANGE,
        hidden: true
    })
    addnotes("\"f0\" representa a frequência da função g(t), mas você pode muda-lo e adicionar novas frequências.", Calculators.Expressions)
    Calculators.Expressions.setExpression({
        id: "f",
        latex: "f_{0} = 2",
        sliderBounds: {min: 0, max: 10}
    })
    addnotes("\"w\" representa a frequência da função polar.", Calculators.Expressions)
    Calculators.Expressions.setExpression({
        id: "w",
        latex: "w = 2",
        sliderBounds: {min: 0, max: 10}
    })
    addnotes("\"a\" representa o intervalo em que a transformada de fourier é calculada. (Na teoria, este interva-lo é infinito).", Calculators.Expressions)
    Calculators.Expressions.setExpression({
        id: "a",
        latex: "a = 2",
        sliderBounds: {min: 0, max: 10}
    })
    Calculators.Expressions.setExpression({
        id: "i",
        latex: "i = 1",
        hidden: true,
        secret: true
    })
    Calculators.Expressions.setExpression({
        id: "Fourier",
        latex: "F\\left(f\\right) = \\int_{-a}^{a}g(t)\\cdot e^{-2\\pi i f t}dt",
        hidden: true
    })
}

window.onload = function(e) {
    setExpressions()
    let { Expressions, Polar, Wave, Fourier } = Calculators
    let { a, f, w, wave } = {
        a: Expressions.HelperExpression({latex: "a"}),
        f: Expressions.HelperExpression({latex: "f_{0}"}),
        w: Expressions.HelperExpression({latex: "w"}),
        wave: Expressions.HelperExpression({latex: "g(t)"}),
    }

    w.observe("numericValue", function() {
        let value = w.numericValue
        Polar.setExpression({
            id: "w",
            latex: "w = " + value
        })
        Fourier.setExpression({
            id: "w",
            latex: "w = " + value
        })
    })
    let FW = Fourier.HelperExpression({latex: "w"})
    FW.observe("numericValue", function() {
        let value = FW.numericValue
        Polar.setExpression({
            id: "w",
            latex: "w = " + value
        })
    })
    a.observe("numericValue", function() {
        let value = a.numericValue
        Fourier.setExpression({
            id: "a",
            latex: "a = " + value
        })
    })
    f.observe("numericValue", function() {
        let value = f.numericValue
        Polar.setExpression({
            id: "f",
            latex: "f_{0} = " + value
        })
        Fourier.setExpression({
            id: "f",
            latex: "f_{0} = " + value
        })
        Wave.setExpression({
            id: "f",
            latex: "f_{0} = " + value
        })
    })
    Calculators.Expressions.observeEvent('change', function() {
        let expressions = Calculators.Expressions.getExpressions()
        let toIgnore = ["a", "f", "w", "i", "Fourier", "fourier", "point-f", "polar", "wave"]

        for (let exp of expressions) {
            if (toIgnore.includes(exp.id)) {
                if (exp.id === "wave") {
                    Wave.setExpression({ id: "wave", latex: exp.latex })
                    Polar.setExpression({ id: "wave", latex: exp.latex, hidden: true })
                    Fourier.setExpression({ id: "wave", latex: exp.latex, hidden: true })
                }
            } else if (typeof exp.latex !== "undefined") {
                Polar.setExpression({ id: exp.id, latex: exp.latex })
                Wave.setExpression({ id: exp.id, latex: exp.latex })
                Fourier.setExpression({ id: exp.id, latex: exp.latex })
            }
        }        
        
        let ids = expressions.map(val => {
            if (!toIgnore.includes(val.id)) { return val.id }
        }).filter(val => (val))

        let ods = Fourier.getExpressions().map(val => {
            if (!toIgnore.includes(val.id)) { return val.id }
        }).filter(val => (val))

        ods.forEach((id, i) => {
            if (!ids.includes(id)) {
                Wave.removeExpression({id: id})
                Fourier.removeExpression({id: id})
                Polar.removeExpression({id: id})
            }
        })
    })
}