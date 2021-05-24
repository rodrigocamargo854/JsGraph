var casosConfirmados;
var populacaoEstimada;
var ultimoscasos;
var arrayGlobal = [];

function covid(cidade) {

    /*  let cidade = "Blumenau" */
    let is_last = "True"

    try {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                
                var resposta = xhr.responseText
                var resposta2 = JSON.parse(resposta)
                var resposta3 = resposta2.results
                
                casosConfirmados = resposta3[0].new_confirmed
                populacaoEstimada = resposta3[0].estimated_population
                ultimoscasos = resposta3[0].last_available_confirmed
                var resultado = populacaoEstimada/(casosConfirmados*6)
                var percent = ((resultado * 100) / populacaoEstimada)*100


                arrayGlobal.push(percent)
                    
                
            }
        }
        xhr.open('GET', 'https://api.brasil.io/v1/dataset/covid19/caso_full/data/?city=' + cidade + '&is_last=' + is_last, true);
        xhr.setRequestHeader('Authorization', 'Token 846d9c7c48f4f168a07f9380feadd314df283f8f');


    } catch (err) {
        console.log(err)
    }
    xhr.send();

}

