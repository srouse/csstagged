
CTagCircles = function(){};

CTagCircles.renderAllCircles = function ( $locs ) {
	var me = this;
	setTimeout(function() {
		$locs.each( function () {
			CTagCircles.renderCircle( $(this) );// executed when binding is done
		});
	}, 0);
}

CTagCircles.renderCircle = function ( $loc ) {
	if ( $loc.length == 0 )
		return;



	$loc.html("");

	var score = parseInt( $loc.attr("data-score") );
	var score_two = parseInt( $loc.attr("data-score-two") );
	var label = $loc.attr("data-label");
	if ( !label )
		label = score + "%";

	var base_color = $loc.attr("data-base-color");
	var score_color = $loc.attr("data-score-color");
	var score_two_color = $loc.attr("data-score-two-color");

	var pheight = parseInt($loc.height());
    var pwidth  = parseInt($loc.width());
	var radius  = ( pwidth < pheight ) ? pwidth/2 : pheight/2;
	radius -= 2;

	var paper = new Raphael( $loc[0], pwidth, pheight );

	var center_x = radius+1;
	var center_y = radius+1;

	//=========GRAPH=============
    CTagCircles.renderValuePercentSector(
		paper, 100,
		center_x, center_y,
		radius,
        base_color, ""
	);

	if ( score_two ) {
		CTagCircles.renderValuePercentSector(
			paper, score_two,
			center_x, center_y,
			radius,
	        score_two_color, ""
		);
	}

	CTagCircles.renderValuePercentSector(
		paper, score,
		center_x, center_y,
		radius+0.5,
        score_color, ""
	);



	//=============WHITE CIRCLE=============
	paper.circle(
		//pwidth/2, pheight/2,
		center_x, center_y,
		radius*.68
	).attr({
		'fill': "#fff",
		'stroke': ""
	});

	//========TEXT=============
	var center_label = paper.text(
		center_x, center_y-2, ''
	).attr({
		'fill': '#777',
		'font-size': '16',
        'font-family': 'Muli',
		'opacity': 1.0,
		'text': label
	});
}
	CTagCircles.renderValuePercentSector = function (
		paper, score , cx, cy , radius,
		progress_color, stroke_color
	) {
		//a bit of a hickup with larger sections...
		var score_percent = score// QPScore.getScorePercent( score );
		var stroke = stroke_color;
        if ( score_percent > 75 ) {

            CTagCircles.sector(
				paper , cx, cy , radius ,
				360 + 10, 270,
				{
                    fill:progress_color,
                    stroke:stroke
                }
			);

            CTagCircles.sector(
				paper , cx, cy , radius ,
				180,
                0,
				{
                    fill:progress_color,
                    stroke:stroke
                }
			);

            score_percent -= 75;
            CTagCircles.sector(
				paper , cx, cy , radius ,
				180 + (score_percent*.01)*360,
                170,
				{
                    fill:progress_color,
                    stroke:stroke
                }
			);

        }else if ( score_percent > 50 ) {

            CTagCircles.sector(
				paper , cx, cy , radius ,
				360 + 10, 270,
				{
                    fill:progress_color,
                    stroke:stroke
                }
			);

            score_percent -= 25;
            CTagCircles.sector(
				paper , cx, cy , radius ,
				90,
                0,
				{
                    fill:progress_color,
                    stroke:stroke
                }
			);

            score_percent -= 25;
            CTagCircles.sector(
				paper , cx, cy , radius ,
				90 + (score_percent*.01)*360,
                80,
				{
                    fill:progress_color,
                    stroke:stroke
                }
			);

        }else if( score_percent > 25 ) {
            CTagCircles.sector(
				paper , cx, cy , radius ,
				360 + 10, 270,
				{
                    fill:progress_color,
                    stroke:stroke
                }
			);

            score_percent -= 25;
            CTagCircles.sector(
				paper , cx, cy , radius ,
				(score_percent*.01)*360,// ,
                0,// b0ttom
				{
                    fill:progress_color,
                    stroke:stroke
                }
			);
		}else{
            CTagCircles.sector(
				paper , cx, cy , radius ,
				270 + (score_percent*.01)*360,
                270,// top
				{
                    fill:progress_color,
                    stroke:stroke
                }
			);
		}
	}

		CTagCircles.sector = function (
			paper, cx, cy, r,
			startAngle, endAngle, params
		) {
		    var rad = Math.PI / 180;
			var x1 = cx + r * Math.cos(startAngle * rad),
		        x2 = cx + r * Math.cos(endAngle * rad),
		        y1 = cy + r * Math.sin(startAngle * rad),
		        y2 = cy + r * Math.sin(endAngle * rad);
		    return paper.path([
				"M", cx, cy,
				"L", x1, y1,
				"A", r, r, 1,
				+(endAngle - startAngle > 180),
				0, x2, y2, "z"]
			).attr(params);
		}
