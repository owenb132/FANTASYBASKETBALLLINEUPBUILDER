var total_projected_team_score = 0;
var total_projected_team_value = 0;

var total_projected_team_points = 0;
var total_projected_team_rebounds = 0;
var total_projected_team_assists = 0;
var total_projected_team_steals = 0;
var total_projected_team_blocks = 0;
var total_projected_team_turnovers = 0;

var chosen_player_count = 0;

var budget = 60000;

var selected_pgs = [];
var selected_sgs = [];
var selected_sfs = [];
var selected_pfs = [];
var selected_cs = [];

var open_div = '';
var div_to_empty = '';	
var this_status = '';	

$(document).ready(function() {

	jQuery("abbr.timeago").timeago();
	
	//$('#popup_container').show();
	$('#popup_container').draggable().resizable();
	
	$(".resizeable").resizable({
	    containment: "#background"
	});

	$(".draggable").draggable({
	    cursor: "crosshair",
	    containment: "#background",
	});

	$('#example_filter').addClass('theme-color-text');

	$('.cf-funnel').each(function(){
	
		// Dummy data for Funnel chart
		funData = ['0.0','0.0','0.0','0.0','0.0','0.0'];
		funLabels = ['Points','Rebounds','Assists','Steals','Blocks','Turnovers'];
		funOptions = {layout:'left',barOpacity:true,customColors:['#66ce39','#66ce39','#66ce39','#66ce39','#66ce39','#f23c25'] };
		
		cf_rFunnels[$(this).prop('id')] = new FunnelChart($(this).prop('id'), funData, funLabels, funOptions);
	});

} );

function renderPlayerTable(){
	if(!players){
		console.log('no players');
	}else{
		
		var arrayLength = players.length;
		for (var i = 0; i < arrayLength; i++) {
			var opponent = players[i]['opponent'].replace(/\s+/g, '');
			
			var points = players[i]['projected_fanduel_points'].toString().substring(0, 5);
			var value = players[i]['projected_fanduel_value'].toString().substring(0, 5);
			
			var table_row = "<tr>"+
								"<td>"+players[i]['position']+"</td>"+
			                	"<td>"+players[i]['first_name']+" "+players[i]['last_name']+"</td>"+
				                "<td>"+players[i]['price_fanduel']+"</td>"+
								"<td>"+value+"</td>"+
								"<td>"+points+"</td>"+
								"<td>"+opponent+"</td>"+
				                "<td>"+players[i]['points']+"</td>"+
				                "<td>"+players[i]['rebounds']+"</td>"+
				                "<td>"+players[i]['assists']+"</td>"+
				                "<td>"+players[i]['steals']+"</td>"+
				                "<td>"+players[i]['blocks']+"</td>"+
				                "<td>"+players[i]['turnovers']+"</td>"+
								"<td>"+'<span class="btn-group btn-group-xs">'+
											'<button class="btn btn-default btn-small add_remove_player_button_'+players[i]['id']+'" onclick="updateFunnelChart('+players[i]['id']+',1);"><i class="fa fa-plus" style="color:#66ce39"></i></button>&nbsp;'+
											'<button id="table-button-'+players[i]['id']+'" style="float:right;" type="button" class="btn btn-default btn-small create-popup" onclick="createOrShowPlayerView(\'player_'+players[i]['id']+'\',\'table-button-'+players[i]['id']+'\')"><i class="fa fa-search"></i></button>'+
										'</span></td>'+
							"</tr>";

			$('#player_table').append(table_row);
		}
		
	}
	
    $('#example').DataTable( {
        scrollY:        '50vh',
        scrollCollapse: true,
        paging:         false,
        "aoColumns": [
	      null,
	      null,
	      null,
	      null,
	      null,
	      null,
	      null,
	      null,
	      null,
	      null,
	      null,
	      null,
	      { "bSortable": false }
	    ],
	    "oLanguage": {
		    "sSearch": "Search Tonight's Players: "
		  },
		"order": [[ 2, "desc" ]]
    } );

    return true;
}





