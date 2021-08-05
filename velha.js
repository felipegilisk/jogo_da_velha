$(window).ready(function(){
	if( localStorage.getItem("jogador_1") == null){
		localStorage.setItem("jogador_1", "Jogador 1");
	}
	
	if( localStorage.getItem("jogador_2") == null){
		localStorage.setItem("jogador_2", "Jogador 2");
	}
	
	if (localStorage.getItem("vitorias_1") == null){
		localStorage.setItem("vitorias_1", 0);
	}
	
	if (localStorage.getItem("vitorias_2") == null){
		localStorage.setItem("vitorias_2", 0);
	}
	
	if (localStorage.getItem("deu_velha") == null){
		localStorage.setItem("deu_velha", 0);
	}
	
	$("#jog_1 h4").html(localStorage.getItem("jogador_1"));
	$("#jog_2 h4").html(localStorage.getItem("jogador_2"));
	
	$("#turno").css("background-color", "#18a32e");
    
    $("#jogador_atual").html(localStorage.getItem("jogador_1"));
});

$(function(){
    var min = 0;
    var textoMin = "00"
    var seg = 0;
    var textoSeg = "00";
    var turno = true; //true = verde ; false = vermelho
    var finaliza = false;
	var contaJogadas = 0;
    
	resetaCronometro = setInterval(function(){
		seg++;
		if (seg < 10){
			textoSeg = "0" + seg;
		} else if (seg < 60){
			textoSeg = seg;
		} else {
			seg = 0;
			textoSeg = "00";
			//aumenta minutos quando segundos == 60
			min++;
			if (min < 10){
				textoMin = "0" + min;
			} else {
				textoMin = min;
			}
		}
		//preenche o cronômetro    
		$("#mmss").html(textoMin + ":" + textoSeg);
		
	}, 1000);
	
	//altera o nome do jogador exibido
	//alterna o próximo preenchimento entre verde e vermelho
    $("div").click(function(){
        if (turno && finaliza == false){
			$("#jogador").html(localStorage.getItem("jogador_1"));
            if ( !$(this).hasClass("verde") && !$(this).hasClass("vermelho") ){
                $(this).addClass("verde");
                $(".verde .bola").show();
                turno = turnoVermelho();
                
				contaJogadas++;
				finaliza = checaVitoria();
            }
        }else if (finaliza == false){
			$("#jogador").html(localStorage.getItem("jogador_2"));
            if ( !$(this).hasClass("verde") && !$(this).hasClass("vermelho") ){
                $(this).addClass("vermelho");
                $(".vermelho .xis").show();
                turno = turnoVerde();
                
				contaJogadas++;
				finaliza = checaVitoria();
            }
        }
		
		if (finaliza){
			clearInterval(resetaCronometro);
		} else if (contaJogadas == 9){
			$("#turno").css("background-color", "#a5a5a5");
			$("#turno h3").html("VENCEDOR:");
			$("#jogador_atual").html("- deu velha -");
            
			finaliza = true;
			
            aumentaVitorias = parseInt(localStorage.getItem("deu_velha"));
            aumentaVitorias++;
            localStorage.setItem("deu_velha", aumentaVitorias);
            $("#velha").html(aumentaVitorias);
            
			$("div").removeClass();
			clearInterval(resetaCronometro);
		}
		
    });
	
	//botão renomear jogadores
	$("#renomear").click(function(){
        $("form").slideToggle();
        if (finaliza == false) {
            $("#nome_1").val(localStorage.getItem("jogador_1"));
            $("#nome_2").val(localStorage.getItem("jogador_2"));
        }
        $("main").slideToggle();
	});
    
	//botão confirma para renomear
    $("#confirma").click(function(){
        localStorage.setItem("jogador_1", $("#nome_1").val());
        localStorage.setItem("jogador_2", $("#nome_2").val());
        
        $("#jog_1 h4").html(localStorage.getItem("jogador_1"));
        $("#jog_2 h4").html(localStorage.getItem("jogador_2"));
        
        $("form").slideUp();
		$("main").slideDown();
		if (turno){
			$("#jogador_atual").html(localStorage.getItem("jogador_1"));
		} else {
			$("#jogador_atual").html(localStorage.getItem("jogador_2"));
		}
    });
    
	//botão cancela para renomear
    $("#cancela").click(function(){
        $("form").slideUp();
		$("main").slideDown();
    });
    
	//botão novo jogo
	//reseta o cronômetro
	//reseta o contaJogadas
    $("#novo_jogo").click(function(){
		//reseta os marcadores do jogo
		contaJogadas = 0;
		finaliza = false;
		
		$("#turno h3").html("Turno atual:");
		
		//limpa o quadro
        $("section div").removeClass();
        $("img").hide();
        
		//reseta o cronômetro
		seg = 0;
        min = 0;
        $("#mmss").html("00:00");
		
        clearInterval(resetaCronometro);
		seg = 0;
		textoSeg = "00";
		min = 0;
		textoMin = "00";
		resetaCronometro = setInterval(function(){
			seg++;
			if (seg < 10){
				textoSeg = "0" + seg;
			} else if (seg < 60){
				textoSeg = seg;
			} else {
				seg = 0;
				textoSeg = "00";
				//aumenta minutos quando segundos == 60
				min++;
				if (min < 10){
					textoMin = "0" + min;
				} else {
					textoMin = min;
				}
			}
    		$("#mmss").html(textoMin + ":" + textoSeg);
        
		}, 1000);
		
		$("#turno").removeClass();
		
		//define o primeiro ganhador como o perdedor da última partida
		if (localStorage.getItem("ultima_vitoria") == "vermelho"){
			turno = turnoVerde();
		} else {
			turno = turnoVermelho();
		}
		
    });
	
	//botão resetar placar
	$("#resetar").click(function(){
		localStorage.setItem("vitorias_1", 0);
		localStorage.setItem("vitorias_2", 0);
        localStorage.setItem("deu_velha", 0);
		$("#vitorias1").html("0");
		$("#vitorias2").html("0");
        $("#velha").html("0");
	});
	
	//botão passar a vez - só funciona no início do jogo (contaJogadas == 0)
	$("#passar").click(function(){
		if (contaJogadas == 0){
			if (turno){
				turno = turnoVermelho();
			} else {
				turno = turnoVerde();
			}
		} else {
			alert("Só é possível passar a vez no início do jogo!");
		}
		
	});
});

