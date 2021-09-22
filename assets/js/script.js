$(function() {

    $('#search').click(e => { //Reconoce el botón para búsqueda
        buscarPersonaje();
    });

    $("#clean").click(e => { //reconoce el botón para limpiar
        limpiar();
    })

    $(document).keypress(e => { //Asocia la tecla Enter para el botón buscar
        if (e.which == 13) {
            buscarPersonaje();
        }
    })
});

function buscarPersonaje() { //Da la orden de generar una búsqueda según ID
    var id_personaje = $("#input_search").val();
    //guardia
    if (validacion(id_personaje) == false) { //Valida el input para que solo sea un números
        errorInput();
        return;
    }
    //getPersonaje
    getPersonaje(id_personaje);
}

function validacion(id) {
    var expresion = /^\d{1,3}$/; //Permite solo ingreso de 1 a 3 dígitos

    if (expresion.test(id)) {
        return true;
    }
    return false;
}

function errorInput() {
    alert("Input inválido");
    $("#input_search").focus(); //Devuelve el input inválido
}

function limpiar() {
    $("#heroInfo").empty(); //Limpia la sección superHero
    $("#stats").empty(); //Limpia el gráfico
    $("#input_search").focus();
}

function getPersonaje(id) { //Obtención de ID desde API
    $.ajax({
        type: "GET",
        url: `https://superheroapi.com/api.php/4124051581042852/${id}`,
        success: function(personaje) {
            $("#heroInfo").empty(); //Permite limpiar al crear una nueva búsqueda
            $('#heroInfo').append(generarCard(personaje)); //Genera la sección superHero
            generarGrafico(personaje); //Genera el gráfico
        }
    })
}

function generarCard(personaje) { //Estructura de la sección superHero
    var card = `
        <h4>SuperHero encontrado</h4>
        <div class="card mb-3" style="max-width: 540px;">
            <div class="row no-gutters">
                <div class="col-md-4"> 
                    <img src="${personaje.image.url}" class="card-img-top" alt="...">
                </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${personaje.name}</h5>
                            <div> Conexiones: ${personaje.connections['group-affiliation']}</div>
                            <br>
                            <div> Publicado por: ${personaje.biography.publisher}</div>
                            <hr>
                            <div> Ocupación: ${personaje.work.occupation}</div>
                            <hr>
                            <div> Primera aparición: ${personaje.biography['first-appearance']}</div>
                            <hr>
                            <div> Altura: ${personaje.appearance.height.join(" - ")}</div>
                            <hr>
                            <div> Peso: ${personaje.appearance.weight.join(" - ")}</div>
                            <hr>
                            <div> Alianzas: ${personaje.biography['aliases'].join(" ")}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    return card;
}

function generarGrafico(personaje) { //Estructura gráfico
    var arrayPuntos = personajeGrafico(personaje);
    var chart = new CanvasJS.Chart("stats", {
        theme: "light2", // "light1", "light2", "dark1", "dark2"
        exportEnabled: true,
        animationEnabled: true,
        title: {
            text: `Estadísticas de poder para ${personaje.name}`
        },
        data: [{
            type: "pie",
            startAngle: 25,
            toolTipContent: "<b>{label}</b>: {y}%",
            showInLegend: "true",
            legendText: "{label}",
            indexLabelFontSize: 16,
            indexLabel: "{label} - {y}%",
            dataPoints: arrayPuntos,
        }]
    });
    chart.render();
    
}

function personajeGrafico(personaje){
    var powerstats = personaje.powerstats
    var nuevoObjeto = [ //Crea un nuevo objeto
        
    ];
    for (const key in powerstats) { //Obtención de datos para nuevo objeto
        var datos = {};
        datos.label = key
        datos.y = (powerstats[key] == "null")?0:parseInt(powerstats[key]); //Elimina error de dato null
        nuevoObjeto.push(datos) //Envia los datos a nuevoObjeto
    }

    return nuevoObjeto
}