function renderTweets(){
	if(!tweets){
		console.log('no value');
	}else{

		var arrayLength = tweets.length;
		for (var i = 0; i < arrayLength; i++) {
			//var opponent = top_value[i]['opponent'].replace(/\s+/g, '');
			
			var text = tweets[i]['text'].replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
			
			if(tweets[0]['entities']['urls']){
				var url = '<a href="'+tweets[i]['entities']['urls'][0]['expanded_url']+'" target="_blank">'+tweets[i]['entities']['urls'][0]['display_url']+'</a>';
			}else{
				var url = '';
			}
			
			if(i === 0){
				var div_class = 'item active'
			}else{
				var div_class = 'item'
			}

			tweet = '<div class="'+div_class+'" style="padding-top:15px;padding-left:5px;"><br/>'+
						'<blockquote class="twitter-tweet" lang="en"><p>'+text+'</p>'+
						'<span style="font-size:75%;"><abbr class="timeago" title="'+tweets[i]['created_at']+'"></abbr><br/>'+
						'&mdash;'+tweets[i]['user']['name']+
						' <br/>'+url+'</span></blockquote></div>';

			$('#tweet-carousel').append(tweet);
		}

	}
	return true;
}



function renderMarquee(){
	var marquee = $('div.marquee');
	marquee.each(function() {
	    var mar = $(this),indent = mar.width();
		//var mar = $(this),indent = 0;
	    mar.marquee = function() {
	        indent--;
	        mar.css('text-indent',indent);
	        if (indent < -1 * mar.children('div.marquee-text').width()) {
	            indent = mar.width();
	        }
	    };
	    mar.data('interval',setInterval(mar.marquee,1000/60));
	});

	if(!top_points){
		console.log('no top points');
	}else{
	
		var arrayLength = top_points.length;
		var table_row = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Highest Projected Scoring Players</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
		$('#marquee').append(table_row);
		for (var i = 0; i < arrayLength; i++) {
			var opponent = top_points[i]['opponent'].replace(/\s+/g, '');
			
			table_row = "<span style='font-size:85%;'>$"+top_points[i]['price_fanduel']+"</span> "+top_points[i]['first_name']+" "+top_points[i]['last_name']+" v "+opponent+" - "+top_points[i]['projected_fanduel_points']+"<span style='font-size:85%;'> FanDuel points</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

			$('#marquee').append(table_row);
		}
	
	}
	
	if(!top_value){
		console.log('no top value');
	}else{
	
		var arrayLength = top_value.length;
		var table_row = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Highest Projected Value Players</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
		$('#marquee').append(table_row);
		for (var i = 0; i < arrayLength; i++) {
			var opponent = top_value[i]['opponent'].replace(/\s+/g, '');
			
			table_row = "<span style='font-size:85%;'>$"+top_value[i]['price_fanduel']+"</span> "+top_value[i]['first_name']+" "+top_value[i]['last_name']+" v "+opponent+" - "+top_value[i]['projected_fanduel_points']+"<span style='font-size:85%;'> FanDuel points</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

			$('#marquee').append(table_row);
		}
	
	}
	
	$('#banner').fadeIn();
}







function hideThisPopupContainer(id){
	$('#'+id).remove();
}




function printMousePos(e) {
    var cursorX = e.clientX;
    var cursorY = e.clientY;
    alert("X: " + cursorX + " Y: " + cursorY);
}





function createOrShowPlayerView(id,clicked_element_id){
			
	if ($('#player_'+id).length){
        alert('exists');
		return;
    }
	
	var div = $('div[id="popup_container"]');

	var klon = div.clone().prop('id', 'player_'+id );
	
	klon.draggable().resizable();
	
	klon.html('<button style="float:right;z-index:500;" type="button" class="btn btn-default" onclick="hideThisPopupContainer(\'player_'+id+'\')">x</button><img src="http://d2o2vmupkirjgs.cloudfront.net/assets/placeholders/avatar_blank@2x.png" style="height:40px;float:left;"/>');
	
	klon.prependTo( "body" );
	
	var div = document.getElementById(clicked_element_id);
	var rect = div.getBoundingClientRect();
	
	klon.css( "position", "absolute" );
	klon.css( "left", rect.left+'px' );
	klon.css( "top", rect.top+'px' );
	klon.css( "z-index", 50 );
	
	klon.fadeIn();

}