//parametriza a parte da página que mostra o turno
//altera o turno para vermelho
function turnoVermelho(){
	$("#jogador_atual").html(localStorage.getItem("jogador_2"));
	$("#turno").css("background-color", "#ff4848");
	return false;
}
//altera o turno para verde
function turnoVerde(){
	$("#jogador_atual").html(localStorage.getItem("jogador_1"));
	$("#turno").css("background-color", "#18a32e");
	return true;
}

//verifica se o jogo finalizou
function checaVitoria(){
	
	var casas = ["", "", "", "", "", "", "", "", ""];
	
	var ganhador = "";
	var aumentaVitorias;
	
	//verifica se o jogo acabou para encerrar as checagens
	var acabou = false;
	
	
	//armazena o preenchimento do quadro no vetor casas
	for (i = 0; i < 10; i++){
		if ($("#quadro_"+i).hasClass("verde")){
			casas[i] = "verde";
		} else if ($("#quadro_"+i).hasClass("vermelho")){
			casas[i] = "vermelho";
		}
	}

	//verifica se o jogo teve um ganhador
	//a partir da casa 0
	if (casas[0] != ""){
		
		//horizontal
		if (casas[0] == casas[1] && casas[0] == casas[2]) {
			acabou = true;
			if (casas[0] == "verde"){
				ganhador = "verde";
			} else {
				ganhador = "vermelho";
			}
			$("#quadro_3").removeClass();
			$("#quadro_4").removeClass();
			$("#quadro_5").removeClass();
			$("#quadro_6").removeClass();
			$("#quadro_7").removeClass();
			$("#quadro_8").removeClass();
			
		//vertical
		} else if (casas[0] == casas[3] && casas[0] == casas[6]) {
			acabou = true;
			if (casas[0] == "verde"){
				ganhador = "verde";
			} else {
				ganhador = "vermelho";
			}
			$("#quadro_1").removeClass();
			$("#quadro_2").removeClass();
			$("#quadro_4").removeClass();
			$("#quadro_5").removeClass();
			$("#quadro_7").removeClass();
			$("#quadro_8").removeClass();
		//diagonal
		} else if (casas[0] == casas[4] && casas[0] == casas[8]) {
			acabou = true;
			if (casas[0] == "verde"){
				ganhador = "verde";
			} else {
				ganhador = "vermelho";
			}
			$("#quadro_1").removeClass();
			$("#quadro_2").removeClass();
			$("#quadro_3").removeClass();
			$("#quadro_5").removeClass();
			$("#quadro_6").removeClass();
			$("#quadro_7").removeClass();
		}
	}
	
	//a partir da casa 2
	if (casas[2] != "" && acabou == false){
		//vertical
		if (casas[2] == casas[5] && casas[2] == casas[8]) {
			acabou = true;
			if (casas[2] == "verde"){
				ganhador = "verde";
			} else {
				ganhador = "vermelho";
			}
			$("#quadro_0").removeClass();
			$("#quadro_1").removeClass();
			$("#quadro_3").removeClass();
			$("#quadro_4").removeClass();
			$("#quadro_6").removeClass();
			$("#quadro_7").removeClass();
		//diagonal
		} else if (casas[2] == casas[4] && casas[2] == casas[6]) {
			acabou = true;
			if (casas[2] == "verde"){
				ganhador = "verde";
			} else {
				ganhador = "vermelho";
			}
			$("#quadro_0").removeClass();
			$("#quadro_1").removeClass();
			$("#quadro_3").removeClass();
			$("#quadro_5").removeClass();
			$("#quadro_7").removeClass();
			$("#quadro_8").removeClass();
		}
	}
	
	//a partir da casa 4
	if (casas[4] != "" && acabou == false){
		//vertical
		if (casas[4] == casas[1] && casas[4] == casas[7]) {
			acabou = true;
			if (casas[4] == "verde"){
				ganhador = "verde";
			} else {
				ganhador = "vermelho";
			}
			$("#quadro_0").removeClass();
			$("#quadro_2").removeClass();
			$("#quadro_3").removeClass();
			$("#quadro_5").removeClass();
			$("#quadro_6").removeClass();
			$("#quadro_8").removeClass();
		//horizontal
		} else if (casas[4] == casas[3] && casas[4] == casas[5]) {
			acabou = true;
			if (casas[4] == "verde"){
				ganhador = "verde";
			} else {
				ganhador = "vermelho";
			}
			$("#quadro_0").removeClass();
			$("#quadro_1").removeClass();
			$("#quadro_2").removeClass();
			$("#quadro_6").removeClass();
			$("#quadro_7").removeClass();
			$("#quadro_8").removeClass();
		}
	}
	
	//a partir da casa 6
	if (casas[6] != "" && acabou == false){
		//horizontal
		if (casas[6] == casas[7] && casas[6] == casas[8]) {
			acabou = true;
			if (casas[6] == "verde"){
				ganhador = "verde";
			} else {
				ganhador = "vermelho";
			}
			$("#quadro_0").removeClass();
			$("#quadro_1").removeClass();
			$("#quadro_2").removeClass();
			$("#quadro_3").removeClass();
			$("#quadro_4").removeClass();
			$("#quadro_5").removeClass();
		}
	}
	
	//registra a vitoria do jogador no placar
	//retorna false caso o jogo não tenha encerrado
	if (ganhador == "verde"){
		aumentaVitorias = parseInt(localStorage.getItem("vitorias_1"));
		aumentaVitorias++;
		localStorage.setItem("vitorias_1", aumentaVitorias);
		$("#vitorias1").html(aumentaVitorias);
		
		localStorage.setItem("ultima_vitoria", "verde");
		clearInterval(resetaCronometro);
		
		$("#jogador_atual").html(localStorage.getItem("jogador_1"));
		$("#turno").addClass("vitoriaVerde");
		$("#turno h3").html("VENCEDOR:");
		
		return true;
		
	} else if (ganhador == "vermelho"){
		aumentaVitorias = parseInt(localStorage.getItem("vitorias_2"));
		aumentaVitorias++;
		localStorage.setItem("vitorias_2", aumentaVitorias);
		$("#vitorias2").html(aumentaVitorias);
		
		localStorage.setItem("ultima_vitoria", "vermelho");
		clearInterval(resetaCronometro);
		
		$("#jogador_atual").html(localStorage.getItem("jogador_2"));
		$("#turno").addClass("vitoriaVermelho");
		$("#turno h3").html("VENCEDOR:");
		
		return true;
	} else {
		return false;
	}
}