function updateFunnelChart(player_id , add_or_remove){
	//
	//add_or_remove = 1 = add
	//add_or_remove = 0 = remove
	//
	//below are our globals that we need to update
	//
	//total_projected_team_points
	//total_projected_team_value
	//
	//below is what newData needs to be to be pushed to funnel chart
	//newData = [points,rebounds,assists,steals,blocks,turnovers];

	total_projected_team_score = parseFloat(total_projected_team_score);
	total_projected_team_value = parseFloat(total_projected_team_value);
	total_projected_team_points = parseFloat(total_projected_team_points);
	total_projected_team_rebounds = parseFloat(total_projected_team_rebounds);
	total_projected_team_assists = parseFloat(total_projected_team_assists);
	total_projected_team_steals = parseFloat(total_projected_team_steals);
	total_projected_team_blocks = parseFloat(total_projected_team_blocks);
	total_projected_team_turnovers = parseFloat(total_projected_team_turnovers);

	if(add_or_remove === 1 || add_or_remove === '1'){

		//
		if( !updateSelectedPlayers(player_id , 1) ){
			return;
		}
		//

		budget = parseInt(budget);

		budget = parseInt(budget) - parseInt(players_index[player_id][0]['price_fanduel']);

		var budget_percent = ((budget/60000) * 100).toFixed(0);

		chosen_player_count++;

		var score_to_add = parseFloat(players_index[player_id][0]['projected_fanduel_points']);
		var value_to_average_in = parseFloat(players_index[player_id][0]['projected_fanduel_value']);
		total_projected_team_points = total_projected_team_points + parseFloat(players_index[player_id][0]['points']);
		total_projected_team_rebounds = total_projected_team_rebounds + parseFloat(players_index[player_id][0]['rebounds']);
		total_projected_team_assists = total_projected_team_assists + parseFloat(players_index[player_id][0]['assists']);
		total_projected_team_steals = total_projected_team_steals + parseFloat(players_index[player_id][0]['steals']);
		total_projected_team_blocks = total_projected_team_blocks + parseFloat(players_index[player_id][0]['blocks']);
		total_projected_team_turnovers = total_projected_team_turnovers + parseFloat(players_index[player_id][0]['turnovers']);

		total_projected_team_score = total_projected_team_score + score_to_add;
		total_projected_team_value = ( (total_projected_team_value* (parseFloat(chosen_player_count) -1) ) + value_to_average_in) /chosen_player_count;

		var newData = [
						total_projected_team_points.toFixed(1),
						total_projected_team_rebounds.toFixed(1),
						total_projected_team_assists.toFixed(1),
						total_projected_team_steals.toFixed(1),
						total_projected_team_blocks.toFixed(1),
						total_projected_team_turnovers.toFixed(1)
					];

		$('.add_remove_player_button_'+player_id).each(function(i, obj) {
		    $(".add_remove_player_button_"+player_id).attr("onclick","updateFunnelChart("+player_id+",0)");
		    $(".add_remove_player_button_"+player_id).html('<i class="fa fa-times" style="color:#f23c25"></i>');
		});


	}else if(add_or_remove === 0 || add_or_remove === '0'){

		//
		updateSelectedPlayers(player_id , 0);
		//

		budget = parseInt(budget);
		console.log(budget);

		var player_price = parseInt(players_index[player_id][0]['price_fanduel']);
		console.log(player_price);

		budget = parseInt( budget + player_price );
		console.log(budget);

		var budget_percent = ((budget/60000) * 100).toFixed(0);

		chosen_player_count--;

		if(chosen_player_count > 0){
			var score_to_add = parseFloat(players_index[player_id][0]['projected_fanduel_points']);
			var value_to_average_in = parseFloat(players_index[player_id][0]['projected_fanduel_value']);
			total_projected_team_points = total_projected_team_points - parseFloat(players_index[player_id][0]['points']);
			total_projected_team_rebounds = total_projected_team_rebounds - parseFloat(players_index[player_id][0]['rebounds']);
			total_projected_team_assists = total_projected_team_assists - parseFloat(players_index[player_id][0]['assists']);
			total_projected_team_steals = total_projected_team_steals - parseFloat(players_index[player_id][0]['steals']);
			total_projected_team_blocks = total_projected_team_blocks - parseFloat(players_index[player_id][0]['blocks']);
			total_projected_team_turnovers =  total_projected_team_turnovers - parseFloat(players_index[player_id][0]['turnovers']);
			total_projected_team_value = ( (total_projected_team_value*parseFloat(chosen_player_count+1)) - value_to_average_in) /chosen_player_count;
			total_projected_team_score = total_projected_team_score - score_to_add;
		}else{
			var score_to_add = 0;
			var value_to_average_in = 0;
			total_projected_team_points = 0;
			total_projected_team_rebounds = 0;
			total_projected_team_assists = 0;
			total_projected_team_steals = 0;
			total_projected_team_blocks = 0;
			total_projected_team_turnovers =  0;
			total_projected_team_value = 0;
			total_projected_team_score = 0;
		}


		var newData = [
						total_projected_team_points.toFixed(1),
						total_projected_team_rebounds.toFixed(1),
						total_projected_team_assists.toFixed(1),
						total_projected_team_steals.toFixed(1),
						total_projected_team_blocks.toFixed(1),
						total_projected_team_turnovers.toFixed(1)
					];

		$('.add_remove_player_button_'+player_id).each(function(i, obj) {
		    $(".add_remove_player_button_"+player_id).attr("onclick","updateFunnelChart("+player_id+",1)");
		    $(".add_remove_player_button_"+player_id).html('<i class="fa fa-plus" style="color:#66ce39"></i>');
		});

	}


	var formatted_score = total_projected_team_score.toString();
	var formatted_value = total_projected_team_value.toString();
	formatted_score = formatted_score.split('.');
	formatted_value = formatted_value.split('.');

	var value_decimal = formatted_value[1];

	if(formatted_value[1]){
		var value_decimal = formatted_value[1];
		value_decimal = value_decimal.substring(0, 2);
	}else{
		var value_decimal = 0;
	}

	if(formatted_score[1]){
		var score_decimal = formatted_score[1];
		score_decimal = score_decimal.substring(0, 2);
	}else{
		var score_decimal = 0;
	}


	$('#current_projected_points').html('<span class="large">'+formatted_score[0]+'<span class="small">.'+score_decimal+'</span></span>');
	$('#current_projected_value').html('<span class="large">'+formatted_value[0]+'<span class="small">.'+value_decimal+'</span></span>');

	$("#current_projected_points").effect( "bounce", {times:3}, 300 );
	$("#current_projected_value").effect( "bounce", {times:3}, 300 );

	cf_rFunnels['cf-funnel-1'].update(newData);

	//global budget
	$('#svp-1 .chart').attr('data-percent', budget_percent);
	// Update the UI metric
	$('#svp-1 .metric').html('$'+budget);

	$('.cf-svp').each(function(){
		cf_rSVPs[$(this).prop('id')] = {};
		rSVP($(this));
	});

}

function exportLineupsToCSV(){

	var A = [['n','sqrt(n)']];

	for(var j=1; j<10; ++j){ 
	    A.push([j, Math.sqrt(j)]);
	}

	var csvRows = [];

	for(var i=0, l=A.length; i<l; ++i){
	    csvRows.push(A[i].join(','));
	}

	var csvString = csvRows.join("%0A");
	var a         = document.createElement('a');
	a.href        = 'data:attachment/csv,' +  encodeURIComponent(csvString);
	a.target      = '_blank';
	a.download    = 'myFile.csv';

	document.body.appendChild(a);
	a.click();
}

function updateSelectedPlayers(player_id , add_or_remove){
	// var selected_pgs = [];
	// var selected_sgs = [];
	// var selected_sfs = [];
	// var selected_pfs = [];
	// var selected_cs = [];

	//add_or_remove === 1 add
	//add_or_remove === 0 remove

	var pg_count = selected_pgs.length;
	var sg_count = selected_sgs.length;
	var sf_count = selected_sfs.length;
	var pf_count = selected_pfs.length;
	var c_count = selected_cs.length;

	var this_player = players_index[player_id][0];

	this_player['projected_fanduel_points'] = parseFloat(this_player['projected_fanduel_points']);
	this_player['projected_fanduel_points'] = this_player['projected_fanduel_points'].toFixed(2);

	if(add_or_remove === 1 || add_or_remove === '1'){

		if (/PG/i.test(this_player['position'])){

			if(pg_count < 2){

				$( ".selected_pg_slot" ).each(function( index ) {
					var this_status = $( this ).attr("data-status");
					if(this_status === 0 || this_status === '0'){
						open_div = $( this ).attr("id");
					}
				});
				$('#'+open_div).attr("data-status",this_player['id']);

				selected_pgs.push(this_player);
				$('#'+open_div).html('<td>PG</td>'+
	                                    '<td>'+this_player['first_name']+' '+this_player['last_name']+'</td>'+
	                                    '<td>$'+this_player['price_fanduel']+'</td>'+
	                                    '<td>'+this_player['projected_fanduel_points']+'</td>'+
										'<td></td>');
			}else{
				alert('too many pgs');
				return false
			}

		}else if(/SG/i.test(this_player['position'])){

			if(sg_count < 2){

				$( ".selected_sg_slot" ).each(function( index ) {
					var this_status = $( this ).attr("data-status");
					if(this_status === 0 || this_status === '0'){
						open_div = $( this ).attr("id");
					}
				});
				$('#'+open_div).attr("data-status",this_player['id']);

				selected_sgs.push(this_player);
				$('#'+open_div).html('<td>SG</td>'+
	                                    '<td>'+this_player['first_name']+' '+this_player['last_name']+'</td>'+
	                                    '<td>$'+this_player['price_fanduel']+'</td>'+
	                                    '<td>'+this_player['projected_fanduel_points']+'</td>'+
										'<td></td>');
			}else{
				alert('too many sgs');
				return false
			}

		}else if(/SF/i.test(this_player['position'])){

			if(sf_count < 2){

				$( ".selected_sf_slot" ).each(function( index ) {
					var this_status = $( this ).attr("data-status");
					if(this_status === 0 || this_status === '0'){
						open_div = $( this ).attr("id");
					}
				});
				$('#'+open_div).attr("data-status",this_player['id']);

				selected_sfs.push(this_player);
				$('#'+open_div).html('<td>SF</td>'+
	                                    '<td>'+this_player['first_name']+' '+this_player['last_name']+'</td>'+
	                                    '<td>$'+this_player['price_fanduel']+'</td>'+
	                                    '<td>'+this_player['projected_fanduel_points']+'</td>'+
										'<td></td>');
			}else{
				alert('too many sfs');
				return false
			}

		}else if(/PF/i.test(this_player['position'])){

			if(pg_count < 2){

				$( ".selected_sf_slot" ).each(function( index ) {
					var this_status = $( this ).attr("data-status");
					if(this_status === 0 || this_status === '0'){
						open_div = $( this ).attr("id");
					}
				});
				$('#'+open_div).attr("data-status",this_player['id']);

				selected_pfs.push(this_player);
				$('#'+open_div).html('<td>PF</td>'+
	                                    '<td>'+this_player['first_name']+' '+this_player['last_name']+'</td>'+
	                                    '<td>$'+this_player['price_fanduel']+'</td>'+
	                                    '<td>'+this_player['projected_fanduel_points']+'</td>'+
										'<td></td>');
			}else{
				alert('too many pfs');
				return false
			}

		}else if(/C/i.test(this_player['position'])){

			if(pg_count < 1){

				$( ".selected_c_slot" ).each(function( index ) {
					var this_status = $( this ).attr("data-status");
					if(this_status === 0 || this_status === '0'){
						open_div = $( this ).attr("id");
					}
				});
				$('#'+open_div).attr("data-status",this_player['id']);

				selected_cs.push(this_player);
				$('#'+open_div).html('<td>C</td>'+
	                                    '<td>'+this_player['first_name']+' '+this_player['last_name']+'</td>'+
	                                    '<td>$'+this_player['price_fanduel']+'</td>'+
	                                    '<td>'+this_player['projected_fanduel_points']+'</td>'+
										'<td></td>');
			}else{
				alert('too many cs');
				return false
			}

		}

	}else{

		alert('remove');
		removePlayerFromSelectedTable(this_player['id']);

	}

	return true;

}


function removePlayerFromSelectedTable(player_id){

	// var selected_pgs = [];
	// var selected_sgs = [];
	// var selected_sfs = [];
	// var selected_pfs = [];
	// var selected_cs = [];

	var this_player = players_index[player_id][0];
	var position = this_player['position'];
	var player_id = this_player['id'];

	if (/PG/i.test(this_player['position'])){

		$( ".selected_pg_slot" ).each(function( index ) {
			this_status = $( this ).attr("data-status");
			if(parseInt(this_status) === parseInt(this_player['id'])){
				div_to_empty = $( this ).attr("id");
			}
		});

		$('#'+div_to_empty).html('<td>PG</td>'+
                                    '<td></td>'+
                                    '<td></td>'+
                                    '<td></td>'+
									'<td></td>');

		$( '#'+div_to_empty ).attr("data-status",0);

	}else if(/SG/i.test(this_player['position'])){

		$( ".selected_sg_slot" ).each(function( index ) {
			this_status = $( this ).attr("data-status");
			if(parseInt(this_status) === parseInt(this_player['id'])){
				div_to_empty = $( this ).attr("id");
			}
		});

		$('#'+div_to_empty).html('<td>SG</td>'+
                                    '<td></td>'+
                                    '<td></td>'+
                                    '<td></td>'+
									'<td></td>');

		$( '#'+div_to_empty ).attr("data-status",0);
		

	}else if(/SF/i.test(this_player['position'])){

		$( ".selected_sf_slot" ).each(function( index ) {
			this_status = $( this ).attr("data-status");
			if(parseInt(this_status) === parseInt(this_player['id'])){
				div_to_empty = $( this ).attr("id");
			}
		});

		$('#'+div_to_empty).html('<td>SF</td>'+
                                    '<td></td>'+
                                    '<td></td>'+
                                    '<td></td>'+
									'<td></td>');

		$( '#'+div_to_empty ).attr("data-status",0);		

	}else if(/PF/i.test(this_player['position'])){

		$( ".selected_pf_slot" ).each(function( index ) {
			this_status = $( this ).attr("data-status");
			if(parseInt(this_status) === parseInt(this_player['id'])){
				div_to_empty = $( this ).attr("id");
			}
		});

		$('#'+div_to_empty).html('<td>PF</td>'+
                                    '<td></td>'+
                                    '<td></td>'+
                                    '<td></td>'+
									'<td></td>');

		$( '#'+div_to_empty ).attr("data-status",0);

	}else if(/C/i.test(this_player['position'])){

		$( ".selected_c_slot" ).each(function( index ) {
			this_status = $( this ).attr("data-status");
			if(parseInt(this_status) === parseInt(this_player['id'])){
				div_to_empty = $( this ).attr("id");
			}
		});

		$('#'+div_to_empty).html('<td>C</td>'+
                                    '<td></td>'+
                                    '<td></td>'+
                                    '<td></td>'+
									'<td></td>');

		$( '#'+div_to_empty ).attr("data-status",0);

	}

}
